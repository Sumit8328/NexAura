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
    <div className={`relative bg-[#141F30] rounded-xl border ${
      borderAccent ? 'border-[#55E6C1]/40 shadow-[0_0_20px_-5px_rgba(85,230,193,0.15)]' : 'border-[#263449]'
    } ${glow ? 'shadow-[0_0_16px_-2px_rgba(85,230,193,0.25)]' : 'shadow-lg'} overflow-hidden transition-all duration-200 ${className}`}>
      
      {/* Tactical top-left accent tick */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#55E6C1]/60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#55E6C1]/60 pointer-events-none" />

      {(title || subtitle || action || badge || Icon) && (
        <div className="px-5 py-4 border-b border-[#263449] flex items-center justify-between gap-3 bg-[#1B293B]/70">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-[#55E6C1]/10 text-[#55E6C1] border border-[#55E6C1]/20 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {title && <h3 className="text-sm font-semibold text-[#F8FAFC] tracking-wide truncate">{title}</h3>}
                {badge && <div className="shrink-0">{badge}</div>}
              </div>
              {subtitle && <p className="text-xs text-[#94A3B8] font-mono mt-0.5 truncate">{subtitle}</p>}
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
