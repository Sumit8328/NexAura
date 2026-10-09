import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Check, 
  X, 
  Edit3, 
  Play, 
  AlertTriangle, 
  Clock, 
  Truck, 
  Route, 
  Info, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Send,
  Sparkles,
  Plus
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import { recommendationService } from '../services/recommendationService';
import { useToast } from '../context/ToastContext';

export const ReplenishmentRecommendations = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRecId = searchParams.get('recId');

  const [recommendations, setRecommendations] = useState([]);
  const [counts, setCounts] = useState({ total: 4, pending: 4, approved: 0, modified: 0, rejected: 0, executed: 0 });
  const [loading, setLoading] = useState(true);

  // Filter
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedRec, setSelectedRec] = useState(null);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Forms
  const [rejectReason, setRejectReason] = useState('');
  const [modifyForm, setModifyForm] = useState({ modifiedQty: '', modifiedTransport: '', reason: '' });
  const [generateForm, setGenerateForm] = useState({
    location: 'Sector-4 Forward Depot',
    supplyCategory: 'Fuel (JP-8 Synthetic)',
    suggestedReplenishmentQty: 22000,
    transportMode: 'Autonomous Armored Rail Tanker',
    priority: 'Critical',
    explanation: 'Algorithmic surge mitigation proposal calculated to prevent forward buffer breach.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [statusFilter]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const res = await recommendationService.getRecommendations({ status: statusFilter });
      setRecommendations(res.data || []);
      if (res.counts) setCounts(res.counts);
    } catch (e) {
      error('Failed to load recommendations', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApprove = (rec) => {
    setSelectedRec(rec);
    setIsApproveConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRec) return;
    try {
      setIsSubmitting(true);
      await recommendationService.approveRecommendation(selectedRec.id, 'Duty Officer (Local)');
      success('Recommendation Approved', `${selectedRec.id} has been validated. Shipment remains uncommitted awaiting freight allocation.`);
      setIsApproveConfirmOpen(false);
      loadRecommendations();
    } catch (e) {
      error('Approval failed', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReject = (rec) => {
    setSelectedRec(rec);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!selectedRec) return;
    try {
      setIsSubmitting(true);
      await recommendationService.rejectRecommendation(selectedRec.id, rejectReason, 'Duty Officer (Local)');
      success('Recommendation Rejected', `${selectedRec.id} rejected with operational reason recorded.`);
      setIsRejectModalOpen(false);
      loadRecommendations();
    } catch (e) {
      error('Rejection failed', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModify = (rec) => {
    setSelectedRec(rec);
    setModifyForm({
      modifiedQty: rec.suggestedReplenishmentQty,
      modifiedTransport: rec.transportMode,
      reason: 'Adjusted payload for forward capacity limits'
    });
    setIsModifyModalOpen(true);
  };

  const handleConfirmModify = async (e) => {
    e.preventDefault();
    if (!selectedRec) return;
    try {
      setIsSubmitting(true);
      await recommendationService.modifyRecommendation(selectedRec.id, {
        modifiedQty: modifyForm.modifiedQty,
        modifiedTransport: modifyForm.modifiedTransport,
        reason: modifyForm.reason
      });
      success('Recommendation Modified', `${selectedRec.id} parameters adjusted and transitioned to Modified status.`);
      setIsModifyModalOpen(false);
      loadRecommendations();
    } catch (e) {
      error('Modification failed', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmGenerate = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await recommendationService.createRecommendation(generateForm);
      success('Proposal Synthesized', `${res.recommendation.id} algorithmic recommendation generated and staged for officer verification.`);
      setIsGenerateModalOpen(false);
      loadRecommendations();
    } catch (err) {
      error('Synthesis failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecute = async (rec) => {
    try {
      const res = await recommendationService.executeRecommendation(rec.id);
      const manifestId = res?.shipment?.id || 'KTV-Active';
      success('Recommendation Executed', `${rec.id} requisition order formally cut as manifest ${manifestId} and transferred to freight dispatch queue.`);
      loadRecommendations();
    } catch (e) {
      error('Execution failed', e.message);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset recommendations lifecycle to initial demonstration state?')) {
      recommendationService.resetDefaults();
      loadRecommendations();
      info('Reset Complete', 'Recommendations restored to Pending Review baseline.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Human-in-the-Loop decision verification stage. Approving a proposal validates operational requirements but does NOT immediately dispatch vehicles or release stock until manual allocation."
      />

      {/* Filter Tabs & Lifecycle Counter Strip */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {['All', 'Pending Review', 'Approved', 'Modified', 'Rejected', 'Executed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-sm'
                    : 'text-slate-400 hover:text-white bg-midnight-950 border border-midnight-800'
                }`}
              >
                {st} {st === 'All' ? `(${counts.total})` :
                       st === 'Pending Review' ? `(${counts.pending})` :
                       st === 'Approved' ? `(${counts.approved})` :
                       st === 'Modified' ? `(${counts.modified})` :
                       st === 'Rejected' ? `(${counts.rejected})` : `(${counts.executed})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="shadow-cyan-sm"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              Synthesize Recommendation
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetDefaults}
            >
              Reset Proposals
            </Button>
          </div>
        </div>
      </Card>

      {/* Target Highlight Alert Banner if linked from Risk Intelligence */}
      {highlightedRecId && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex items-center justify-between gap-3 text-xs font-mono text-cyan-200 shadow-cyan-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Focusing on proposal <strong>{highlightedRecId}</strong> dispatched from Shortage Intelligence Matrix.</span>
          </div>
          <button
            onClick={() => setSearchParams({})}
            className="text-[11px] text-cyan-300 hover:text-white underline font-bold"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              No replenishment recommendations found matching status "{statusFilter}" in KARTAVYA decision queue.
            </div>
          </Card>
        ) : (
          recommendations.map((rec) => {
            const isPending = rec.status === 'Pending Review';
            const isApproved = rec.status === 'Approved';
            const isModified = rec.status === 'Modified';
            const isRejected = rec.status === 'Rejected';
            const isExecuted = rec.status === 'Executed';
            const isTarget = highlightedRecId && rec.id === highlightedRecId;

            const statusVariant = 
              isApproved ? 'emerald' :
              isModified ? 'cyan' :
              isRejected ? 'red' :
              isExecuted ? 'purple' : 'amber';

            return (
              <div
                key={rec.id}
                id={rec.id}
                className={`p-5 rounded-xl border backdrop-blur-md shadow-card space-y-4 transition-all duration-300 ${
                  isTarget 
                    ? 'border-cyan-400 ring-2 ring-cyan-400/60 bg-midnight-900 shadow-[0_0_30px_-5px_rgba(6,182,212,0.35)]' 
                    : 'border-midnight-700/80 bg-midnight-900/90'
                }`}
              >
                {/* Header: ID, Location, Category, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-midnight-750">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
                      {rec.id}
                    </span>
                    {isTarget && (
                      <Badge variant="cyan" size="sm" dot>
                        Target Resolution
                      </Badge>
                    )}
                    <span className="text-sm font-bold text-white font-mono">
                      {rec.location}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">•</span>
                    <span className="text-xs font-mono text-slate-300">
                      {rec.supplyCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={rec.priority === 'Critical' ? 'red' : 'amber'} size="sm">
                      {rec.priority} Priority
                    </Badge>
                    <Badge variant={statusVariant} size="md" dot={isPending}>
                      {rec.status}
                    </Badge>
                  </div>
                </div>

                {/* Core Quantitative Comparison Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-midnight-950/80 p-3.5 rounded-lg border border-midnight-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Depot Stock</span>
                    <span className="text-white font-bold text-sm">{rec.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">7-Day Demand</span>
                    <span className="text-white font-bold text-sm">{rec.forecastDemand}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Projected Risk</span>
                    <span className="text-rose-400 font-bold text-sm">{rec.estimatedShortageRisk}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 text-[10px] uppercase font-bold block">Suggested Resupply</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {rec.suggestedReplenishmentQty.toLocaleString()} {rec.unit}
                    </span>
                  </div>
                </div>

                {/* Tactical Justification & Data Limitations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-midnight-850/50 border border-midnight-750">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Algorithmic Recommendation Rationale:
                    </span>
                    <p className="text-slate-200 font-sans text-xs leading-relaxed">
                      {rec.explanation}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-midnight-850/50 border border-midnight-750">
                    <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">
                      Data Boundary / Operational Limitations:
                    </span>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {rec.dataLimitations}
                    </p>
                  </div>
                </div>

                {/* Selected Transport Corridor & Alternative Routes */}
                <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Selected Transport Mode</span>
                      <span className="text-white font-bold">{rec.transportMode} • ETA: {rec.illustrativeETA}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                    <span className="text-slate-400">Route Alternative:</span>
                    <span className="px-2 py-0.5 rounded bg-midnight-850 border border-midnight-750 text-cyan-300">
                      {rec.routeAlternatives[0]?.name || 'Standard Corridor'}
                    </span>
                  </div>
                </div>

                {/* Audit & Modification Trail */}
                {(rec.modificationReason || rec.rejectionReason || rec.approvedBy) && (
                  <div className="p-2.5 rounded bg-midnight-950 border border-midnight-750 text-xs font-mono text-slate-300">
                    {rec.approvedBy && (
                      <div>Approved by <span className="text-white font-bold">{rec.approvedBy}</span>. Awaiting freight manifest assignment.</div>
                    )}
                    {rec.modificationReason && (
                      <div className="text-cyan-300">
                        Modified by {rec.modifiedBy}: "{rec.modificationReason}" (Original qty: {rec.originalQty?.toLocaleString()})
                      </div>
                    )}
                    {rec.rejectionReason && (
                      <div className="text-rose-400">
                        Rejected by {rec.rejectedBy}: "{rec.rejectionReason}"
                      </div>
                    )}
                  </div>
                )}

                {/* Operational Human Approval Controls */}
                <div className="pt-3 border-t border-midnight-750 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Human Officer Custody Signoff Gate</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={X}
                          onClick={() => handleOpenReject(rec)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          onClick={() => handleOpenModify(rec)}
                        >
                          Modify
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Check}
                          onClick={() => handleOpenApprove(rec)}
                        >
                          Approve
                        </Button>
                      </>
                    )}

                    {(isApproved || isModified) && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Send}
                        onClick={() => handleExecute(rec)}
                      >
                        Execute Order & Release Manifest
                      </Button>
                    )}

                    {isExecuted && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-300 font-bold px-3 py-1 rounded bg-purple-950/50 border border-purple-500/40">
                          Manifest {rec.stagedShipmentId || 'KTV-Active'} Staged
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          iconRight={ArrowRight}
                          onClick={() => navigate('/shipments')}
                        >
                          Track Dispatch
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        title="Approve Replenishment Proposal"
        subtitle={`Validation for ${selectedRec?.id} • ${selectedRec?.location}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsApproveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmApprove}
              icon={Check}
            >
              Confirm Approval
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs font-mono text-slate-300">
          <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-200">
            <span className="font-bold uppercase text-[10px] block mb-1">Notice: Dispatch Decoupled</span>
            Approving this proposal acknowledges the forecast validity and confirms operational demand. In accordance with safety protocol, <strong>approving does not automatically dispatch a physical shipment</strong> until freight is allocated.
          </div>

          <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-white font-bold">{selectedRec?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Commodity:</span>
              <span className="text-white font-bold">{selectedRec?.supplyCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Approved Volume:</span>
              <span className="text-cyan-400 font-bold">{selectedRec?.suggestedReplenishmentQty.toLocaleString()} {selectedRec?.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transit Mode:</span>
              <span className="text-white">{selectedRec?.transportMode}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Replenishment Proposal"
        subtitle={`Operational justification required for ${selectedRec?.id}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmReject}
              icon={X}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200 text-[11px]">
            A documented operational rationale is mandatory when overruling automated risk predictions.
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Operational Rejection Reason *
            </label>
            <textarea
              rows="3"
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Local depot drawing auxiliary fuel from subterranean pipeline reserves; scheduled patrol canceled..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </form>
      </Modal>

      {/* Modify Modal */}
      <Modal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        title="Modify Replenishment Proposal"
        subtitle={`Adjust parameters for ${selectedRec?.id}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModifyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmModify}
              icon={Edit3}
            >
              Save Modifications
            </Button>
          </>
        }
      >
        <form onSubmit={handleConfirmModify} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Revised Replenishment Quantity ({selectedRec?.unit}) *
            </label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={modifyForm.modifiedQty}
              onChange={(e) => setModifyForm({ ...modifyForm, modifiedQty: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Designated Transport Option
            </label>
            <select
              value={modifyForm.modifiedTransport}
              onChange={(e) => setModifyForm({ ...modifyForm, modifiedTransport: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Autonomous Armored Rail Tanker">Autonomous Armored Rail Tanker (Corridor Diamond)</option>
              <option value="Autonomous Quad-VTOL Air Lifter">Autonomous Quad-VTOL Air Lifter (Skybridge 09)</option>
              <option value="Heavy Autonomous Convoy Trucks">Heavy Autonomous Convoy Trucks (Corridor Cobalt)</option>
              <option value="High-Priority Rail Secure Pod">High-Priority Rail Secure Pod</option>
              <option value="Bulk Water Tanker Semitrailer">Bulk Water Tanker Semitrailer</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Modification Justification *
            </label>
            <textarea
              rows="2"
              required
              value={modifyForm.reason}
              onChange={(e) => setModifyForm({ ...modifyForm, reason: e.target.value })}
              placeholder="e.g. Capped to depot loading bay throughput limits; prioritized VTOL airhead transit..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>

      {/* Generate / Synthesize Recommendation Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Synthesize AI Logistics Recommendation"
        subtitle="Generate a forward replenishment proposal based on simulated operational telemetry"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmGenerate}
              icon={Sparkles}
            >
              Generate Proposal
            </Button>
          </>
        }
      >
        <form onSubmit={handleConfirmGenerate} className="space-y-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-[11px]">
            Synthesizes an algorithmic replenishment demand order for human command verification.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Depot / Outpost *</label>
              <select
                value={generateForm.location}
                onChange={(e) => setGenerateForm({ ...generateForm, location: e.target.value })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Sector-4 Forward Depot">Sector-4 Forward Depot</option>
                <option value="Borealis Mountain Outpost">Borealis Mountain Outpost</option>
                <option value="Aurora Station Alpha">Aurora Station Alpha</option>
                <option value="Zenith Central Hub">Zenith Central Hub</option>
                <option value="Vanguard Perimeter Camp">Vanguard Perimeter Camp</option>
                <option value="Helios Coastal Base">Helios Coastal Base</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Commodity Category *</label>
              <select
                value={generateForm.supplyCategory}
                onChange={(e) => setGenerateForm({ ...generateForm, supplyCategory: e.target.value })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Fuel (JP-8 Synthetic)">Fuel (JP-8 Synthetic)</option>
                <option value="Field Rations (MRE-X)">Field Rations (MRE-X)</option>
                <option value="Trauma Medical Kits">Trauma Medical Kits</option>
                <option value="Potable Water (Purified)">Potable Water (Purified)</option>
                <option value="Tactical Energy Cells">Tactical Energy Cells</option>
                <option value="Armored Spares & Optics">Armored Spares & Optics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Replenishment Quantity *</label>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={generateForm.suggestedReplenishmentQty}
                onChange={(e) => setGenerateForm({ ...generateForm, suggestedReplenishmentQty: Number(e.target.value) })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Priority Echelon *</label>
              <select
                value={generateForm.priority}
                onChange={(e) => setGenerateForm({ ...generateForm, priority: e.target.value })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Critical">Critical Priority</option>
                <option value="High">High Priority</option>
                <option value="Standard">Standard Routine</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Transport Corridor Mode</label>
            <select
              value={generateForm.transportMode}
              onChange={(e) => setGenerateForm({ ...generateForm, transportMode: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Autonomous Armored Rail Tanker">Autonomous Armored Rail Tanker (Corridor Diamond)</option>
              <option value="Autonomous Quad-VTOL Air Lifter">Autonomous Quad-VTOL Air Lifter (Skybridge 09)</option>
              <option value="Heavy Autonomous Convoy Trucks">Heavy Autonomous Convoy Trucks (Corridor Cobalt)</option>
              <option value="High-Priority Rail Secure Pod">High-Priority Rail Secure Pod</option>
              <option value="Bulk Water Tanker Semitrailer">Bulk Water Tanker Semitrailer</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Operational Justification *</label>
            <textarea
              rows="2"
              required
              value={generateForm.explanation}
              onChange={(e) => setGenerateForm({ ...generateForm, explanation: e.target.value })}
              placeholder="Operational reason..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReplenishmentRecommendations;
