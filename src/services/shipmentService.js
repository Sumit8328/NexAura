import { INITIAL_SHIPMENTS } from '../data/prototypeData';
import { apiClient } from './apiClient';
import { auditService } from './auditService';
import { syncService } from './syncService';

const SHIPMENTS_STORAGE_KEY = 'kartavya_shipments';

export const SHIPMENT_STATUSES = [
  'Requested',
  'Approved',
  'Allocated',
  'Dispatched',
  'In Transit',
  'Arrived',
  'Received',
  'Closed'
];

const getLocalShipments = () => {
  const stored = localStorage.getItem(SHIPMENTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
    return [...INITIAL_SHIPMENTS];
  }
  return JSON.parse(stored);
};

const saveLocalShipments = (items) => {
  localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(items));
};

export const shipmentService = {
  getShipments: async (filters = {}) => {
    const res = await apiClient.get('/shipments', filters);
    if (!res || res.isFallback) {
      let items = getLocalShipments();

      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(s => 
          s.id.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.transportOption.toLowerCase().includes(q)
        );
      }

      if (filters.status && filters.status !== 'All') {
        items = items.filter(s => s.status.toLowerCase() === filters.status.toLowerCase());
      }

      if (filters.destination && filters.destination !== 'All') {
        items = items.filter(s => s.destination === filters.destination);
      }

      return {
        data: items,
        isPrototypeData: true,
        counts: {
          total: items.length,
          inTransit: items.filter(s => s.status === 'In Transit').length,
          arrived: items.filter(s => s.status === 'Arrived').length,
          allocated: items.filter(s => s.status === 'Allocated').length,
          received: items.filter(s => s.status === 'Received').length,
        }
      };
    }
    return res;
  },

  getShipmentById: async (id) => {
    const res = await apiClient.get(`/shipments/${id}`);
    if (!res || res.isFallback) {
      const items = getLocalShipments();
      const item = items.find(s => s.id === id);
      if (!item) throw new Error(`Shipment ${id} not found.`);
      return { data: item, isPrototypeData: true };
    }
    return res;
  },

  advanceStatus: async (id, targetStatus, note, actor = 'Logistics Operator (Local)') => {
    const currentList = getLocalShipments();
    const idx = currentList.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Shipment ${id} not found.`);

    const shipment = currentList[idx];
    const currentIndex = SHIPMENT_STATUSES.indexOf(shipment.status);
    let newStatus = targetStatus;

    if (!newStatus) {
      if (currentIndex === -1 || currentIndex >= SHIPMENT_STATUSES.length - 1) {
        throw new Error(`Shipment ${id} is already in terminal state "${shipment.status}".`);
      }
      newStatus = SHIPMENT_STATUSES[currentIndex + 1];
    } else {
      const targetIndex = SHIPMENT_STATUSES.indexOf(newStatus);
      if (targetIndex === -1) throw new Error(`Invalid target status "${newStatus}".`);
      if (targetIndex < currentIndex) {
        throw new Error(`Cannot reverse status from "${shipment.status}" back to "${newStatus}".`);
      }
    }

    const previousStatus = shipment.status;
    const eventNote = note || `Status progressed to ${newStatus} by ${actor}.`;
    
    // Calculate progress percentage
    const targetIdx = SHIPMENT_STATUSES.indexOf(newStatus);
    const progressPercent = Math.min(100, Math.round((targetIdx / (SHIPMENT_STATUSES.length - 1)) * 100));

    const updatedTimeline = [
      ...shipment.timeline,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: eventNote
      }
    ];

    const updatedShipment = {
      ...shipment,
      status: newStatus,
      progressPercent,
      lastUpdate: eventNote,
      timeline: updatedTimeline
    };

    currentList[idx] = updatedShipment;
    saveLocalShipments(currentList);

    await auditService.logAction({
      actor,
      action: 'Shipment Status Transition',
      entityType: 'Shipment Tracking',
      entityId: id,
      previousValue: previousStatus,
      updatedValue: newStatus,
      reason: eventNote
    });

    syncService.enqueueAction({
      type: 'SHIPMENT_STATUS_UPDATE',
      payload: { id, newStatus, eventNote, actor }
    });

    return { success: true, shipment: updatedShipment };
  },

  resetDefaults: () => {
    localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
  }
};
