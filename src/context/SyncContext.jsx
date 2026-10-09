import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { syncService } from '../services/syncService';
import { useToast } from './ToastContext';

const SyncContext = createContext(null);

export const SyncProvider = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState(syncService.getStatus());
  const [syncQueue, setSyncQueue] = useState(syncService.getQueue());
  const [isSyncing, setIsSyncing] = useState(false);
  const { success, error, info, warning } = useToast();

  const refreshStatus = useCallback(() => {
    setSyncStatus(syncService.getStatus());
    setSyncQueue(syncService.getQueue());
  }, []);

  useEffect(() => {
    refreshStatus();
    const handleSyncChange = (e) => {
      setSyncStatus(e.detail);
      setSyncQueue(syncService.getQueue());
    };
    window.addEventListener('kartavya_sync_change', handleSyncChange);
    window.addEventListener('astralogistics_sync_change', handleSyncChange);
    return () => {
      window.removeEventListener('kartavya_sync_change', handleSyncChange);
      window.removeEventListener('astralogistics_sync_change', handleSyncChange);
    };
  }, [refreshStatus]);

  const triggerManualSync = async () => {
    if (syncStatus.state === 'Offline') {
      warning('System is Offline', 'Disable offline mode before synchronizing with upstream cluster.');
      return;
    }

    try {
      setIsSyncing(true);
      const res = await syncService.triggerSync();
      refreshStatus();
      success('Synchronization Completed', `Successfully committed ${res.syncedCount} queued operational events.`);
    } catch (err) {
      error('Sync Failed', err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const setConnectivityState = (state) => {
    syncService.setSimulationState(state);
    refreshStatus();
    if (state === 'Offline') {
      warning('Offline Mode Active', 'Operational transactions are caching to local encrypted client store.');
    } else if (state === 'Connected') {
      info('Connected to Command Relay', 'Cluster heartbeat verified. Real-time telemetry available.');
    } else if (state === 'Synchronization Error') {
      error('Cluster Sync Error Simulated', 'Gateway timeout on upstream Antigravity cluster relay (HTTP 504).');
    }
  };

  return (
    <SyncContext.Provider value={{
      syncStatus,
      syncQueue,
      isSyncing,
      triggerManualSync,
      setConnectivityState,
      refreshStatus
    }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSync must be used within SyncProvider');
  return context;
};
