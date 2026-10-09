import React from 'react';

/**
 * Reusable KARTAVYA Tactical Loading Screen
 */
export const LoadingScreen = ({ 
  message = 'Initializing KARTAVYA Telemetry Matrix...',
  subtext = 'Synchronizing multi-modal operational parameters • Echelon Ready',
  compact = false 
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center p-8 text-xs font-mono text-cyan-400 gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-[360px] flex flex-col items-center justify-center p-8 bg-midnight-950/60 rounded-xl border border-midnight-800/80 backdrop-blur-sm">
      <div className="relative mb-6">
        {/* Glow halo */}
        <div className="absolute -inset-4 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
        
        {/* Insignia emblem */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-blue-700 p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.35)]">
          <div className="w-full h-full bg-midnight-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <svg 
              viewBox="0 0 32 32" 
              className="w-8 h-8 text-cyan-400"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M16 3L27 8.5V17.5C27 23.5 22 27.8 16 29.5C10 27.8 5 23.5 5 17.5V8.5L16 3Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-90"
              />
              <path d="M16 6.5V16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9.5 22.5L16 16" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M22.5 22.5L16 16" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="2.2" fill="#ffffff" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand title */}
      <h3 className="font-sans font-black text-white text-base tracking-[0.25em] uppercase">
        KARTAV<span className="text-cyan-400">YA</span>
      </h3>
      <p className="text-[11px] text-cyan-400 font-mono tracking-wider mt-1 uppercase">
        Predict • Prepare • Deliver
      </p>

      {/* Active message */}
      <div className="mt-5 flex items-center gap-2.5 text-xs font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>{message}</span>
      </div>
      <p className="text-[11px] font-mono text-slate-500 mt-1 max-w-sm text-center">
        {subtext}
      </p>
    </div>
  );
};

export default LoadingScreen;
