import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  MapPin, 
  ChevronRight, 
  RotateCcw,
  SlidersHorizontal,
  Calendar,
  Layers,
  FastForward,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Drawer from '../components/common/Drawer';
import Modal from '../components/common/Modal';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import { shipmentService, SHIPMENT_STATUSES } from '../services/shipmentService';
import { useToast } from '../context/ToastContext';

export const Shipments = () => {
  const { success, error, info } = useToast();

  const [shipments, setShipments] = useState([]);
  const [counts, setCounts] = useState({ total: 6, inTransit: 3, arrived: 1, allocated: 1, received: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');

  // Drawer & Transitions
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [transitionTargetStatus, setTransitionTargetStatus] = useState('');
  const [transitionNote, setTransitionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadShipments();
  }, [statusFilter, destinationFilter, search]);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await shipmentService.getShipments({
        search,
        status: statusFilter,
        destination: destinationFilter
      });
      setShipments(res.data || []);
      if (res.counts) setCounts(res.counts);
    } catch (e) {
      error('Failed to load shipments', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (shipment) => {
    setSelectedShipment(shipment);
    setIsDrawerOpen(true);
  };

  const handleOpenAdvance = (shipment) => {
    setSelectedShipment(shipment);
    const currIdx = SHIPMENT_STATUSES.indexOf(shipment.status);
    const nextStatus = currIdx < SHIPMENT_STATUSES.length - 1 ? SHIPMENT_STATUSES[currIdx + 1] : shipment.status;
    setTransitionTargetStatus(nextStatus);
    setTransitionNote(`Progressed to ${nextStatus} via KARTAVYA command validation`);
    setIsTransitionModalOpen(true);
  };

  const handleConfirmTransition = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      setIsSubmitting(true);
      const res = await shipmentService.advanceStatus(
        selectedShipment.id, 
        transitionTargetStatus, 
        transitionNote, 
        'Controller Vance (Local)'
      );
      success('Shipment Status Advanced', `${selectedShipment.id} transitioned to "${transitionTargetStatus}".`);
      setIsTransitionModalOpen(false);
      loadShipments();
      setSelectedShipment(res.shipment);
    } catch (err) {
      error('Status Transition Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset shipment records to original demonstration baseline?')) {
      shipmentService.resetDefaults();
      loadShipments();
      info('Reset Complete', 'Shipment tracks restored to prototype state.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Active Corridor Freight Manifests. Status transitions follow the 8-stage operational chain (Requested → Closed) and update local tracking logs."
      />

      {/* Filter Strip */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipment ID, destination, or commodity..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Statuses ({counts.total})</option>
              {SHIPMENT_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Destination Filter */}
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Destinations</option>
              <option value="Sector-4 Forward Depot">Sector-4 Depot</option>
              <option value="Borealis Mountain Outpost">Borealis Outpost</option>
              <option value="Aurora Station Alpha">Aurora Station Alpha</option>
              <option value="Vanguard Perimeter Camp">Vanguard Camp</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetDefaults}
            >
              Reset Shipments
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipment Manifest Table */}
      <Card
        title="Tactical In-Transit & Dispatched Shipments"
        subtitle={`${shipments.length} Active Records • 8-Stage Lifecycle`}
        icon={Truck}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-midnight-700 bg-midnight-950/60 text-slate-400">
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Shipment ID</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Corridor Transit</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Commodity & Volume</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Transport Mode</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Illustrative ETA</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Status & Progress</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <Truck className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-semibold text-slate-300 font-mono text-sm">No Active Dispatches Found</p>
                      <p className="text-xs text-slate-400 font-sans">No freight tracks matched filter criteria in KARTAVYA transit registry.</p>
                      <button 
                        onClick={() => { setStatusFilter('All'); setDestinationFilter('All'); setSearchTerm(''); }}
                        className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((s) => {
                  const statusColors = {
                    'Requested': 'slate',
                    'Approved': 'amber',
                    'Allocated': 'cyan',
                    'Dispatched': 'cyan',
                    'In Transit': 'cyan',
                    'Arrived': 'emerald',
                    'Received': 'emerald',
                    'Closed': 'slate'
                  };

                  const isTerminal = s.status === 'Closed';

                  return (
                    <tr
                      key={s.id}
                      onClick={() => handleOpenDetail(s)}
                      className="hover:bg-midnight-850/60 cursor-pointer group transition-colors"
                    >
                      <td className="py-3.5 px-3.5">
                        <span className="font-bold text-cyan-400 text-sm group-hover:underline">
                          {s.id}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {s.priority} Priority
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{s.originCode}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-cyan-400">{s.destinationCode}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {s.destination}
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white text-sm">
                          {s.quantity.toLocaleString()} <span className="text-slate-400 text-xs font-normal">{s.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {s.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-300">
                        <div className="truncate max-w-[200px]" title={s.transportOption}>
                          {s.transportOption}
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="text-white font-medium">
                          {s.illustrativeETA}
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <Badge 
                          variant={statusColors[s.status] || 'cyan'} 
                          size="sm" 
                          dot={s.status === 'In Transit'}
                        >
                          {s.status}
                        </Badge>
                        <div className="mt-1.5 w-24 bg-midnight-950 rounded-full h-1 overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full transition-all"
                            style={{ width: `${s.progressPercent}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        {!isTerminal && (
                          <button
                            onClick={() => handleOpenAdvance(s)}
                            className="px-2.5 py-1 rounded bg-midnight-800 hover:bg-cyan-950 text-cyan-300 border border-midnight-700 hover:border-cyan-500/50 transition-colors text-[11px] inline-flex items-center gap-1 font-semibold"
                            title="Advance Lifecycle Status"
                          >
                            <FastForward className="w-3 h-3" />
                            <span>Advance</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shipment Lifecycle & Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Shipment ${selectedShipment?.id}`}
        subtitle={`${selectedShipment?.category} • ${selectedShipment?.destination}`}
        badge={selectedShipment && (
          <Badge variant="cyan" size="sm">{selectedShipment.status}</Badge>
        )}
        footer={
          selectedShipment && selectedShipment.status !== 'Closed' && (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              icon={FastForward}
              onClick={() => {
                setIsDrawerOpen(false);
                handleOpenAdvance(selectedShipment);
              }}
            >
              Advance Lifecycle Status
            </Button>
          )
        }
      >
        {selectedShipment && (
          <div className="space-y-5 text-xs font-mono">
            {/* Spec summary */}
            <div className="p-4 rounded-lg bg-midnight-950 border border-midnight-800 space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Payload Volume:</span>
                <span className="text-white font-bold">{selectedShipment.quantity.toLocaleString()} {selectedShipment.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Corridor Route:</span>
                <span className="text-cyan-400 font-bold">{selectedShipment.routeCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier / Unit:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{selectedShipment.transportOption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Illustrative ETA:</span>
                <span className="text-white font-bold">{selectedShipment.illustrativeETA}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telemetry Status:</span>
                <span className="text-cyan-400">{selectedShipment.lastUpdate}</span>
              </div>
            </div>

            {/* Complete 8-Stage Lifecycle Progression */}
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-2">
                Standard 8-Stage Operational Chain
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono text-center">
                {SHIPMENT_STATUSES.map((st, i) => {
                  const currentIdx = SHIPMENT_STATUSES.indexOf(selectedShipment.status);
                  const isPassed = i < currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div
                      key={st}
                      className={`p-1.5 rounded border transition-colors ${
                        isCurrent ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-cyan-sm' :
                        isPassed ? 'bg-midnight-850 text-emerald-400 border-emerald-500/30' :
                        'bg-midnight-950 text-slate-600 border-midnight-850'
                      }`}
                    >
                      {st}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment Event History Timeline */}
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-3">
                Shipment Checkpoint Event Log
              </div>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-midnight-800">
                {selectedShipment.timeline?.map((ev, i) => (
                  <div key={i} className="relative flex items-start gap-3 pl-1">
                    <div className="w-5 h-5 rounded-full bg-midnight-900 border-2 border-cyan-400 shrink-0 z-10 flex items-center justify-center mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <div className="flex-1 p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{ev.status}</span>
                        <span className="text-slate-500 text-[10px]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 text-xs font-sans mt-1">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Advance Status Modal */}
      <Modal
        isOpen={isTransitionModalOpen}
        onClose={() => setIsTransitionModalOpen(false)}
        title="Advance Shipment Lifecycle"
        subtitle={`Update progress for ${selectedShipment?.id}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsTransitionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmTransition}
              icon={FastForward}
            >
              Commit Transition
            </Button>
          </>
        }
      >
        <form onSubmit={handleConfirmTransition} className="space-y-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 flex justify-between">
            <span className="text-slate-400">Current Status:</span>
            <span className="text-cyan-400 font-bold">{selectedShipment?.status}</span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Target Status *</label>
            <select
              value={transitionTargetStatus}
              onChange={(e) => {
                setTransitionTargetStatus(e.target.value);
                setTransitionNote(`Progressed to ${e.target.value} via KARTAVYA command validation`);
              }}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono"
            >
              {selectedShipment && SHIPMENT_STATUSES.slice(SHIPMENT_STATUSES.indexOf(selectedShipment.status) + 1).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Checkpoint / Status Note *</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {[
                `Cleared waypoint check`,
                `Cargo inspected and verified`,
                `Docked at depot bay`,
                `Transferred to forward custody`
              ].map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTransitionNote(preset)}
                  className="px-2 py-0.5 rounded bg-midnight-800 hover:bg-cyan-950 border border-midnight-700 text-[10px] text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              rows="2"
              required
              value={transitionNote}
              onChange={(e) => setTransitionNote(e.target.value)}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shipments;
