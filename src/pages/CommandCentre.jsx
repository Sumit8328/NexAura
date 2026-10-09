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
  Compass,
  History,
  CheckCircle2,
  AlertCircle
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
import { auditService } from '../services/auditService';
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
  const [recentActivities, setRecentActivities] = useState([]);
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
      const [invRes, riskRes, shipRes, recRes, routeRes, fcRes, auditRes] = await Promise.all([
        inventoryService.getInventory(),
        riskService.getRisks(),
        shipmentService.getShipments(),
        recommendationService.getRecommendations(),
        routeService.getRoutes(),
        forecastService.getForecast({ horizon: forecastHorizon, category: forecastCategory }),
        auditService.getLogs()
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
      setRecentActivities((auditRes.data || []).slice(0, 4));
      setRoutes(routeRes.data || []);
      setLocations(routeRes.locations || []);
      setForecastData(fcRes.data || []);
    } catch (e) {
      console.error('Failed to load command centre data', e);
    } finally {
      setLoading(false);
    }
  };

  const readinessScore = 94.2; // 94.2% operational readiness score

  if (loading && !forecastData.length) {
    return <LoadingScreen message="Initializing KARTAVYA Command Matrix..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Synthetic Demo Data Disclaimer */}
      <DataDisclaimerBanner 
        mode="prototype" 
        customText="KARTAVYA Command Interface active in prototype validation mode. Displaying synthetic demo data for forward logistics operations." 
      />

      {/* Strategic Command HUD Strip */}
      <div className="p-4 rounded-xl border border-[#263449] bg-gradient-to-r from-[#141F30] via-[#1B293B] to-[#141F30] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0B1220] border border-[#55E6C1]/40 flex items-center justify-center text-[#55E6C1] shrink-0 shadow-[0_0_12px_rgba(85,230,193,0.3)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
                Forward Strategic Command Matrix
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#55E6C1]/10 border border-[#55E6C1]/30 text-[#55E6C1] animate-pulse">
                DEFCON NOMINAL
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Sector Southwest Echelon • 6 Forward Depots Synchronized • Automated Telemetry Active
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#263449] text-[#94A3B8] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#55E6C1]" />
            <span className="text-[11px] text-[#F8FAFC] font-semibold">{currentTime}</span>
          </div>

          <button 
            onClick={() => navigate('/scenario-lab')}
            className="px-3 py-1.5 rounded-lg bg-[#55E6C1]/15 hover:bg-[#55E6C1]/25 border border-[#55E6C1]/40 text-[#55E6C1] hover:text-[#F8FAFC] transition-all flex items-center gap-1.5 font-bold shadow-[0_0_10px_rgba(85,230,193,0.15)]"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#55E6C1]" />
            <span>Stress Sandbox</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Command Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Inventory Readiness"
          value={`${readinessScore}%`}
          change="+2.4% Target"
          changeType="increase"
          icon={ShieldCheck}
          variant="cyan"
          subtitle="Buffer Nominal"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Stockout Risk"
          value={`${inventoryStats.critical} Depots`}
          change="Imminent Breach"
          changeType="critical"
          icon={AlertTriangle}
          variant="red"
          subtitle="Sector-4 & Borealis"
          onClick={() => navigate('/risk')}
        />
        <StatCard
          title="Active Shipments"
          value={`${shipments.length} Convoys`}
          change="62% Agg. Progress"
          changeType="neutral"
          icon={Truck}
          variant="sky"
          subtitle="Rail, Road & Air"
          onClick={() => navigate('/shipments')}
        />
        <StatCard
          title="Pending Approvals"
          value={`${recommendations.length} Staged`}
          change="Action Required"
          changeType="critical"
          icon={CheckSquare}
          variant="amber"
          subtitle="Decision Gate"
          onClick={() => navigate('/recommendations')}
        />
        <StatCard
          title="Corridor Status"
          value="3 / 5 Clear"
          change="1 Disrupted, 1 Closed"
          changeType="decrease"
          icon={Navigation}
          variant="amber"
          subtitle="Alpine & Desert"
          onClick={() => navigate('/routes')}
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
      </div>

      {/* Inventory Health & Stockout Shortage Bar */}
      <Card
        title="Inventory Stockpile Health & Shortage Posture"
        subtitle="Forward Depot Commodity Coverage Distribution (Synthetic Simulation)"
        icon={Layers}
        action={
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#94A3B8]">Buffer Integrity:</span>
            <span className="text-xs font-mono font-bold text-[#55E6C1]">94.2% Optimal</span>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Multi-segment progress bar */}
          <div className="h-3 w-full bg-[#0B1220] rounded-full overflow-hidden flex border border-[#263449]">
            <div 
              style={{ width: `${(inventoryStats.optimal / inventoryStats.total) * 100}%` }} 
              className="bg-[#55E6C1] h-full transition-all relative group" 
              title={`Optimal: ${inventoryStats.optimal} SKUs`}
            />
            <div 
              style={{ width: `${(inventoryStats.low / inventoryStats.total) * 100}%` }} 
              className="bg-[#38BDF8] h-full transition-all" 
              title={`Low: ${inventoryStats.low} SKUs`}
            />
            <div 
              style={{ width: `${(inventoryStats.critical / inventoryStats.total) * 100}%` }} 
              className="bg-[#F87171] h-full transition-all animate-pulse" 
              title={`Critical: ${inventoryStats.critical} SKUs`}
            />
            <div 
              style={{ width: `${(inventoryStats.excess / inventoryStats.total) * 100}%` }} 
              className="bg-[#FBBF24] h-full transition-all" 
              title={`Excess: ${inventoryStats.excess} SKUs`}
            />
          </div>

          {/* Interactive filter pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/inventory?status=Optimal')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#55E6C1] shadow-[0_0_6px_#55E6C1]" />
                <span className="text-[#F8FAFC] font-semibold">{inventoryStats.optimal} Optimal</span>
                <span className="text-[10px] text-[#94A3B8]">(Runway &gt;14d)</span>
              </button>

              <button 
                onClick={() => navigate('/inventory?status=Low')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                <span className="text-[#F8FAFC] font-semibold">{inventoryStats.low} Low Buffer</span>
                <span className="text-[10px] text-[#94A3B8]">(Runway 7-14d)</span>
              </button>

              <button 
                onClick={() => navigate('/inventory?status=Critical')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171] shadow-[0_0_6px_#F87171] animate-pulse" />
                <span className="text-[#F87171] font-bold">{inventoryStats.critical} Critical Shortages</span>
                <span className="text-[10px] text-[#94A3B8]">(Runway &lt;4d)</span>
              </button>

              <button 
                onClick={() => navigate('/inventory?status=Excess')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]" />
                <span className="text-[#F8FAFC] font-semibold">{inventoryStats.excess} Surplus</span>
                <span className="text-[10px] text-[#94A3B8]">(Runway &gt;30d)</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/inventory')}
              className="text-[#55E6C1] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Manage Stockpiles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Middle Grid: Predictive Forecast vs Theater Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Demand Forecast Predictive Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <Card
            title="Predictive Demand & Reserves"
            subtitle={`${forecastCategory} • Sector-4 Forward Depot`}
            icon={TrendingUp}
            action={
              <div className="flex items-center gap-2">
                {/* Category mini-selector */}
                <select
                  value={forecastCategory}
                  onChange={(e) => setForecastCategory(e.target.value)}
                  className="bg-[#0B1220] border border-[#263449] text-[#55E6C1] rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#55E6C1]"
                >
                  <option value="Fuel (JP-8 Synthetic)">Fuel (JP-8)</option>
                  <option value="Field Rations (MRE-X)">Field Rations</option>
                  <option value="Trauma Medical Kits">Medical Kits</option>
                  <option value="Potable Water (Purified)">Potable Water</option>
                </select>

                {/* Horizon buttons */}
                <div className="flex items-center gap-1 bg-[#0B1220] p-1 rounded-md border border-[#263449] text-xs font-mono">
                  {[7, 15, 30].map(h => (
                    <button
                      key={h}
                      onClick={() => setForecastHorizon(h)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        forecastHorizon === h
                          ? 'bg-[#55E6C1]/20 text-[#55E6C1] font-bold border border-[#55E6C1]/40 shadow-[0_0_8px_rgba(85,230,193,0.2)]'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263449" opacity={0.6} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontFamily="monospace"
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B1220',
                      borderColor: '#263449',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      color: '#F8FAFC',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                    }}
                    labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
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
                    stroke="#FBBF24" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Safety Buffer (18k L)', position: 'insideTopRight', fill: '#FBBF24', fontSize: 10, fontFamily: 'monospace' }} 
                  />

                  {/* Stock level area */}
                  <Area
                    type="monotone"
                    dataKey="currentStockLevel"
                    fill="url(#stockAreaGlow)"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    name="currentStockLevel"
                  />

                  {/* Historical demand */}
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    dot={{ fill: '#94A3B8', r: 3 }}
                    name="historical"
                  />

                  {/* Forecast demand line */}
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="#55E6C1"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ fill: '#55E6C1', r: 3 }}
                    name="projected"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-[#263449] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4 text-[#94A3B8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#94A3B8]" /> Historical
                </span>
                <span className="flex items-center gap-1.5 text-[#55E6C1]">
                  <span className="w-2.5 h-0.5 bg-[#55E6C1] border-dashed" /> Forecast Demand
                </span>
                <span className="flex items-center gap-1.5 text-[#38BDF8]">
                  <span className="w-2.5 h-2.5 bg-[#38BDF8]/20 border border-[#38BDF8] rounded-sm" /> Depot Reserve
                </span>
                <span className="flex items-center gap-1.5 text-[#FBBF24]">
                  <span className="w-2.5 h-0.5 bg-[#FBBF24] border-dashed" /> Safety Buffer
                </span>
              </div>
              <button 
                onClick={() => navigate('/forecast')}
                className="text-[#55E6C1] hover:underline inline-flex items-center gap-1 font-semibold group"
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

            <div className="mt-3.5 divide-y divide-[#263449] text-xs font-mono">
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-[#1B293B]/60 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#55E6C1] shadow-[0_0_6px_#55E6C1]" />
                  <span className="text-[#F8FAFC] font-medium">Corridor Diamond (Hyper-Rail)</span>
                </div>
                <span className="text-[#55E6C1] font-semibold">Available • 7.5h</span>
              </div>
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-[#1B293B]/60 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]" />
                  <span className="text-[#94A3B8]">Corridor Cobalt (Desert Hwy)</span>
                </div>
                <span className="text-[#FBBF24] font-semibold">Disrupted (+6h Dust)</span>
              </div>
              <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-[#1B293B]/60 px-1 rounded transition-colors" onClick={() => navigate('/routes')}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F87171] shadow-[0_0_6px_#F87171]" />
                  <span className="text-[#94A3B8]">Pass Echo (Alpine Ridge)</span>
                </div>
                <span className="text-[#F87171] font-semibold">Closed (Blizzard)</span>
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
          subtitle="4 Staged • Human Decision Gate"
          icon={CheckSquare}
          action={
            <button 
              onClick={() => navigate('/recommendations')}
              className="text-xs font-mono text-[#55E6C1] hover:underline font-semibold"
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
                className="p-3 rounded-lg bg-[#1B293B]/60 hover:bg-[#1B293B] border border-[#263449] hover:border-[#55E6C1]/40 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#F8FAFC]">{rec.location}</span>
                  <Badge variant={rec.priority === 'Critical' ? 'red' : 'amber'} size="sm">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-[#94A3B8] font-medium">{rec.supplyCategory}</p>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-[#263449]">
                  <span className="text-[#55E6C1] font-semibold">
                    Replenish: {rec.suggestedReplenishmentQty.toLocaleString()} {rec.unit}
                  </span>
                  <span className="text-[#94A3B8]">ETA: {rec.illustrativeETA}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shortage Risk Alerts */}
        <Card
          title="Shortage Risk Intelligence"
          subtitle="2 Critical Imminent Triggers"
          icon={AlertTriangle}
          action={
            <button 
              onClick={() => navigate('/risk')}
              className="text-xs font-mono text-[#55E6C1] hover:underline font-semibold"
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
                className="p-3 rounded-lg bg-[#1B293B]/60 hover:bg-[#1B293B] border border-[#263449] hover:border-[#F87171]/40 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F8FAFC] truncate">{risk.title}</span>
                  <Badge variant="red" size="sm">{risk.projectedStockCoverage} Days left</Badge>
                </div>
                <p className="text-xs text-[#94A3B8] font-mono">{risk.location} • {risk.supplyCategory}</p>
                <p className="text-xs text-[#94A3B8] font-sans line-clamp-2 leading-relaxed pt-1">
                  {risk.riskExplanation}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* In Transit Active Shipments */}
        <Card
          title="Active Convoys in Transit"
          subtitle="3 Active • Real-time Telemetry"
          icon={Truck}
          action={
            <button 
              onClick={() => navigate('/shipments')}
              className="text-xs font-mono text-[#55E6C1] hover:underline font-semibold"
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
                className="p-3 rounded-lg bg-[#1B293B]/60 hover:bg-[#1B293B] border border-[#263449] hover:border-[#55E6C1]/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#55E6C1]">{s.id}</span>
                  <Badge variant="cyan" size="sm">{s.progressPercent}% Transit</Badge>
                </div>
                <p className="text-xs text-[#F8FAFC] font-medium mt-1">
                  {s.originCode} → {s.destinationCode} • {s.quantity.toLocaleString()} {s.unit}
                </p>
                <p className="text-[11px] text-[#94A3B8] font-mono mt-1 truncate">
                  {s.transportOption}
                </p>
                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-[#0B1220] rounded-full h-1.5 overflow-hidden border border-[#263449]">
                  <div 
                    className="bg-[#55E6C1] h-full rounded-full transition-all shadow-[0_0_8px_#55E6C1]" 
                    style={{ width: `${s.progressPercent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity Log & Commander Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-8">
          <Card
            title="Recent Command & Custody Activity"
            subtitle="Live operational telemetry and human decision audit trail"
            icon={History}
            action={
              <button 
                onClick={() => navigate('/audit')}
                className="text-xs font-mono text-[#55E6C1] hover:underline font-semibold"
              >
                Full Audit Trail →
              </button>
            }
          >
            <div className="divide-y divide-[#263449] text-xs font-mono">
              {recentActivities.map(act => (
                <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 hover:bg-[#1B293B]/40 px-1 rounded transition-colors">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#55E6C1] mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F8FAFC]">{act.action}</span>
                        <span className="text-[10px] text-[#55E6C1] bg-[#55E6C1]/10 px-1.5 py-0.2 rounded border border-[#55E6C1]/20">
                          {act.entityId}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] font-sans mt-0.5">
                        {act.reason || 'Executed via command console validation'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#94A3B8]">
                      {act.actor}
                    </span>
                    <p className="text-[10px] text-[#94A3B8] opacity-75">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Commander Directives */}
        <div className="lg:col-span-4">
          <Card
            title="Operational Directives"
            subtitle="Rapid mission action triggers"
            icon={Zap}
          >
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/inventory')}
                className="w-full p-2.5 rounded-lg bg-[#1B293B] hover:bg-[#202E42] border border-[#263449] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#55E6C1] transition-colors">
                    Record Inbound Stock
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">Stage receipts at Sector-4 Depot</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#55E6C1] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('/recommendations')}
                className="w-full p-2.5 rounded-lg bg-[#1B293B] hover:bg-[#202E42] border border-[#263449] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#55E6C1] transition-colors">
                    Validate Requisitions
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">4 recommendations pending sign-off</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#55E6C1] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('/scenario-lab')}
                className="w-full p-2.5 rounded-lg bg-[#1B293B] hover:bg-[#202E42] border border-[#263449] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#55E6C1] transition-colors">
                    Simulate Crisis Sandbox
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">What-if demand surges & disruptions</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#55E6C1] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommandCentre;
