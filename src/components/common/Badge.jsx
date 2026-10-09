import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wider',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_-2px_rgba(0,240,255,0.2)]',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_-2px_rgba(245,158,11,0.2)]',
    red: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_-2px_rgba(244,63,94,0.25)]',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
    purple: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/80'
  };

  const dotClasses = {
    cyan: 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]',
    emerald: 'bg-emerald-400 shadow-[0_0_6px_#10b981]',
    amber: 'bg-amber-400 shadow-[0_0_6px_#f59e0b]',
    red: 'bg-rose-500 shadow-[0_0_6px_#f43f5e]',
    slate: 'bg-slate-400',
    purple: 'bg-indigo-400',
    default: 'bg-slate-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded uppercase font-mono ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClasses[variant] || dotClasses.default}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
