import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  ArrowRight, 
  Clock, 
  Boxes, 
  CheckSquare, 
  Search,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import { riskService } from '../services/riskService';

export const RiskIntelligence = () => {
  const navigate = useNavigate();

  const [risks, setRisks] = useState([]);
  const [summary, setSummary] = useState({ total: 5, critical: 2, high: 1, medium: 1, low: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRisks();
  }, [selectedSeverity, selectedLocation, search]);

  const loadRisks = async () => {
    try {
      setLoading(true);
      const res = await riskService.getRisks({
        severity: selectedSeverity,
        location: selectedLocation,
        search
      });
      setRisks(res.data || []);
      if (res.summary) setSummary(res.summary);
    } catch (e) {
      console.error('Failed to load risks', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Risk matrix calculated via forward consumption trajectories and safety buffer degradation heuristics. Illustrative alerts for operational evaluation."
      />

      {/* KPI Severity Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Critical Shortages"
          value={summary.critical}
          subtitle="Stockout in < 4 Days"
          change="Action Required"
          changeType="critical"
          icon={AlertTriangle}
          variant="red"
          onClick={() => setSelectedSeverity('critical')}
        />
        <StatCard
          title="High Risk Assets"
          value={summary.high}
          subtitle="Buffer breach < 7 Days"
          change="Safety Zone Threatened"
          changeType="critical"
          icon={ShieldAlert}
          variant="amber"
          onClick={() => setSelectedSeverity('high')}
        />
        <StatCard
          title="Medium Risk"
          value={summary.medium}
          subtitle="Maintenance variance"
          change="Monitored"
          changeType="neutral"
          icon={Clock}
          variant="cyan"
          onClick={() => setSelectedSeverity('medium')}
        />
        <StatCard
          title="Total Monitored"
          value={summary.total}
          subtitle="Forward Hubs & Depots"
          change="All Clear (2 Nodes)"
          changeType="increase"
          icon={Boxes}
          variant="emerald"
          onClick={() => setSelectedSeverity('All')}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search risk reason, commodity, or depot..."
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Severity filter buttons */}
            <div className="flex items-center gap-1 bg-midnight-950 p-1 rounded-lg border border-midnight-700">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedSeverity.toLowerCase() === sev.toLowerCase()
                      ? sev === 'Critical' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' :
                        sev === 'High' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' :
                        'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Location filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Depots</option>
              <option value="Sector-4 Forward Depot">Sector-4 Depot</option>
              <option value="Borealis Mountain Outpost">Borealis Outpost</option>
              <option value="Vanguard Perimeter Camp">Vanguard Camp</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Risk Analysis Cards List */}
      <div className="space-y-4">
        {risks.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              No shortage risk alerts matched the specified criteria.
            </div>
          </Card>
        ) : (
          risks.map((risk) => {
            const isCritical = risk.severity === 'critical';
            const isHigh = risk.severity === 'high';

            return (
              <div
                key={risk.id}
                className={`p-5 rounded-xl border bg-midnight-900/90 backdrop-blur-md shadow-card transition-all duration-200 ${
                  isCritical 
                    ? 'border-rose-500/40 shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]' 
                    : isHigh
                    ? 'border-amber-500/40 shadow-[0_0_15px_-5px_rgba(245,158,11,0.15)]'
                    : 'border-midnight-700/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Severity badge, Title, Metadata */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge 
                        variant={isCritical ? 'red' : isHigh ? 'amber' : 'cyan'} 
                        size="md" 
                        dot={isCritical}
                      >
                        {risk.severity.toUpperCase()} RISK
                      </Badge>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {risk.id}
                      </span>
                      <span className="text-xs font-mono text-slate-500">•</span>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        {risk.location}
                      </span>
                      <span className="text-xs font-mono text-slate-500">•</span>
                      <span className="text-xs font-mono text-slate-300">
                        {risk.supplyCategory}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-wide">
                      {risk.title}
                    </h3>

                    {/* Deep Root Cause Explanation */}
                    <div className="p-3.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs font-sans text-slate-200 leading-relaxed">
                      <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        Root Cause Intelligence:
                      </div>
                      {risk.riskExplanation}
                    </div>

                    {/* Actionable Next Step */}
                    <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-start gap-2.5">
                      <span className="font-bold text-cyan-400 uppercase text-[10px] shrink-0 mt-0.5">
                        Recommended Next Action:
                      </span>
                      <span className="font-sans text-xs text-cyan-100">{risk.recommendedNextAction}</span>
                    </div>
                  </div>

                  {/* Right: Quantitative Stock Runway & Quick Jump Buttons */}
                  <div className="lg:w-72 shrink-0 bg-midnight-950/70 p-4 rounded-xl border border-midnight-800 space-y-3 text-xs font-mono">
                    <div className="pb-2 border-b border-midnight-800">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Projected Runway</div>
                      <div className={`text-2xl font-bold mt-0.5 ${
                        isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {risk.projectedStockCoverage} Days
                      </div>
                    </div>

                    <div className="space-y-1.5 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Stock:</span>
                        <span className="font-bold text-white">{risk.currentStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Safety Buffer:</span>
                        <span className="text-amber-400">{risk.safetyStockThreshold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Stockout:</span>
                        <span className="text-rose-400 font-bold">{risk.estimatedStockoutDate}</span>
                      </div>
                    </div>

                    {/* 1-Click Jump Buttons */}
                    <div className="pt-3 border-t border-midnight-800 flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-bold"
                        iconRight={ArrowRight}
                        onClick={() => navigate(`/recommendations`)}
                      >
                        Review Replenishment
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        iconRight={ExternalLink}
                        onClick={() => navigate(`/inventory?q=${encodeURIComponent(risk.supplyCategory)}`)}
                      >
                        Inspect Inventory SKU
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-midnight-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Confidence: <span className="text-slate-200">{risk.confidenceLevel}</span></span>
                  <span className="text-slate-400 italic">{risk.dataLimitationNote}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RiskIntelligence;
