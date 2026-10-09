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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
            <span className="hidden sm:inline">RELAY:</span> CONNECTED
          </span>
        );
      case 'Pending Synchronization':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span>PENDING SYNC ({syncStatus.pendingCount || syncQueue.length})</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-slate-300 text-xs font-mono font-medium">
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
            <span>OFFLINE BUFFER</span>
          </span>
        );
      case 'Synchronization Error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-mono font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
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
          <div className="absolute right-0 mt-2 w-80 bg-midnight-900 border border-midnight-700/80 rounded-xl shadow-2xl p-4 z-40 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-midnight-750">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Cluster Synchronization
              </span>
              <Badge variant="cyan" size="sm">Prototype Store</Badge>
            </div>

            <div className="mt-3 space-y-2 text-slate-300 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-midnight-800">
                <span className="text-slate-400">Current State:</span>
                <span className="font-bold text-white">{syncStatus.state}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-midnight-800">
                <span className="text-slate-400">Last Successful Sync:</span>
                <span className="text-white">{formatLastSync(syncStatus.lastSyncedAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-midnight-800">
                <span className="text-slate-400">Queued Offline Events:</span>
                <span className="font-bold text-cyan-400">{syncQueue.length} events</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Backend API Target:</span>
                <span className="text-slate-400 font-mono text-[10px] truncate max-w-[140px]" title={import.meta.env.VITE_API_BASE_URL || 'Local Antigravity Bridge'}>
                  {import.meta.env.VITE_API_BASE_URL || 'FastAPI Mock Engine'}
                </span>
              </div>
            </div>

            {syncStatus.lastSyncError && (
              <div className="mt-2.5 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px]">
                {syncStatus.lastSyncError}
              </div>
            )}

            {/* Simulated Connectivity Switcher */}
            <div className="mt-3 pt-3 border-t border-midnight-750">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                Simulate Connection State:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setConnectivityState('Connected')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Connected' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-midnight-800 text-slate-400 border-midnight-700 hover:text-white'
                  }`}
                >
                  Force Online
                </button>
                <button
                  onClick={() => setConnectivityState('Offline')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Offline' 
                      ? 'bg-slate-700 text-white border-slate-500' 
                      : 'bg-midnight-800 text-slate-400 border-midnight-700 hover:text-white'
                  }`}
                >
                  Force Offline
                </button>
                <button
                  onClick={() => setConnectivityState('Pending Synchronization')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Pending Synchronization' 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                      : 'bg-midnight-800 text-slate-400 border-midnight-700 hover:text-white'
                  }`}
                >
                  Pending Sync
                </button>
                <button
                  onClick={() => setConnectivityState('Synchronization Error')}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    syncStatus.state === 'Synchronization Error' 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : 'bg-midnight-800 text-slate-400 border-midnight-700 hover:text-white'
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
