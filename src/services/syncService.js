import { auditService } from './auditService';

const SYNC_QUEUE_KEY = 'kartavya_sync_queue';
const SYNC_STATUS_KEY = 'kartavya_sync_status';

export const syncService = {
  getStatus: () => {
    const saved = localStorage.getItem(SYNC_STATUS_KEY);
    return saved ? JSON.parse(saved) : {
      state: 'Connected', // 'Connected' | 'Offline' | 'Pending Synchronization' | 'Synchronization Error'
      lastSyncedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      pendingCount: 0,
      autoSyncEnabled: true,
      lastSyncError: null
    };
  },

  setStatus: (status) => {
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
    window.dispatchEvent(new CustomEvent('kartavya_sync_change', { detail: status }));
  },

  getQueue: () => {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  },

  enqueueAction: (action) => {
    const queue = syncService.getQueue();
    const item = {
      id: `SYNC-${Date.now()}`,
      queuedAt: new Date().toISOString(),
      action: action.type,
      payload: action.payload,
      status: 'Queued'
    };
    queue.push(item);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    
    // Update status
    const currentStatus = syncService.getStatus();
    currentStatus.pendingCount = queue.length;
    if (currentStatus.state === 'Connected') {
      currentStatus.state = 'Pending Synchronization';
    }
    syncService.setStatus(currentStatus);

    return item;
  },

  triggerSync: async () => {
    const queue = syncService.getQueue();
    const status = syncService.getStatus();

    if (status.state === 'Offline') {
      throw new Error('Cannot synchronize while system is in Offline mode.');
    }

    // Simulate network sync latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Clear queue
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));

    const updatedStatus = {
      state: 'Connected',
      lastSyncedAt: new Date().toISOString(),
      pendingCount: 0,
      autoSyncEnabled: status.autoSyncEnabled,
      lastSyncError: null
    };
    syncService.setStatus(updatedStatus);

    await auditService.logAction({
      action: 'Batch Cloud Synchronized',
      entityType: 'System Synchronization',
      entityId: `BATCH-${Date.now().toString().slice(-4)}`,
      previousValue: `${queue.length} pending events`,
      updatedValue: '0 pending • Synchronized',
      reason: 'Manual or automated synchronization cycle completed'
    });

    return {
      syncedCount: queue.length,
      timestamp: updatedStatus.lastSyncedAt,
      success: true
    };
  },

  setSimulationState: (state) => {
    const current = syncService.getStatus();
    current.state = state;
    if (state === 'Synchronization Error') {
      current.lastSyncError = 'Gateway timeout on upstream Antigravity cluster relay (HTTP 504)';
    } else {
      current.lastSyncError = null;
    }
    syncService.setStatus(current);
  }
};
