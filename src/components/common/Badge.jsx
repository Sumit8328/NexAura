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
    cyan: 'bg-[#55E6C1]/10 text-[#55E6C1] border border-[#55E6C1]/30 shadow-[0_0_8px_-2px_rgba(85,230,193,0.2)]',
    sky: 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_8px_-2px_rgba(56,189,248,0.2)]',
    emerald: 'bg-[#55E6C1]/10 text-[#55E6C1] border border-[#55E6C1]/30',
    amber: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30 shadow-[0_0_8px_-2px_rgba(251,191,36,0.2)]',
    red: 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/30 shadow-[0_0_8px_-2px_rgba(248,113,113,0.25)]',
    slate: 'bg-[#1B293B] text-[#94A3B8] border border-[#263449]',
    purple: 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30',
    default: 'bg-[#1B293B]/80 text-[#94A3B8] border border-[#263449]'
  };

  const dotClasses = {
    cyan: 'bg-[#55E6C1] shadow-[0_0_6px_#55E6C1]',
    sky: 'bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]',
    emerald: 'bg-[#55E6C1] shadow-[0_0_6px_#55E6C1]',
    amber: 'bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]',
    red: 'bg-[#F87171] shadow-[0_0_6px_#F87171]',
    slate: 'bg-[#94A3B8]',
    purple: 'bg-[#38BDF8]',
    default: 'bg-[#94A3B8]'
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
