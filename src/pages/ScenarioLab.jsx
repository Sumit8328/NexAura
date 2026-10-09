import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  RotateCcw, 
  Play, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  Route, 
  Truck, 
  WifiOff, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Info,
  Zap,
  CloudSnow,
  Radio,
  BarChart3
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import { simulationService, DEFAULT_SCENARIO_CONFIG } from '../services/simulationService';
import { useToast } from '../context/ToastContext';
import { useSync } from '../context/SyncContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

export const ScenarioLab = () => {
  const { success, info } = useToast();
  const { setConnectivityState, syncStatus } = useSync();

  // Configurable sliders
  const [demandSurge, setDemandSurge] = useState(DEFAULT_SCENARIO_CONFIG.demandSurgePercent);
  const [delayDays, setDelayDays] = useState(DEFAULT_SCENARIO_CONFIG.inboundDelayDays);
  const [closedRoute, setClosedRoute] = useState(DEFAULT_SCENARIO_CONFIG.closedRouteId);
  const [capacityReduction, setCapacityReduction] = useState(DEFAULT_SCENARIO_CONFIG.capacityReductionPercent);
  const [weatherLevel, setWeatherLevel] = useState(DEFAULT_SCENARIO_CONFIG.weatherSeverityLevel);
  const [isOfflineMode, setIsOfflineMode] = useState(syncStatus.state === 'Offline');

  // Chart metric toggle: 'runway' | 'burn'
  const [chartMetric, setChartMetric] = useState('runway');

  // Computed results state
  const [scenarioResult, setScenarioResult] = useState(null);

  // Recalculate dynamically when any control changes
  useEffect(() => {
    runSimulation();
  }, [demandSurge, delayDays, closedRoute, capacityReduction, weatherLevel, isOfflineMode]);

  const runSimulation = () => {
    const config = {
      demandSurgePercent: demandSurge,
      inboundDelayDays: delayDays,
      closedRouteId: closedRoute,
      capacityReductionPercent: capacityReduction,
      weatherSeverityLevel: weatherLevel,
      simulatedNetworkOffline: isOfflineMode
    };
    const impact = simulationService.calculateScenarioImpact(config);
    setScenarioResult(impact);
  };

  const handleApplyPreset = (presetKey) => {
    switch (presetKey) {
      case 'surge':
        setDemandSurge(45);
        setDelayDays(2);
        setClosedRoute('ROUTE-02');
        setCapacityReduction(20);
        setWeatherLevel(3);
        setIsOfflineMode(false);
        setConnectivityState('Connected');
        info('Preset Activated', 'Applied Operation Iron Shield: Demand Surge (+45%) with Route Cobalt Blockade.');
        break;
      case 'blizzard':
        setDemandSurge(20);
        setDelayDays(5);
        setClosedRoute('ROUTE-04');
        setCapacityReduction(35);
        setWeatherLevel(5);
        setIsOfflineMode(false);
        setConnectivityState('Connected');
        info('Preset Activated', 'Applied Alpine Blizzard Crisis: Mountain Pass Echo Blocked with 5-day delay.');
        break;
      case 'blackout':
        setDemandSurge(15);
        setDelayDays(3);
        setClosedRoute('ROUTE-01');
        setCapacityReduction(25);
        setWeatherLevel(2);
        setIsOfflineMode(true);
        setConnectivityState('Offline');
        info('Preset Activated', 'Applied Communications Blackout: Forced Offline local cache resilience mode.');
        break;
      case 'baseline':
      default:
        handleResetScenario();
        break;
    }
  };

  const handleApplyScenario = () => {
    runSimulation();
    if (isOfflineMode) {
      setConnectivityState('Offline');
    } else {
      setConnectivityState('Connected');
    }
    success('Scenario Injected', 'Stress factors recalculated across forward inventory and transit corridors.');
  };

  const handleResetScenario = () => {
    setDemandSurge(0);
    setDelayDays(0);
    setClosedRoute('none');
    setCapacityReduction(0);
    setWeatherLevel(1);
    setIsOfflineMode(false);
    setConnectivityState('Connected');
    info('Scenario Reset', 'Restored baseline steady-state operational parameters.');
  };

  const comparison = scenarioResult?.comparison;
  const depots = scenarioResult?.depots || [];
  const adjustments = scenarioResult?.recommendedAdjustments || [];

  // Chart data formatted for Recharts BarChart
  const comparisonChartData = depots.map(d => ({
    name: d.name.split(' ')[0], // Sector-4, Borealis, Vanguard
    fullName: d.name,
    unit: d.unit,
    'Baseline Runway (Days)': d.baseCoverage,
    'Scenario Runway (Days)': d.scenarioCoverage,
    'Baseline Draw': d.baseDailyDraw,
    'Scenario Burn': d.scenarioDailyDraw,
    riskScore: d.scenarioRiskScore
  }));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DataDisclaimerBanner 
        mode="simulation"
        customText="Stress Scenario Sandbox Engine. Compound stressors recalculate forward stockout trajectories, delivery delays, and automated mitigation recommendations."
      />

      {/* Preset Scenario Cockpit Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white uppercase text-[11px]">1-Click Operational Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyPreset('surge')}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Operation Iron Shield (+45% Surge)</span>
            </button>
            <button
              onClick={() => handleApplyPreset('blizzard')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold transition-all flex items-center gap-1.5"
            >
              <CloudSnow className="w-3.5 h-3.5 text-cyan-400" />
              <span>Alpine Blizzard (Pass Blocked)</span>
            </button>
            <button
              onClick={() => handleApplyPreset('blackout')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold transition-all flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Comms Blackout (Offline)</span>
            </button>
            <button
              onClick={() => handleApplyPreset('baseline')}
              className="px-3 py-1.5 rounded-lg bg-midnight-950 hover:bg-midnight-800 text-slate-400 hover:text-white border border-midnight-700 font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Steady State</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Main Grid: Control Cockpit (5 cols) & Comparison Results (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title="Stress Factor Configuration"
            subtitle="Adjust synthetic multi-vector operational friction"
            icon={Sliders}
            action={
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleResetScenario}
                  title="Clear stressors"
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={handleApplyScenario}
                >
                  Apply
                </Button>
              </div>
            }
          >
            <div className="space-y-5 text-xs font-mono">
              {/* Demand Surge Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">1. Demand Surge</span>
                  <span className="text-cyan-400 font-bold text-sm">+{demandSurge}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={demandSurge}
                  onChange={(e) => setDemandSurge(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-midnight-950 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Baseline (0%)</span>
                  <span>Surge (+100%)</span>
                </div>
              </div>

              {/* Inbound Shipment Delay Slider */}
              <div className="space-y-1.5 pt-2 border-t border-midnight-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">2. Inbound Shipment Delay</span>
                  <span className="text-amber-400 font-bold text-sm">+{delayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="1"
                  value={delayDays}
                  onChange={(e) => setDelayDays(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-midnight-950 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>On Time (0d)</span>
                  <span>Severe Lag (+14d)</span>
                </div>
              </div>

              {/* Close Route Selector */}
              <div className="space-y-1.5 pt-2 border-t border-midnight-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">3. Corridor Closure</span>
                  <Badge variant={closedRoute !== 'none' ? 'red' : 'emerald'} size="sm">
                    {closedRoute !== 'none' ? 'Disrupted' : 'All Open'}
                  </Badge>
                </div>
                <select
                  value={closedRoute}
                  onChange={(e) => setClosedRoute(e.target.value)}
                  className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="none">No Forced Closures (Normal)</option>
                  <option value="ROUTE-02">Close Corridor Cobalt (Desert Highway E-40)</option>
                  <option value="ROUTE-01">Close Corridor Diamond (Hyper-Rail Mainline)</option>
                  <option value="ROUTE-04">Close Skybridge Air Corridor 09 (VTOL)</option>
                </select>
              </div>

              {/* Transport Fleet Capacity Reduction Slider */}
              <div className="space-y-1.5 pt-2 border-t border-midnight-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">4. Transport Fleet Degradation</span>
                  <span className="text-rose-400 font-bold text-sm">-{capacityReduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={capacityReduction}
                  onChange={(e) => setCapacityReduction(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-midnight-950 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>100% Fleet Available</span>
                  <span>-70% Heavy Losses</span>
                </div>
              </div>

              {/* Weather Severity Level */}
              <div className="space-y-1.5 pt-2 border-t border-midnight-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">5. Weather Disruption Tier</span>
                  <span className="text-amber-300 font-bold text-sm">Level {weatherLevel} / 5</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setWeatherLevel(lvl)}
                      className={`py-1.5 rounded text-center font-bold text-xs border transition-colors ${
                        weatherLevel === lvl 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-midnight-950 text-slate-500 border-midnight-800 hover:text-white'
                      }`}
                    >
                      L{lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Connectivity Toggle */}
              <div className="pt-2 border-t border-midnight-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-bold block">6. Simulated Offline State</span>
                  <span className="text-[10px] text-slate-500">Test client store resiliency</span>
                </div>
                <button
                  onClick={() => setIsOfflineMode(!isOfflineMode)}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-colors flex items-center gap-1.5 ${
                    isOfflineMode 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : 'bg-midnight-950 text-emerald-400 border-midnight-700'
                  }`}
                >
                  {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{isOfflineMode ? 'Forced Offline' : 'Connected'}</span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results & Comparison Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Baseline vs Scenario Metric Cards */}
          <Card
            title="Baseline vs Stress Scenario Comparison"
            subtitle="Recalculated in real-time across strategic parameters"
            icon={FlaskConical}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {/* Stock Coverage Delta */}
              <div className="p-3.5 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Projected Stock Coverage
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400 line-through text-xs">{comparison?.stockCoverage.baseline}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-rose-400 font-bold text-lg">{comparison?.stockCoverage.scenario}</span>
                </div>
                <div className="text-rose-400 text-[11px] mt-1 font-bold">
                  {comparison?.stockCoverage.delta} Runaway Drop
                </div>
              </div>

              {/* Shortage Risk Count */}
              <div className="p-3.5 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Shortage Risk Matrix
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400 line-through text-xs">{comparison?.shortageRisk.baseline}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-rose-400 font-bold text-lg">{comparison?.shortageRisk.scenario}</span>
                </div>
                <div className="text-rose-400 text-[11px] mt-1 font-bold">
                  {comparison?.shortageRisk.delta}
                </div>
              </div>

              {/* Delivery Delay Delta */}
              <div className="p-3.5 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Average Delivery Delay
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400 line-through text-xs">{comparison?.deliveryDelay.baseline}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-amber-400 font-bold text-lg">{comparison?.deliveryDelay.scenario}</span>
                </div>
                <div className="text-amber-400 text-[11px] mt-1 font-bold">
                  {comparison?.deliveryDelay.delta} Slippage
                </div>
              </div>

              {/* Available Corridors */}
              <div className="p-3.5 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Route Alternatives
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400 line-through text-xs">{comparison?.routeAlternatives.baseline}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-cyan-400 font-bold text-lg">{comparison?.routeAlternatives.scenario}</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  {comparison?.transportThroughput.scenario} Capacity
                </div>
              </div>
            </div>
          </Card>

          {/* Dynamic Comparison Chart Card */}
          <Card
            title="Comparative Stress Dynamics (Depot Level)"
            subtitle="Side-by-side parametric variance across forward positions"
            icon={BarChart3}
            action={
              <div className="flex items-center gap-1 bg-midnight-950 p-1 rounded-lg border border-midnight-750 text-xs font-mono">
                <button
                  onClick={() => setChartMetric('runway')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold ${
                    chartMetric === 'runway'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Stock Runway (Days)
                </button>
                <button
                  onClick={() => setChartMetric('burn')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold ${
                    chartMetric === 'burn'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily Burn Rate
                </button>
              </div>
            }
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263449" opacity={0.6} />
                  <XAxis 
                    dataKey="name" 
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
                    tickFormatter={(v) => chartMetric === 'burn' && Number(v) > 999 ? `${(v/1000).toFixed(0)}k` : v}
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
                    formatter={(val, name) => [
                      chartMetric === 'runway' ? `${val} Days` : Number(val).toLocaleString(),
                      name
                    ]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={32} 
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  {chartMetric === 'runway' ? (
                    <>
                      <Bar 
                        dataKey="Baseline Runway (Days)" 
                        fill="#55E6C1" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={48} 
                      />
                      <Bar 
                        dataKey="Scenario Runway (Days)" 
                        fill="#F87171" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={48} 
                      />
                    </>
                  ) : (
                    <>
                      <Bar 
                        dataKey="Baseline Draw" 
                        fill="#94A3B8" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={48} 
                      />
                      <Bar 
                        dataKey="Scenario Burn" 
                        fill="#FBBF24" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={48} 
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Depot Impact Breakdown Table */}
          <Card
            title="Depot Stockout Velocity Under Scenario"
            subtitle="Recalculated burn rate and stockout ETA"
            icon={ShieldAlert}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-midnight-700 bg-midnight-950/60 text-slate-400">
                    <th className="py-2.5 px-3">Forward Depot</th>
                    <th className="py-2.5 px-3">Base Draw</th>
                    <th className="py-2.5 px-3">Scenario Burn</th>
                    <th className="py-2.5 px-3">Runway Days</th>
                    <th className="py-2.5 px-3">Calculated Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-800">
                  {depots.map((d, i) => (
                    <tr key={i} className="hover:bg-midnight-850">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white font-sans">{d.name}</span>
                        <span className="text-[10px] text-slate-400 block">{d.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{d.baseDailyDraw.toLocaleString()}</td>
                      <td className="py-3 px-3 text-cyan-300 font-bold">{d.scenarioDailyDraw.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${d.scenarioCoverage < 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {d.scenarioCoverage} Days ({d.coverageDelta > 0 ? `+${d.coverageDelta}` : d.coverageDelta}d)
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge 
                          variant={d.scenarioRiskScore > 80 ? 'red' : 'amber'} 
                          size="sm"
                          dot={d.scenarioRiskScore > 80}
                        >
                          {d.scenarioRiskScore}% Probability
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Dynamic Algorithmic Recommended Replenishment Adjustments */}
          <Card
            title="Scenario Mitigation Directives"
            subtitle="Automated counter-measure adjustments for forward commanders"
            icon={CheckCircle2}
          >
            <div className="space-y-3">
              {adjustments.map((adj, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-lg bg-midnight-950 border border-cyan-500/30 text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 uppercase text-[11px]">{adj.priority}</span>
                    <Badge variant="cyan" size="sm">Dynamic AI Plan</Badge>
                  </div>
                  <p className="text-white font-bold font-sans text-xs">{adj.action}</p>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed pt-1">{adj.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioLab;
