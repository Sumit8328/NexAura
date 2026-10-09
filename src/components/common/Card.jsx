import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  badge,
  action,
  icon: Icon,
  className = '',
  contentClassName = '',
  borderAccent = false,
  glow = false
}) => {
  return (
    <div className={`relative bg-midnight-900/80 backdrop-blur-md rounded-lg border ${
      borderAccent ? 'border-cyan-500/40 shadow-[0_0_20px_-5px_rgba(0,240,255,0.15)]' : 'border-midnight-700/70'
    } ${glow ? 'shadow-cyan-glow' : 'shadow-card'} overflow-hidden transition-all duration-200 ${className}`}>
      
      {/* Tactical top-left accent tick */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      {(title || subtitle || action || badge || Icon) && (
        <div className="px-5 py-4 border-b border-midnight-700/60 flex items-center justify-between gap-3 bg-midnight-850/40">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {title && <h3 className="text-sm font-semibold text-slate-100 tracking-wide truncate">{title}</h3>}
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
