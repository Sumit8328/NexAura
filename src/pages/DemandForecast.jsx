import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Calendar, 
  AlertCircle, 
  Compass, 
  Sliders, 
  Clock, 
  Cpu,
  Info,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
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
  ReferenceLine,
  Legend 
} from 'recharts';

export const DemandForecast = () => {
  const [horizon, setHorizon] = useState(15);
  const [category, setCategory] = useState('Fuel (JP-8 Synthetic)');
  const [location, setLocation] = useState('Sector-4 Forward Depot');
  const [forecastState, setForecastState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, [horizon, category, location]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      const res = await forecastService.getForecast({ horizon, category, location });
      setForecastState(res);
    } catch (e) {
      console.error('Forecast load error', e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = forecastState?.data || [];
  const factors = forecastState?.factors || [];

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner: Client-Side Prototype Model Disclaimer */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Client-side heuristic forecast simulator. These synthetic projections model burn rates and uncertainty bounds. Real neural network model weights will be served by Python FastAPI upon Antigravity backend hookup."
      />

      {/* Control Strip */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Horizon tabs */}
            <div className="flex items-center gap-1 bg-midnight-950 p-1 rounded-lg border border-midnight-700 text-xs font-mono">
              {[7, 15, 30].map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    horizon === h
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {h}-Day Horizon
                </button>
              ))}
            </div>

            {/* Category selector */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="Fuel (JP-8 Synthetic)">Fuel (JP-8 Synthetic)</option>
              <option value="Field Rations (MRE-X)">Field Rations (MRE-X)</option>
              <option value="Trauma Medical Kits">Trauma Medical Kits</option>
              <option value="Potable Water (Purified)">Potable Water</option>
              <option value="Tactical Energy Cells">Tactical Energy Cells</option>
              <option value="Armored Spares & Optics">Armored Spares</option>
            </select>

            {/* Location selector */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="Sector-4 Forward Depot">Sector-4 Forward Depot</option>
              <option value="Borealis Mountain Outpost">Borealis Mountain Outpost</option>
              <option value="Aurora Station Alpha">Aurora Station Alpha</option>
              <option value="Zenith Central Hub">Zenith Central Hub</option>
              <option value="Helios Coastal Base">Helios Coastal Base</option>
              <option value="Vanguard Perimeter Camp">Vanguard Perimeter Camp</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Freshness: 14m ago</span>
          </div>
        </div>
      </Card>

      {/* Dynamic Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl border border-midnight-700 bg-midnight-900/90 shadow-card">
          <div className="text-[10px] uppercase font-bold text-slate-400">Peak Projected Burn</div>
          <div className="text-xl font-bold text-white mt-1">
            {forecastState?.peakDemand ? Number(forecastState.peakDemand).toLocaleString() : '—'}{' '}
            <span className="text-xs font-normal text-slate-400">{forecastState?.unit}/day</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Mean: {forecastState?.avgDemand?.toLocaleString()} {forecastState?.unit}/d</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-midnight-700 bg-midnight-900/90 shadow-card">
          <div className="text-[10px] uppercase font-bold text-slate-400">Buffer Breach Point</div>
          <div className={`text-xl font-bold mt-1 ${forecastState?.breachDate?.includes('None') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {forecastState?.breachDate || 'Analyzing...'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {forecastState?.breachDate?.includes('None') ? 'Buffer intact throughout' : 'Emergency order mandated'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-midnight-700 bg-midnight-900/90 shadow-card">
          <div className="text-[10px] uppercase font-bold text-slate-400">Lowest Projected Reserve</div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {forecastState?.minReserve ? Number(forecastState.minReserve).toLocaleString() : '0'}{' '}
            <span className="text-xs font-normal text-slate-400">{forecastState?.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Trough Expected: <span className="text-slate-200">{forecastState?.minReserveDate}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-midnight-700 bg-midnight-900/90 shadow-card">
          <div className="text-[10px] uppercase font-bold text-slate-400">Model Confidence Rating</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">
            {forecastState?.confidenceScore || 91.4}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {horizon}-Day Heuristic CI (p&lt;0.05)
          </div>
        </div>
      </div>

      {/* Main Interactive Forecast Chart Card */}
      <Card
        title={`Consumption Forecast & Reserve Depletion (${horizon}-Day Projection)`}
        subtitle={`${category} • ${location} • Model Confidence: ${forecastState?.confidenceScore || 91.4}%`}
        icon={TrendingUp}
        badge={
          <div className="flex items-center gap-1.5">
            <Badge variant={horizon === 30 ? 'amber' : 'cyan'} size="sm">
              {horizon}-Day Bounds Active
            </Badge>
          </div>
        }
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <defs>
                {/* Confidence band gradient */}
                <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55E6C1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#55E6C1" stopOpacity={0.02}/>
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
                tickFormatter={(v) => Number(v) > 999 ? `${(v/1000).toFixed(0)}k` : v}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1220',
                  borderColor: '#263449',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#F8FAFC',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)'
                }}
                labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
                formatter={(val, name) => {
                  if (val === null) return ['—', name];
                  const labelMap = {
                    historical: 'Historical Draw',
                    projected: 'Predicted Demand',
                    projectedMax: 'Upper Bound (95% CI)',
                    projectedMin: 'Lower Bound (95% CI)',
                    currentStockLevel: 'Depot Reserve Runway'
                  };
                  return [`${Number(val).toLocaleString()} ${forecastState?.unit || ''}`, labelMap[name] || name];
                }}
              />

              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              />

              {/* Safety stock baseline */}
              <ReferenceLine 
                y={chartData[0]?.safetyThreshold || 18000} 
                stroke="#FBBF24" 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Safety Buffer (${chartData[0]?.safetyThreshold?.toLocaleString()} ${forecastState?.unit})`, 
                  position: 'insideTopRight', 
                  fill: '#FBBF24', 
                  fontSize: 10, 
                  fontFamily: 'monospace' 
                }} 
              />

              {/* Confidence Band (Min to Max) */}
              <Area
                type="monotone"
                dataKey="projectedMax"
                stroke="none"
                fill="url(#uncertaintyGradient)"
                name="projectedMax"
              />

              {/* Strategic reserve projection */}
              <Line
                type="monotone"
                dataKey="currentStockLevel"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={false}
                name="currentStockLevel"
              />

              {/* Historical actuals */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#94A3B8"
                strokeWidth={2}
                dot={{ fill: '#94A3B8', r: 3 }}
                name="historical"
              />

              {/* Forecast mean trajectory */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#55E6C1"
                strokeWidth={3}
                strokeDasharray="5 3"
                dot={{ fill: '#55E6C1', r: 3.5 }}
                name="projected"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Info Bar */}
        <div className="mt-4 pt-3 border-t border-midnight-750 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Blue Shaded Envelope: 95% Uncertainty Confidence Interval</span>
          </div>
          <div className="text-slate-400">
            Model Engine: <span className="text-slate-200">Prototype Hybrid Autoregressive (Client-Side Simulation)</span>
          </div>
        </div>
      </Card>

      {/* Two Column Grid: Influencing Factors & Methodology Note */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factors Influencing the Forecast */}
        <Card
          title="Predictive Weight Factors"
          subtitle="Variables driving current variance"
          icon={Sliders}
        >
          <div className="space-y-3">
            {factors.map((f, i) => (
              <div 
                key={i}
                className="p-3 rounded-lg bg-midnight-850/60 border border-midnight-750 flex items-start justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{f.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      f.direction === 'up' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                      f.direction === 'warning' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {f.impact}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs font-sans mt-1 leading-relaxed">{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Methodology & Antigravity Backend Readiness Note */}
        <Card
          title="Forecast Methodology & Data Limitations"
          subtitle="Model specifications and operational boundaries"
          icon={Cpu}
        >
          <div className="space-y-3 text-xs font-mono text-slate-300">
            <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Simulation Framework</span>
              <p className="font-sans text-xs leading-relaxed text-slate-300">
                The displayed projections utilize a prototype rolling autoregressive mean weighted by 72-hour trailing consumption, simulated environmental thermal coefficients, and mission surge schedules.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Data Limitations</span>
              <p className="font-sans text-xs leading-relaxed text-slate-300">
                Satellite meteorological telemetry is sampled on a 12-hour cadence. Extreme sudden weather disruptions (e.g. unexpected blizzards in Pass Echo) may widen real lead times beyond standard variance.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Future FastAPI Service Hook</span>
              <p className="font-sans text-xs leading-relaxed text-slate-300">
                Upon starting the Python FastAPI backend, this page invokes <code className="text-cyan-300">GET /api/v1/forecast</code> via the pre-built <code className="text-cyan-300">forecastService.js</code> contract with zero frontend refactoring required.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DemandForecast;
