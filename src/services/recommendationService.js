import { INITIAL_RECOMMENDATIONS } from '../data/prototypeData';
import { apiClient } from './apiClient';
import { auditService } from './auditService';
import { syncService } from './syncService';
import { shipmentService } from './shipmentService';

const RECOMMENDATIONS_STORAGE_KEY = 'kartavya_recommendations';
const LEGACY_RECOMMENDATIONS_KEY = 'astralogistics_recommendations';

const getLocalRecs = () => {
  const stored = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY) || localStorage.getItem(LEGACY_RECOMMENDATIONS_KEY);
  if (!stored) {
    localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(INITIAL_RECOMMENDATIONS));
    return [...INITIAL_RECOMMENDATIONS];
  }
  return JSON.parse(stored);
};

const saveLocalRecs = (recs) => {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recs));
};

export const recommendationService = {
  getRecommendations: async (filters = {}) => {
    const res = await apiClient.get('/recommendations', filters);
    if (!res || res.isFallback) {
      let recs = getLocalRecs();

      if (filters.status && filters.status !== 'All') {
        recs = recs.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
      }

      if (filters.priority && filters.priority !== 'All') {
        recs = recs.filter(r => r.priority.toLowerCase() === filters.priority.toLowerCase());
      }

      if (filters.location && filters.location !== 'All') {
        recs = recs.filter(r => r.location === filters.location);
      }

      return {
        data: recs,
        isPrototypeData: true,
        counts: {
          total: recs.length,
          pending: recs.filter(r => r.status === 'Pending Review').length,
          approved: recs.filter(r => r.status === 'Approved').length,
          modified: recs.filter(r => r.status === 'Modified').length,
          rejected: recs.filter(r => r.status === 'Rejected').length,
          executed: recs.filter(r => r.status === 'Executed').length,
        }
      };
    }
    return res;
  },

  getRecommendationById: async (id) => {
    const res = await apiClient.get(`/recommendations/${id}`);
    if (!res || res.isFallback) {
      const recs = getLocalRecs();
      const rec = recs.find(r => r.id === id);
      if (!rec) throw new Error(`Recommendation ${id} not found.`);
      return { data: rec, isPrototypeData: true };
    }
    return res;
  },

  approveRecommendation: async (id, reviewer = 'Command Duty Officer (Local)') => {
    const res = await apiClient.post(`/recommendations/${id}/approve`, { reviewer });
    if (!res || res.isFallback) {
      const recs = getLocalRecs();
      const idx = recs.findIndex(r => r.id === id);
      if (idx === -1) throw new Error(`Recommendation ${id} not found.`);

      const rec = recs[idx];
      const updated = {
        ...rec,
        status: 'Approved',
        approvedAt: new Date().toISOString(),
        approvedBy: reviewer,
        executionNote: 'Recommendation validated by human controller. Shipment dispatch remains uncommitted awaiting allocation.'
      };
      recs[idx] = updated;
      saveLocalRecs(recs);

      await auditService.logAction({
        actor: reviewer,
        action: 'Recommendation Approved',
        entityType: 'Replenishment Recommendation',
        entityId: id,
        previousValue: 'Pending Review',
        updatedValue: `Approved (${rec.suggestedReplenishmentQty.toLocaleString()} ${rec.unit})`,
        reason: 'Officer confirmed operational need and risk justification'
      });

      syncService.enqueueAction({
        type: 'RECOMMENDATION_APPROVE',
        payload: { id, reviewer }
      });

      return { success: true, recommendation: updated };
    }
    return res;
  },

  rejectRecommendation: async (id, reason, reviewer = 'Command Duty Officer (Local)') => {
    if (!reason || !reason.trim()) {
      throw new Error('A detailed operational rejection reason is required.');
    }

    const res = await apiClient.post(`/recommendations/${id}/reject`, { reason, reviewer });
    if (!res || res.isFallback) {
      const recs = getLocalRecs();
      const idx = recs.findIndex(r => r.id === id);
      if (idx === -1) throw new Error(`Recommendation ${id} not found.`);

      const rec = recs[idx];
      const updated = {
        ...rec,
        status: 'Rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: reviewer,
        rejectionReason: reason
      };
      recs[idx] = updated;
      saveLocalRecs(recs);

      await auditService.logAction({
        actor: reviewer,
        action: 'Recommendation Rejected',
        entityType: 'Replenishment Recommendation',
        entityId: id,
        previousValue: rec.status,
        updatedValue: 'Rejected',
        reason
      });

      syncService.enqueueAction({
        type: 'RECOMMENDATION_REJECT',
        payload: { id, reason, reviewer }
      });

      return { success: true, recommendation: updated };
    }
    return res;
  },

  modifyRecommendation: async (id, { modifiedQty, modifiedTransport, reason, reviewer = 'Command Duty Officer (Local)' }) => {
    const parsedQty = Number(modifiedQty);
    if (!parsedQty || parsedQty <= 0) {
      throw new Error('Modified quantity must be a positive number.');
    }
    if (!reason || !reason.trim()) {
      throw new Error('A modification justification reason is mandatory.');
    }

    const res = await apiClient.patch(`/recommendations/${id}/modify`, { modifiedQty: parsedQty, modifiedTransport, reason, reviewer });
    if (!res || res.isFallback) {
      const recs = getLocalRecs();
      const idx = recs.findIndex(r => r.id === id);
      if (idx === -1) throw new Error(`Recommendation ${id} not found.`);

      const rec = recs[idx];
      const prevQty = rec.suggestedReplenishmentQty;
      const updated = {
        ...rec,
        status: 'Modified',
        suggestedReplenishmentQty: parsedQty,
        transportMode: modifiedTransport || rec.transportMode,
        modifiedAt: new Date().toISOString(),
        modifiedBy: reviewer,
        modificationReason: reason,
        originalQty: prevQty
      };
      recs[idx] = updated;
      saveLocalRecs(recs);

      await auditService.logAction({
        actor: reviewer,
        action: 'Recommendation Modified',
        entityType: 'Replenishment Recommendation',
        entityId: id,
        previousValue: `${prevQty.toLocaleString()} ${rec.unit}`,
        updatedValue: `${parsedQty.toLocaleString()} ${rec.unit} (${modifiedTransport || rec.transportMode})`,
        reason
      });

      syncService.enqueueAction({
        type: 'RECOMMENDATION_MODIFY',
        payload: { id, modifiedQty: parsedQty, modifiedTransport, reason, reviewer }
      });

      return { success: true, recommendation: updated };
    }
    return res;
  },

  createRecommendation: async ({
    location = 'Sector-4 Forward Depot',
    supplyCategory = 'Fuel (JP-8 Synthetic)',
    suggestedReplenishmentQty = 15000,
    transportMode = 'Autonomous Armored Rail Tanker',
    priority = 'High',
    explanation = 'Manually generated algorithmic replenishment requisition based on forward operational telemetry analysis.',
    actor = 'Logistics Command (Local)'
  }) => {
    const recs = getLocalRecs();
    const nextNum = recs.length + 1;
    const newId = `REC-30${nextNum}`;
    
    // Determine unit
    let unit = 'Litres';
    if (supplyCategory.includes('Rations')) unit = 'Kilograms';
    else if (supplyCategory.includes('Medical')) unit = 'Kits';
    else if (supplyCategory.includes('Water')) unit = 'Litres';
    else if (supplyCategory.includes('Batteries')) unit = 'Units';
    else if (supplyCategory.includes('Spares')) unit = 'Units';

    const newRec = {
      id: newId,
      priority,
      location,
      supplyCategory,
      currentStock: `Dynamic Reserves`,
      forecastDemand: `Surge Pattern (${suggestedReplenishmentQty.toLocaleString()} ${unit})`,
      estimatedShortageRisk: `${priority === 'Critical' ? 'Imminent (Day 2.8)' : 'Buffer Breach (Day 4.5)'}`,
      suggestedReplenishmentQty: Number(suggestedReplenishmentQty),
      unit,
      transportMode,
      routeAlternatives: [
        { name: 'Corridor Diamond (Hyper-Rail Mainline)', riskLevel: 'Low Hazard', etaHours: 4.5 },
        { name: 'Skybridge Air Corridor 09 (VTOL)', riskLevel: 'Severe Weather', etaHours: 2.1 }
      ],
      explanation,
      dataLimitations: 'Synthetic heuristic calculation generated during local command session.',
      status: 'Pending Review',
      illustrativeETA: '4.8 Hours',
      generatedAt: new Date().toISOString()
    };

    recs.unshift(newRec);
    saveLocalRecs(recs);

    await auditService.logAction({
      actor,
      action: 'Recommendation Generated',
      entityType: 'Replenishment Recommendation',
      entityId: newId,
      previousValue: 'None',
      updatedValue: `Pending Review (${newRec.suggestedReplenishmentQty.toLocaleString()} ${unit})`,
      reason: explanation
    });

    return { success: true, recommendation: newRec };
  },

  executeRecommendation: async (id, actor = 'Logistics Officer (Local)') => {
    const recs = getLocalRecs();
    const idx = recs.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Recommendation ${id} not found.`);

    const rec = recs[idx];
    if (rec.status !== 'Approved' && rec.status !== 'Modified') {
      throw new Error('Only Approved or Modified recommendations can be transitioned to Executed.');
    }

    // Automatically stage a real Shipment in active transit tracking!
    const shipmentResult = await shipmentService.createShipment({
      recommendationId: rec.id,
      destination: rec.location,
      category: rec.supplyCategory,
      quantity: rec.suggestedReplenishmentQty,
      unit: rec.unit,
      transportOption: rec.transportMode,
      priority: rec.priority
    });

    const updated = {
      ...rec,
      status: 'Executed',
      executedAt: new Date().toISOString(),
      stagedShipmentId: shipmentResult?.shipment?.id || 'KTV-AUTO'
    };
    recs[idx] = updated;
    saveLocalRecs(recs);

    await auditService.logAction({
      actor,
      action: 'Recommendation Executed',
      entityType: 'Replenishment Recommendation',
      entityId: id,
      previousValue: rec.status,
      updatedValue: `Executed (Manifest ${shipmentResult?.shipment?.id || 'Staged'})`,
      reason: 'Formal requisition order cut and automatically transferred to active freight dispatch queue.'
    });

    return { success: true, recommendation: updated, shipment: shipmentResult?.shipment };
  },

  resetDefaults: () => {
    localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(INITIAL_RECOMMENDATIONS));
  }
};
