import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Layers, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import Badge from '../common/Badge';

export const LogisticsMap = ({ 
  routes = [], 
  locations = [], 
  selectedRouteId = null, 
  onSelectRoute = () => {},
  onSelectLocation = () => {},
  height = '500px',
  interactive = true 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'available' | 'disrupted' | 'closed'
  const [mapMode, setMapMode] = useState('tactical'); // 'tactical' (vector) | 'satellite'

  // Filter routes
  const filteredRoutes = routes.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status.toLowerCase() === activeFilter.toLowerCase();
  });

  // Calculate coordinates bounds for SVG scaling
  // Longitude: -122 to -104, Latitude: 32 to 39
  const minLng = -122.5;
  const maxLng = -104.0;
  const minLat = 31.5;
  const maxLat = 38.5;

  const projectToSvg = (lat, lng, width = 900, heightPx = 500) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 120) + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (heightPx - 100) + 50;
    return { x, y };
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#263449] bg-[#0B1220] shadow-2xl flex flex-col" style={{ minHeight: height }}>
      {/* Tactical Top Bar */}
      <div className="px-4 py-3 bg-[#141F30]/90 border-b border-[#263449] flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55E6C1] animate-pulse shadow-[0_0_8px_#55E6C1]" />
            <span className="text-xs font-mono font-bold text-[#F8FAFC] tracking-wider uppercase">
              Tactical Theater Grid // Sector-Southwest Command
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#55E6C1] px-2 py-0.5 rounded bg-[#1B293B] border border-[#263449]">
            Fictional Staging Bounds
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#0B1220] p-1 rounded-lg border border-[#263449] text-xs font-mono">
          {['all', 'available', 'disrupted', 'closed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                activeFilter === filter
                  ? 'bg-[#55E6C1]/20 text-[#55E6C1] border border-[#55E6C1]/40 font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Tactical Map Canvas */}
      <div className="relative flex-1 w-full bg-[#0B1220] overflow-hidden select-none" style={{ minHeight: '400px' }}>
        {/* Ambient Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(85, 230, 193, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(85, 230, 193, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Secondary diagonal radar sweeps */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(85,230,193,0.05)_0,transparent_70%)] pointer-events-none" />

        <svg 
          viewBox="0 0 900 500" 
          className="w-full h-full min-h-[420px] transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Glow filters */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Range rings centered around Zenith Central Hub */}
          <circle cx="780" cy="220" r="140" fill="none" stroke="rgba(85, 230, 193, 0.08)" strokeDasharray="4 4" />
          <circle cx="780" cy="220" r="280" fill="none" stroke="rgba(85, 230, 193, 0.06)" strokeDasharray="6 6" />
          <circle cx="780" cy="220" r="420" fill="none" stroke="rgba(85, 230, 193, 0.04)" strokeDasharray="8 8" />

          {/* Coordinate Marks */}
          <text x="75" y="30" fill="#94A3B8" fontSize="10" fontFamily="monospace">GRID SECTOR 34°N / 118°W</text>
          <text x="700" y="30" fill="#94A3B8" fontSize="10" fontFamily="monospace">ZENITH HUB SECTOR 39°N / 105°W</text>
          <text x="75" y="480" fill="#94A3B8" fontSize="10" fontFamily="monospace">HELIOS COASTAL 32°N / 117°W</text>

          {/* Draw Route Paths */}
          {filteredRoutes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const points = route.waypoints.map(wp => projectToSvg(wp[0], wp[1]));
            const pathData = points.reduce((acc, curr, idx) => {
              return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
            }, '');

            let strokeColor = '#55E6C1';
            let strokeDash = 'none';
            let filterId = 'cyanGlow';

            if (route.status === 'Disrupted') {
              strokeColor = '#FBBF24';
              strokeDash = '6 4';
              filterId = 'amberGlow';
            } else if (route.status === 'Closed') {
              strokeColor = '#F87171';
              strokeDash = '4 4';
              filterId = 'redGlow';
            }

            return (
              <g 
                key={route.id} 
                className="cursor-pointer group"
                onClick={() => onSelectRoute(route)}
              >
                {/* Thick invisible hit area for easy hover/clicking */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                  className="cursor-pointer"
                />

                {/* Outer halo / background line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelected ? strokeColor : strokeColor}
                  strokeWidth={isSelected ? '6' : '3'}
                  strokeDasharray={strokeDash}
                  strokeOpacity={isSelected ? '0.9' : '0.6'}
                  filter={`url(#${filterId})`}
                  className="transition-all duration-300"
                />

                {/* Animated traveling particle on active/available routes */}
                {route.status === 'Available' && (
                  <circle r="4" fill="#FFFFFF" filter="url(#cyanGlow)">
                    <animateMotion
                      path={pathData}
                      dur={`${Math.max(4, route.transitHours * 0.8)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Mid-point label for selected or hovered route */}
                {points.length > 1 && (
                  <g transform={`translate(${(points[0].x + points[points.length - 1].x) / 2}, ${(points[0].y + points[points.length - 1].y) / 2 - 12})`}>
                    <rect 
                      x="-55" 
                      y="-11" 
                      width="110" 
                      height="20" 
                      rx="4" 
                      fill="#0B1220" 
                      stroke={strokeColor} 
                      strokeWidth="1" 
                      opacity="0.88"
                    />
                    <text 
                      x="0" 
                      y="3" 
                      textAnchor="middle" 
                      fill={strokeColor} 
                      fontSize="9" 
                      fontFamily="monospace" 
                      fontWeight="bold"
                    >
                      {route.code} • {route.transitHours}h
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw Locations / Waypoints */}
          {locations.map((loc) => {
            const { x, y } = projectToSvg(loc.coords[0], loc.coords[1]);
            const isHub = loc.type.includes('Primary') || loc.code === 'ZEN-00';
            const isHazard = loc.status.includes('Threat') || loc.status.includes('Weather') || loc.status.includes('Constrained');

            return (
              <g 
                key={loc.id} 
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer group"
                onClick={() => onSelectLocation(loc)}
              >
                {/* Ping wave */}
                <circle 
                  r={isHub ? 16 : 11} 
                  fill="none" 
                  stroke={isHazard ? '#FBBF24' : '#55E6C1'} 
                  strokeWidth="1.5"
                  opacity="0.5"
                  className="animate-ping"
                  style={{ transformOrigin: 'center', animationDuration: '3s' }}
                />

                {/* Outer ring */}
                <circle 
                  r={isHub ? 10 : 7} 
                  fill="#0B1220" 
                  stroke={isHazard ? '#FBBF24' : '#55E6C1'} 
                  strokeWidth="2" 
                />

                {/* Center dot */}
                <circle 
                  r={isHub ? 5 : 3.5} 
                  fill={isHazard ? '#FBBF24' : '#55E6C1'} 
                />

                {/* Location Tag */}
                <g transform="translate(14, 4)">
                  <rect 
                    x="0" 
                    y="-12" 
                    width={loc.name.length * 6.5 + 44} 
                    height="20" 
                    rx="3" 
                    fill="#060a12" 
                    stroke="#1e293b" 
                    strokeWidth="1"
                    className="group-hover:stroke-cyan-400 transition-colors"
                  />
                  <text 
                    x="6" 
                    y="2" 
                    fill="#f8fafc" 
                    fontSize="10" 
                    fontFamily="monospace" 
                    fontWeight="bold"
                  >
                    {loc.code}
                  </text>
                  <text 
                    x="48" 
                    y="2" 
                    fill="#94a3b8" 
                    fontSize="9" 
                    fontFamily="sans-serif"
                  >
                    {loc.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Map Controls Floating Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-[#141F30]/90 p-1.5 rounded-lg border border-[#263449] backdrop-blur-md shadow-xl z-20">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.25))}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B293B] rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B293B] rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B293B] rounded transition-colors text-[10px] font-mono text-center"
            title="Reset Zoom"
          >
            1x
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-[#141F30]/90 p-3 rounded-lg border border-[#263449] backdrop-blur-md text-xs font-mono z-20 space-y-1.5 max-w-xs shadow-xl hidden sm:block">
          <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Corridor Status</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#55E6C1] rounded-full shadow-[0_0_6px_#55E6C1]" />
            <span className="text-[#F8FAFC] text-[11px]">Available / Clear</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#FBBF24] rounded-full border-dashed" />
            <span className="text-[#94A3B8] text-[11px]">Disrupted (Hazard/Delay)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#F87171] rounded-full" />
            <span className="text-[#94A3B8] text-[11px]">Closed / Blocked</span>
          </div>
        </div>

        {/* Selected Route Preview Pill */}
        {selectedRoute && (
          <div className="absolute top-4 left-4 bg-[#141F30]/95 p-3 rounded-lg border border-[#55E6C1]/50 backdrop-blur-md text-xs font-mono z-20 max-w-sm shadow-[0_0_15px_rgba(85,230,193,0.2)] animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-[#F8FAFC] text-sm">{selectedRoute.name}</span>
              <Badge 
                variant={selectedRoute.status === 'Available' ? 'cyan' : selectedRoute.status === 'Disrupted' ? 'amber' : 'red'}
                size="sm"
              >
                {selectedRoute.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#263449] text-[11px] text-[#94A3B8]">
              <div>Transit: <span className="text-[#F8FAFC] font-bold">{selectedRoute.transitHours} hrs</span></div>
              <div>Capacity: <span className="text-[#F8FAFC] font-bold">{selectedRoute.transportCapacity}</span></div>
              <div className="col-span-2 text-[#94A3B8] text-[10px] mt-1">{selectedRoute.hazardDetails}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="px-4 py-2 bg-[#141F30]/80 border-t border-[#263449] text-[11px] font-mono text-[#94A3B8] flex items-center justify-between">
        <span>* Illustrative operational coordinates for tactical simulation. Not real-world civilian GPS vectors.</span>
        <span className="text-[#55E6C1]">Vector GIS Engine 2.1</span>
      </div>
    </div>
  );
};

export default LogisticsMap;
