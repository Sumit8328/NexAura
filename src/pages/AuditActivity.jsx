import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  User, 
  FileText, 
  RotateCcw,
  Boxes,
  Truck,
  CheckSquare,
  AlertTriangle,
  Server
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import { auditService } from '../services/auditService';
import { useToast } from '../context/ToastContext';

export const AuditActivity = () => {
  const { info } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('All');

  useEffect(() => {
    loadLogs();
  }, [search, entityType]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await auditService.getLogs({ search, entityType });
      setLogs(res.data || []);
    } catch (e) {
      console.error('Audit load failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetLogs = () => {
    if (window.confirm('Reset local audit trail to default demonstration logs?')) {
      auditService.clearAuditLogs();
      loadLogs();
      info('Audit Trail Reset', 'Reverted to initial demonstration log entries.');
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'Shipment':
      case 'Shipment Tracking': return Truck;
      case 'Inventory Item': return Boxes;
      case 'Replenishment Recommendation': return CheckSquare;
      case 'Risk Intelligence': return AlertTriangle;
      default: return Server;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Local Prototype Custody Journal. Records operational commands, receipts, issues, and approvals dispatched during the local session."
      />

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, actor, reason, or entity ID..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Entity Type Filter */}
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Entity Domains</option>
              <option value="Inventory Item">Inventory Items</option>
              <option value="Replenishment Recommendation">Recommendations</option>
              <option value="Shipment Tracking">Shipments</option>
              <option value="Risk Intelligence">Risk Engine</option>
              <option value="System Synchronization">Sync Events</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetLogs}
            >
              Reset Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Timeline Records */}
      <Card
        title="Command Audit Trail & Custody Verification"
        subtitle={`${logs.length} Logged Transactions • Local Client Journal`}
        icon={History}
      >
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              No audit logs found matching current search filters.
            </div>
          ) : (
            logs.map((log) => {
              const Icon = getEntityIcon(log.entityType);

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-midnight-750 bg-midnight-850/50 hover:bg-midnight-850 transition-colors space-y-3 text-xs font-mono"
                >
                  {/* Top Bar: ID, Action, Timestamp, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-midnight-750/70">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white text-sm font-sans">{log.action}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-cyan-400 font-bold">{log.entityId}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <Badge 
                        variant={log.status === 'Success' ? 'emerald' : log.status === 'Automated' ? 'cyan' : 'amber'} 
                        size="sm"
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actor & Entity Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-midnight-950 p-2.5 rounded-lg border border-midnight-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Actor / Origin</span>
                      <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-cyan-400" />
                        {log.actor}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Domain Target</span>
                      <span className="text-slate-300 mt-0.5 block">{log.entityType}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Verification Ref</span>
                      <span className="text-slate-400 mt-0.5 block">{log.id}</span>
                    </div>
                  </div>

                  {/* Value Delta Comparison */}
                  {(log.previousValue !== '—' || log.updatedValue) && (
                    <div className="p-2.5 rounded bg-midnight-900 border border-midnight-800 flex items-center justify-between gap-2 text-[11px]">
                      <div className="min-w-0">
                        <span className="text-slate-500 text-[10px] uppercase block">Prior State</span>
                        <span className="text-slate-400 line-through truncate block">{log.previousValue}</span>
                      </div>
                      <div className="text-slate-600 font-bold">→</div>
                      <div className="min-w-0 text-right">
                        <span className="text-slate-500 text-[10px] uppercase block">Committed State</span>
                        <span className="text-emerald-400 font-bold truncate block">{log.updatedValue}</span>
                      </div>
                    </div>
                  )}

                  {/* Operational Rationale Note */}
                  {log.reason && (
                    <div className="text-[11px] text-slate-300 font-sans flex items-start gap-1.5 pt-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{log.reason}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuditActivity;
