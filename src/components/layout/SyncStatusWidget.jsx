import React, { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Clock, Server, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const SyncStatusWidget = () => {
  const { syncStatus, syncQueue, isSyncing, triggerManualSync, setConnectivityState } = useSync();
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = () => {
    switch (syncStatus.state) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#55E6C1]/10 border border-[#55E6C1]/30 text-[#55E6C1] text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-[#55E6C1] animate-pulse shadow-[0_0_6px_#55E6C1]" />
            <span className="hidden sm:inline">RELAY:</span> CONNECTED
          </span>
        );
      case 'Pending Synchronization':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_6px_#38BDF8]" />
            <span>PENDING SYNC ({syncStatus.pendingCount || syncQueue.length})</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1B293B] border border-[#263449] text-[#94A3B8] text-xs font-mono font-medium">
            <WifiOff className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>OFFLINE BUFFER</span>
          </span>
        );
      case 'Synchronization Error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F87171]/10 border border-[#F87171]/40 text-[#F87171] text-xs font-mono font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F87171] animate-bounce" />
            <span>SYNC ERROR</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatLastSync = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
        title="View Connectivity & Synchronization Status"
      >
        {getStatusBadge()}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-[#141F30] border border-[#263449] rounded-xl shadow-2xl p-4 z-40 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <span className="font-bold text-[#F8FAFC] uppercase flex items-center gap-2">
                <Server className="w-4 h-4 text-[#55E6C1]" />
                Cluster Synchronization
              </span>
              <Badge variant="cyan" size="sm">Prototype Store</Badge>
            </div>

            <div className="mt-3 space-y-2 text-[#94A3B8] text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-[#263449]/70">
                <span>Current State:</span>
                <span className="font-bold text-[#F8FAFC]">{syncStatus.state}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#263449]/70">
                <span>Last Successful Sync:</span>
                <span className="text-[#F8FAFC]">{formatLastSync(syncStatus.lastSyncedAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#263449]/70">
                <span>Queued Offline Events:</span>
                <span className="font-bold text-[#55E6C1]">{syncQueue.length} events</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Backend API Target:</span>
                <span className="text-[#94A3B8] font-mono text-[10px] truncate max-w-[140px]" title={import.meta.env.VITE_API_BASE_URL || 'Local Antigravity Bridge'}>
                  {import.meta.env.VITE_API_BASE_URL || 'FastAPI Mock Engine'}
                </span>
              </div>
            </div>

            {syncStatus.lastSyncError && (
              <div className="mt-2.5 p-2 rounded bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] text-[10px]">
                {syncStatus.lastSyncError}
              </div>
            )}

            {/* Simulated Connectivity Switcher */}
            <div className="mt-3 pt-3 border-t border-[#263449]">
              <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1.5 font-bold">
                Simulate Connection State:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setConnectivityState('Connected')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Connected' 
                      ? 'bg-[#55E6C1]/20 text-[#55E6C1] border-[#55E6C1]/40' 
                      : 'bg-[#1B293B] text-[#94A3B8] border-[#263449] hover:text-[#F8FAFC]'
                  }`}
                >
                  Force Online
                </button>
                <button
                  onClick={() => setConnectivityState('Offline')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Offline' 
                      ? 'bg-[#1B293B] text-[#F8FAFC] border-[#94A3B8]' 
                      : 'bg-[#1B293B] text-[#94A3B8] border-[#263449] hover:text-[#F8FAFC]'
                  }`}
                >
                  Force Offline
                </button>
                <button
                  onClick={() => setConnectivityState('Pending Synchronization')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Pending Synchronization' 
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40' 
                      : 'bg-[#1B293B] text-[#94A3B8] border-[#263449] hover:text-[#F8FAFC]'
                  }`}
                >
                  Pending Sync
                </button>
                <button
                  onClick={() => setConnectivityState('Synchronization Error')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Synchronization Error' 
                      ? 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/40' 
                      : 'bg-[#1B293B] text-[#94A3B8] border-[#263449] hover:text-[#F8FAFC]'
                  }`}
                >
                  Simulate Error
                </button>
              </div>
            </div>

            {/* Manual Sync Trigger Button */}
            <div className="mt-3">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                isLoading={isSyncing}
                onClick={triggerManualSync}
                icon={RefreshCw}
              >
                Synchronize Buffer Now
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SyncStatusWidget;
