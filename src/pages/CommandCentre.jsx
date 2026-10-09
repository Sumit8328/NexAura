import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Truck, 
  CheckSquare, 
  TrendingUp, 
  Boxes, 
  ArrowRight, 
  Activity, 
  Navigation,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  Radio,
  Sparkles,
  Zap,
  RotateCcw,
  PlusCircle,
  FlaskConical,
  Compass
} from 'lucide-react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import CompactMap from '../components/maps/CompactMap';
import LoadingScreen from '../components/common/LoadingScreen';
import { inventoryService } from '../services/inventoryService';
import { riskService } from '../services/riskService';
import { shipmentService } from '../services/shipmentService';
import { recommendationService } from '../services/recommendationService';
import { routeService } from '../services/routeService';
import { forecastService } from '../services/forecastService';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const CommandCentre = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [forecastHorizon, setForecastHorizon] = useState(7);
  const [forecastCategory, setForecastCategory] = useState('Fuel (JP-8 Synthetic)');
  const [forecastData, setForecastData] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 10, critical: 2, low: 3, optimal: 4, excess: 1 });
  const [risks, setRisks] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
  }, [forecastHorizon, forecastCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, riskRes, shipRes, recRes, routeRes, fcRes] = await Promise.all([
        inventoryService.getInventory(),
        riskService.getRisks(),
        shipmentService.getShipments(),
        recommendationService.getRecommendations(),
        routeService.getRoutes(),
        forecastService.getForecast({ horizon: forecastHorizon, category: forecastCategory })
      ]);

      const items = invRes.data || [];
      setInventoryStats({
        total: items.length,
        critical: items.filter(i => i.status === 'Critical').length,
        low: items.filter(i => i.status === 'Low').length,
        optimal: items.filter(i => i.status === 'Optimal').length,
        excess: items.filter(i => i.status === 'Excess').length,
      });

      setRisks((riskRes.data || []).slice(0, 3));
      setShipments((shipRes.data || []).filter(s => s.status === 'In Transit').slice(0, 3));
      setRecommendations((recRes.data || []).filter(r => r.status === 'Pending Review').slice(0, 3));
      setRoutes(routeRes.data || []);
      setLocations(routeRes.locations || []);
      setForecastData(fcRes.data || []);
    } catch (e) {
      console.error('Failed to load command centre data', e);
    } finally {
      setLoading(false);
    }
  };

  const readinessScore = 84; // 84% operational readiness score

  if (loading && !forecastData.length) {
    return <LoadingScreen message="Initializing KARTAVYA Command Matrix..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Prototype & Simulation Disclaimer */}
      <DataDisclaimerBanner 
        mode="prototype" 
        customText="KARTAVYA Command Interface active in prototype validation mode. Standalone operational dataset loaded." 
      />

      {/* Strategic Command HUD Strip */}
      <div className="p-4 rounded-xl border border-midnight-750 bg-gradient-to-r from-midnight-900 via-midnight-850 to-midnight-900 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Forward Strategic Command Matrix
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-pulse">
                DEFCON NOMINAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sector Southwest Echelon • 6 Forward Depots Synchronized • Automated Telemetry Active
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-midnight-950/90 border border-midnight-700 text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-200 font-semibold">{currentTime}</span>
          </div>

          <button 
            onClick={() => navigate('/scenario-lab')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stress Sandbox</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Command Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Theater Readiness"
          value={`${readinessScore}%`}
          change="Optimal Band"
          changeType="increase"
          icon={ShieldCheck}
          variant="emerald"
          subtitle="All Echelons"
        />
        <StatCard
          title="Tracked SKUs"
          value={inventoryStats.total}
          change="6 Categories"
          changeType="neutral"
          icon={Boxes}
          variant="cyan"
          subtitle="6 Forward Hubs"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Critical Risks"
          value={inventoryStats.critical}
          change="Imminent Stockouts"
          changeType="critical"
          icon={AlertTriangle}
          variant="red"
          subtitle="Sector-4 & Borealis"
          onClick={() => navigate('/risk')}
        />
        <StatCard
          title="In Transit"
          value="3 Convoys"
          change="62% Aggregate"
          changeType="neutral"
          icon={Truck}
          variant="cyan"
          subtitle="Rail, Road & VTOL"
          onClick={() => navigate('/shipments')}
        />
        <StatCard
          title="Pending Approvals"
          value="4 Requisitions"
          change="Action Required"
          changeType="critical"
          icon={CheckSquare}
          variant="amber"
          subtitle="Human-in-Loop"
          onClick={() => navigate('/recommendations')}
        />
        <StatCard
          title="Active Corridors"
          value="3 / 5 Clear"
          change="1 Disrupted, 1 Closed"
          changeType="decrease"
          icon={Navigation}
          variant="amber"
          subtitle="Blizzard & Sandstorm"
          onClick={() => navigate('/routes')}
        />
      </div>

      {/* Middle Grid: Predictive Forecast vs Theater Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Demand Forecast Predictive Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <Card
            title="Predictive Consumption Trajectory vs Reserve Buffer"
            subtitle={`${forecastCategory} • Sector-4 Forward Operating Depot`}
            icon={TrendingUp}
            action={
              <div className="flex items-center gap-2">
                {/* Category mini-selector */}
                <select
                  value={forecastCategory}
                  onChange={(e) => setForecastCategory(e.target.value)}
                  className="bg-midnight-950 border border-midnight-750 text-cyan-300 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="Fuel (JP-8 Synthetic)">Fuel (JP-8)</option>
                  <option value="Field Rations (MRE-X)">Field Rations</option>
                  <option value="Trauma Medical Kits">Medical Kits</option>
                  <option value="Potable Water (Purified)">Potable Water</option>
                </select>

                {/* Horizon buttons */}
                <div className="flex items-center gap-1 bg-midnight-950 p-1 rounded-md border border-midnight-750 text-xs font-mono">
                  {[7, 15, 30].map(h => (
                    <button
                      key={h}
                      onClick={() => setForecastHorizon(h)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        forecastHorizon === h
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {h}D
                    </button>
                  ))}
                </div>
              </div>
            }
            className="flex-1 flex flex-col"
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockAreaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1120',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                    }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    formatter={(val, name) => [
                      `${Number(val).toLocaleString()}`,
                      name === 'historical' ? 'Historical Draw' :
                      name === 'projected' ? 'Predicted Demand' :
                      name === 'currentStockLevel' ? 'Depot Reserve' : name
                    ]}
                  />

                  {/* Safety Threshold Reference Line */}
                  <ReferenceLine 
                    y={18000} 
                    stroke="#f59e0b" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Safety Buffer (18k L)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, fontFamily: 'monospace' }} 
                  />

                  {/* Stock level area */}
                  <Area
                    type="monotone"
                    dataKey="currentStockLevel"
                    fill="url(#stockAreaGlow)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="currentStockLevel"
                  />

                  {/* Historical demand */}
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={{ fill: '#94a3b8', r: 3 }}
                    name="historical"
                  />

                  {/* Forecast demand line */}
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="#00f0ff"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#00f0ff', r: 3 }}
                    name="projected"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-midnight-750 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-slate-400" /> Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-cyan-400 border-dashed" /> Forecast Demand
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-cyan-500/20 border border-cyan-400 rounded-sm" /> Depot Reserve
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-0.5 bg-amber-400 border-dashed" /> Safety Buffer
                </span>
              </div>
              <button 
                onClick={() => navigate('/forecast')}
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold group"
              >
                Deep Forecast Intelligence 
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Tactical Theater Map Preview & Route Status (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card
            title="Theater Route Intelligence"
            subtitle="5 Intermodal Supply Corridors"
            icon={Navigation}
            action={
              <Badge variant="amber" size="sm" dot>2 Disruptions</Badge>
            }
          >
            <CompactMap routes={routes} locations={locations} />

            <div className="mt-3.5 divide-y divide-midnight-800 text-xs font-mono">
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-midnight-850/50 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                  <span className="text-white font-medium">Corridor Diamond (Hyper-Rail)</span>
                </div>
                <span className="text-cyan-400 font-semibold">Available • 7.5h</span>
              </div>
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-midnight-850/50 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  <span className="text-slate-200">Corridor Cobalt (Desert Hwy)</span>
                </div>
                <span className="text-amber-400 font-semibold">Disrupted (+6h Dust)</span>
              </div>
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-midnight-850/50 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                  <span className="text-slate-200">Pass Echo (Alpine Ridge)</span>
                </div>
                <span className="text-rose-400 font-semibold">Closed (Blizzard)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Operational Grid: Action Feed, Risks, Active Shipments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Priority Action Required List */}
        <Card
          title="Pending Approvals"
          subtitle="Human-in-the-Loop decision gate"
          icon={CheckSquare}
          badge={<Badge variant="amber" size="sm">4 Pending</Badge>}
          action={
            <button 
              onClick={() => navigate('/recommendations')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Review All →
            </button>
          }
        >
          <div className="space-y-3">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                onClick={() => navigate(`/recommendations`)}
                className="p-3 rounded-lg bg-midnight-850/60 hover:bg-midnight-800 border border-midnight-750 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-white">{rec.location}</span>
                  <Badge variant={rec.priority === 'Critical' ? 'red' : 'amber'} size="sm">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 font-medium">{rec.supplyCategory}</p>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-midnight-800/80">
                  <span className="text-cyan-400 font-semibold">
                    Replenish: {rec.suggestedReplenishmentQty.toLocaleString()} {rec.unit}
                  </span>
                  <span className="text-slate-400">ETA: {rec.illustrativeETA}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shortage Risk Alerts */}
        <Card
          title="Shortage Risk Intelligence"
          subtitle="Early warning predictive triggers"
          icon={AlertTriangle}
          badge={<Badge variant="red" size="sm" dot>Active</Badge>}
          action={
            <button 
              onClick={() => navigate('/risk')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Risk Matrix →
            </button>
          }
        >
          <div className="space-y-3">
            {risks.map(risk => (
              <div 
                key={risk.id}
                onClick={() => navigate('/risk')}
                className="p-3 rounded-lg bg-midnight-850/60 hover:bg-midnight-800 border border-midnight-750 hover:border-rose-500/40 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">{risk.title}</span>
                  <Badge variant="red" size="sm">{risk.projectedStockCoverage} Days left</Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">{risk.location} • {risk.supplyCategory}</p>
                <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed pt-1">
                  {risk.riskExplanation}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* In Transit Active Shipments */}
        <Card
          title="Active Convoys in Transit"
          subtitle="Live telemetry checkpoints"
          icon={Truck}
          badge={<Badge variant="cyan" size="sm">3 Moving</Badge>}
          action={
            <button 
              onClick={() => navigate('/shipments')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Tracker →
            </button>
          }
        >
          <div className="space-y-3">
            {shipments.map(s => (
              <div 
                key={s.id}
                onClick={() => navigate('/shipments')}
                className="p-3 rounded-lg bg-midnight-850/60 hover:bg-midnight-800 border border-midnight-750 hover:border-cyan-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{s.id}</span>
                  <Badge variant="cyan" size="sm">{s.progressPercent}% Transit</Badge>
                </div>
                <p className="text-xs text-white font-medium mt-1">
                  {s.originCode} → {s.destinationCode} • {s.quantity.toLocaleString()} {s.unit}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                  {s.transportOption}
                </p>
                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-midnight-950 rounded-full h-1.5 overflow-hidden border border-midnight-750">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all shadow-[0_0_8px_#00f0ff]" 
                    style={{ width: `${s.progressPercent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Mission Action Shortcuts Bar */}
      <div className="p-4 rounded-xl border border-midnight-750/80 bg-midnight-900/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Quick Commander Directives:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/inventory')}
            icon={PlusCircle}
          >
            Record Inbound Stock
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/recommendations')}
            icon={CheckSquare}
          >
            Review Replenishment Proposals
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/scenario-lab')}
            icon={FlaskConical}
          >
            Simulate Crisis Scenarios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommandCentre;
