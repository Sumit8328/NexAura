import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Navigation } from 'lucide-react';

export const CompactMap = ({ routes = [], locations = [] }) => {
  const navigate = useNavigate();

  // Project points
  const minLng = -122.5;
  const maxLng = -104.0;
  const minLat = 31.5;
  const maxLat = 38.5;

  const projectToSvg = (lat, lng, width = 500, heightPx = 220) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 60) + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (heightPx - 50) + 25;
    return { x, y };
  };

  return (
    <div className="relative w-full h-[220px] bg-midnight-950 rounded-lg overflow-hidden border border-midnight-700/70 group">
      {/* Ambient Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      <svg viewBox="0 0 500 220" className="w-full h-full">
        {/* Draw simplified route lines */}
        {routes.map(r => {
          const points = r.waypoints.map(wp => projectToSvg(wp[0], wp[1]));
          const pathData = points.reduce((acc, curr, idx) => {
            return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
          }, '');

          const strokeColor = r.status === 'Available' ? '#00f0ff' : r.status === 'Disrupted' ? '#f59e0b' : '#f43f5e';

          return (
            <path
              key={r.id}
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeOpacity="0.75"
              strokeDasharray={r.status === 'Available' ? 'none' : '4 3'}
            />
          );
        })}

        {/* Draw location points */}
        {locations.map(loc => {
          const { x, y } = projectToSvg(loc.coords[0], loc.coords[1]);
          const isMain = loc.code === 'ZEN-00' || loc.code === 'DEP-04';

          return (
            <g key={loc.id} transform={`translate(${x}, ${y})`}>
              <circle r={isMain ? 6 : 4} fill="#0b1120" stroke="#00f0ff" strokeWidth="2" />
              <circle r={isMain ? 3 : 2} fill="#00f0ff" />
              <text x="8" y="3" fill="#cbd5e1" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {loc.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Overlay action bar */}
      <div className="absolute inset-0 bg-midnight-950/20 group-hover:bg-midnight-950/40 transition-colors flex items-end justify-between p-3 pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400 bg-midnight-900/90 px-2 py-0.5 rounded border border-midnight-700">
          5 Monitored Corridors
        </span>
        <button
          onClick={() => navigate('/routes')}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-midnight-900/90 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono transition-colors shadow-sm"
        >
          <Navigation className="w-3 h-3" />
          <span>Launch Route Map</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default CompactMap;
