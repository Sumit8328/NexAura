import { INITIAL_AUDIT_LOGS } from '../data/prototypeData';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'kartavya_audit_logs';

export const auditService = {
  getLogs: async (filters = {}) => {
    const res = await apiClient.get('/audit', filters);
    if (!res || res.isFallback) {
      const stored = localStorage.getItem(STORAGE_KEY);
      let logs = stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        logs = logs.filter(l => 
          l.actor.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q) ||
          l.reason?.toLowerCase().includes(q)
        );
      }

      if (filters.entityType && filters.entityType !== 'All') {
        logs = logs.filter(l => l.entityType === filters.entityType);
      }

      return {
        data: logs,
        isPrototypeData: true,
        source: 'Local Prototype Audit Store',
        totalCount: logs.length
      };
    }
    return res;
  },

  logAction: async ({ actor = 'Operator (Local)', action, entityType, entityId, previousValue = '—', updatedValue, reason = 'Direct user command', status = 'Success' }) => {
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      entityType,
      entityId,
      previousValue,
      updatedValue,
      reason,
      status
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const logs = stored ? JSON.parse(stored) : [...INITIAL_AUDIT_LOGS];
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 100))); // Keep last 100
    
    // Also try to send to backend if configured
    if (apiClient.isBackendConfigured()) {
      try {
        await apiClient.post('/audit', newEntry);
      } catch (e) {
        console.warn('Backend audit push skipped:', e.message);
      }
    }

    return newEntry;
  },

  clearAuditLogs: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
};
