import { RISK_ALERTS } from '../data/prototypeData';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'kartavya_risk_alerts';

export const riskService = {
  getRisks: async (filters = {}) => {
    const res = await apiClient.get('/risks', filters);
    if (!res || res.isFallback) {
      const stored = localStorage.getItem(STORAGE_KEY);
      let risks = stored ? JSON.parse(stored) : RISK_ALERTS;

      if (filters.severity && filters.severity !== 'All') {
        risks = risks.filter(r => r.severity.toLowerCase() === filters.severity.toLowerCase());
      }

      if (filters.location && filters.location !== 'All') {
        risks = risks.filter(r => r.location === filters.location);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        risks = risks.filter(r => 
          r.title.toLowerCase().includes(q) ||
          r.supplyCategory.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.riskExplanation.toLowerCase().includes(q)
        );
      }

      return {
        data: risks,
        isPrototypeData: true,
        summary: {
          total: risks.length,
          critical: risks.filter(r => r.severity === 'critical').length,
          high: risks.filter(r => r.severity === 'high').length,
          medium: risks.filter(r => r.severity === 'medium').length,
          low: risks.filter(r => r.severity === 'low').length,
        }
      };
    }
    return res;
  },

  getRiskById: async (id) => {
    const res = await apiClient.get(`/risks/${id}`);
    if (!res || res.isFallback) {
      const stored = localStorage.getItem(STORAGE_KEY);
      const risks = stored ? JSON.parse(stored) : RISK_ALERTS;
      const risk = risks.find(r => r.id === id);
      if (!risk) throw new Error(`Risk alert ${id} not found.`);
      return { data: risk, isPrototypeData: true };
    }
    return res;
  }
};
