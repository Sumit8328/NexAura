import React, { useState, useEffect } from 'react';
import { 
  Route, 
  MapPin, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Compass, 
  ShieldAlert, 
  Sliders,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Drawer from '../components/common/Drawer';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import LogisticsMap from '../components/maps/LogisticsMap';
import { routeService } from '../services/routeService';
import { useToast } from '../context/ToastContext';

export const RouteIntelligence = () => {
  const { success, info } = useToast();

  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    try {
      const res = await routeService.getRoutes();
      setRoutes(res.data || []);
      setLocations(res.locations || []);
      if (res.data?.length > 0) {
        setSelectedRoute(res.data[0]);
      }
    } catch (e) {
      console.error('Route data error', e);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setIsDrawerOpen(true);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    info(`Forward Base Selected: ${loc.name}`, `Status: ${loc.status} • Elevation: ${loc.elevation}`);
  };

  const toggleRouteStatus = async (routeId, newStatus) => {
    try {
      const res = await routeService.updateRouteStatus(routeId, newStatus, newStatus === 'Closed' ? 100 : newStatus === 'Disrupted' ? 45 : 0);
      success('Route Status Updated', `${res.route.name} is now marked ${newStatus}.`);
      loadRouteData();
      if (selectedRoute?.id === routeId) {
        setSelectedRoute(res.route);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tactical Disclaimer */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Fictional strategic logistics theater. Waypoints, corridor lines, and terrain hazards are illustrative simulation vectors for command evaluations and do not correspond to civilian ground transit paths."
      />

      {/* Main Map Viewport */}
      <LogisticsMap
        routes={routes}
        locations={locations}
        selectedRouteId={selectedRoute?.id}
        onSelectRoute={handleSelectRoute}
        onSelectLocation={handleSelectLocation}
        height="500px"
      />

      {/* Corridors Grid & Route Comparison Panel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Route className="w-5 h-5 text-cyan-400" />
              Strategic Corridor Matrix & Live Degradation
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Select any corridor to inspect waypoint telemetry or toggle simulated disruptions.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsComparing(!isComparing)}
            icon={Layers}
          >
            {isComparing ? 'Close Comparison Table' : 'Compare All 5 Corridors'}
          </Button>
        </div>

        {/* Detailed Comparison Table (Expandable) */}
        {isComparing && (
          <Card title="Multi-Modal Corridor Comparison Matrix" subtitle="Operational metrics side-by-side">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-midnight-700 bg-midnight-950/70 text-slate-400">
                    <th className="py-2.5 px-3">Corridor</th>
                    <th className="py-2.5 px-3">Modal Type</th>
                    <th className="py-2.5 px-3">Distance</th>
                    <th className="py-2.5 px-3">Transit Time</th>
                    <th className="py-2.5 px-3">Throughput</th>
                    <th className="py-2.5 px-3">Weather / Threat</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-800">
                  {routes.map(r => (
                    <tr 
                      key={r.id} 
                      className={`hover:bg-midnight-850 cursor-pointer ${selectedRoute?.id === r.id ? 'bg-midnight-850/80' : ''}`}
                      onClick={() => handleSelectRoute(r)}
                    >
                      <td className="py-3 px-3 font-bold text-white font-sans">{r.name}</td>
                      <td className="py-3 px-3 text-cyan-400">{r.primaryMode}</td>
                      <td className="py-3 px-3 text-slate-300">{r.distanceKm} km</td>
                      <td className="py-3 px-3 font-bold text-white">{r.transitHours} hrs</td>
                      <td className="py-3 px-3 text-slate-300">{r.transportCapacity}</td>
                      <td className="py-3 px-3 text-slate-400">{r.weatherSeverity}</td>
                      <td className="py-3 px-3">
                        <Badge 
                          variant={r.status === 'Available' ? 'cyan' : r.status === 'Disrupted' ? 'amber' : 'red'}
                          size="sm"
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Corridor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            const isAvailable = route.status === 'Available';
            const isDisrupted = route.status === 'Disrupted';
            const isClosed = route.status === 'Closed';

            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route)}
                className={`p-4 rounded-xl border bg-midnight-900/80 backdrop-blur-md cursor-pointer transition-all duration-200 group ${
                  isSelected 
                    ? 'border-cyan-400 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)] bg-midnight-850' 
                    : 'border-midnight-700/80 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                      {route.code}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                      {route.name}
                    </h3>
                  </div>
                  <Badge 
                    variant={isAvailable ? 'cyan' : isDisrupted ? 'amber' : 'red'}
                    size="sm"
                    dot={isDisrupted || isClosed}
                  >
                    {route.status}
                  </Badge>
                </div>

                {/* Corridor Origin / Destination */}
                <div className="mt-3 py-2 px-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs font-mono flex items-center justify-between text-slate-300">
                  <span className="truncate">{route.origin}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-1" />
                  <span className="truncate">{route.destination}</span>
                </div>

                {/* Key Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-midnight-800 text-slate-400">
                  <div>
                    <span className="text-[10px] uppercase block text-slate-500">Transit Duration</span>
                    <span className="text-white font-bold">{route.transitHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block text-slate-500">Payload Capacity</span>
                    <span className="text-white font-bold">{route.transportCapacity}</span>
                  </div>
                  <div className="col-span-2 text-[11px] text-slate-400 mt-1 truncate">
                    Mode: <span className="text-cyan-400">{route.primaryMode}</span>
                  </div>
                </div>

                {/* Status Quick Toggle */}
                <div className="mt-3 pt-2.5 border-t border-midnight-800 flex items-center justify-between gap-1 text-[10px] font-mono" onClick={(e) => e.stopPropagation()}>
                  <span className="text-slate-400">Simulate:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleRouteStatus(route.id, 'Available')}
                      className={`px-2 py-0.5 rounded ${route.status === 'Available' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => toggleRouteStatus(route.id, 'Disrupted')}
                      className={`px-2 py-0.5 rounded ${route.status === 'Disrupted' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
                    >
                      Disrupt
                    </button>
                    <button
                      onClick={() => toggleRouteStatus(route.id, 'Closed')}
                      className={`px-2 py-0.5 rounded ${route.status === 'Closed' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Route Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedRoute?.name}
        subtitle={`${selectedRoute?.code} • ${selectedRoute?.primaryMode}`}
        badge={selectedRoute && (
          <Badge 
            variant={selectedRoute.status === 'Available' ? 'cyan' : selectedRoute.status === 'Disrupted' ? 'amber' : 'red'}
            size="sm"
          >
            {selectedRoute.status}
          </Badge>
        )}
      >
        {selectedRoute && (
          <div className="space-y-5 text-xs font-mono">
            {/* Hazard Alert Panel */}
            <div className={`p-3.5 rounded-lg border ${
              selectedRoute.status === 'Closed' ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' :
              selectedRoute.status === 'Disrupted' ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' :
              'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Corridor Environmental Intel
              </div>
              <p className="font-sans text-xs leading-relaxed">{selectedRoute.hazardDetails}</p>
            </div>

            {/* Spec grid */}
            <div className="p-4 rounded-lg bg-midnight-950 border border-midnight-800 space-y-2.5 text-slate-300">
              <div className="flex justify-between py-1 border-b border-midnight-850">
                <span className="text-slate-400">Origin Depot:</span>
                <span className="text-white font-bold">{selectedRoute.origin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-850">
                <span className="text-slate-400">Destination Node:</span>
                <span className="text-white font-bold">{selectedRoute.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-850">
                <span className="text-slate-400">Nominal Transit Duration:</span>
                <span className="text-white font-bold">{selectedRoute.transitHours} Hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-850">
                <span className="text-slate-400">Gross Corridor Distance:</span>
                <span className="text-white font-bold">{selectedRoute.distanceKm} Kilometers</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-850">
                <span className="text-slate-400">Fleet Throughput:</span>
                <span className="text-white font-bold">{selectedRoute.transportCapacity}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Simulated Degradation:</span>
                <span className="text-amber-400 font-bold">{selectedRoute.simulatedDisruption}% Delay Factor</span>
              </div>
            </div>

            {/* Waypoints Sequence */}
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-2">Simulated GIS Waypoint Trace</div>
              <div className="space-y-1.5">
                {selectedRoute.waypoints.map((wp, i) => (
                  <div key={i} className="p-2 rounded bg-midnight-950 border border-midnight-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">WP-{i + 1}</span>
                    <span className="text-cyan-400 font-bold">{wp[0].toFixed(4)}°N, {Math.abs(wp[1]).toFixed(4)}°W</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RouteIntelligence;
