import React from 'react';

/**
 * KARTAVYA Brand Mark & Wordmark
 * Distinctive, clean geometric logistics & intelligence insignia.
 * Brand Tagline: "Predict. Prepare. Deliver."
 */
export const KartavyaLogo = ({ 
  collapsed = false, 
  size = 'md', 
  showTagline = true,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* KARTAVYA Insignia Icon */}
      <div className="relative group shrink-0">
        {/* Ambient cyan glow */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-[#55E6C1]/30 to-[#38BDF8]/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Core emblem container */}
        <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#55E6C1] via-[#2DD4BF] to-[#38BDF8] p-[1.5px] shadow-[0_0_15px_rgba(85,230,193,0.4)]">
          <div className="w-full h-full bg-[#0B1220] rounded-[6.5px] flex items-center justify-center overflow-hidden relative">
            {/* Subtle tactical grid background */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #55E6C1 1px, transparent 1px)',
                backgroundSize: '6px 6px'
              }}
            />

            {/* Custom SVG: Minimal Logistics Nexus & Decision Vectors */}
            <svg 
              viewBox="0 0 32 32" 
              className="w-6 h-6 text-[#55E6C1] transition-transform duration-300 group-hover:scale-105"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer faceted shield boundary */}
              <path 
                d="M16 3L27 8.5V17.5C27 23.5 22 27.8 16 29.5C10 27.8 5 23.5 5 17.5V8.5L16 3Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-95 drop-shadow-[0_0_4px_rgba(85,230,193,0.8)]"
              />

              {/* Internal converging logistics vectors (Triad: Predict, Prepare, Deliver) */}
              {/* Top to Center vector */}
              <path 
                d="M16 6.5V16" 
                stroke="#38BDF8" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              {/* Bottom-left to Center vector */}
              <path 
                d="M9.5 22.5L16 16" 
                stroke="#55E6C1" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              {/* Bottom-right to Center vector */}
              <path 
                d="M22.5 22.5L16 16" 
                stroke="#55E6C1" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />

              {/* Central glowing intelligence node */}
              <circle 
                cx="16" 
                cy="16" 
                r="2.2" 
                fill="#F8FAFC" 
                className="animate-pulse drop-shadow-[0_0_6px_#55E6C1]"
              />

              {/* Tactical apex indicator */}
              <circle 
                cx="16" 
                cy="6.5" 
                r="1" 
                fill="#38BDF8" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Wordmark & Tagline (Desktop / Expanded) */}
      {!collapsed && (
        <div className="min-w-0 transition-opacity duration-200">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-black text-[#F8FAFC] text-base tracking-[0.2em] uppercase">
              KARTAV<span className="text-[#55E6C1]">YA</span>
            </span>
            <span className="font-semibold text-[#55E6C1] text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1B293B] border border-[#263449] tracking-wider">
              COMMAND
            </span>
          </div>
          {showTagline && (
            <p className="text-[10px] text-[#94A3B8] font-mono tracking-tight truncate mt-0.5">
              Predict • Prepare • Deliver
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default KartavyaLogo;
