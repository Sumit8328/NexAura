import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  unit = '',
  change,
  changeType = 'neutral', // 'increase' | 'decrease' | 'neutral' | 'critical'
  subtitle,
  icon: Icon,
  variant = 'cyan', // 'cyan' | 'red' | 'amber' | 'emerald' | 'slate'
  onClick
}) => {
  const borderColors = {
    cyan: 'border-[#55E6C1]/30 hover:border-[#55E6C1]/70 shadow-[0_0_14px_-3px_rgba(85,230,193,0.15)]',
    red: 'border-[#F87171]/40 hover:border-[#F87171]/70 shadow-[0_0_14px_-3px_rgba(248,113,113,0.18)]',
    amber: 'border-[#FBBF24]/40 hover:border-[#FBBF24]/70 shadow-[0_0_14px_-3px_rgba(251,191,36,0.15)]',
    emerald: 'border-[#55E6C1]/30 hover:border-[#55E6C1]/70',
    sky: 'border-[#38BDF8]/30 hover:border-[#38BDF8]/70 shadow-[0_0_14px_-3px_rgba(56,189,248,0.15)]',
    slate: 'border-[#263449] hover:border-[#94A3B8]/60'
  };

  const iconColors = {
    cyan: 'text-[#55E6C1] bg-[#55E6C1]/10 border-[#55E6C1]/20',
    red: 'text-[#F87171] bg-[#F87171]/10 border-[#F87171]/20',
    amber: 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/20',
    emerald: 'text-[#55E6C1] bg-[#55E6C1]/10 border-[#55E6C1]/20',
    sky: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20',
    slate: 'text-[#94A3B8] bg-[#1B293B] border-[#263449]'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative bg-[#141F30] rounded-xl p-3.5 border transition-all duration-200 group ${borderColors[variant] || borderColors.slate} ${
        onClick ? 'cursor-pointer hover:bg-[#1B293B]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono font-semibold text-[#94A3B8] uppercase tracking-tight truncate" title={title}>
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl lg:text-2xl font-bold font-mono text-[#F8FAFC] tracking-tight">{value}</span>
            {unit && <span className="text-[10px] font-mono text-[#94A3B8]">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-1.5 lg:p-2 rounded-lg border ${iconColors[variant] || iconColors.slate} shrink-0 transition-transform group-hover:scale-105`}>
            <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-2.5 pt-2 border-t border-[#263449] flex items-center justify-between text-[11px] font-mono gap-1">
          {change && (
            <div className={`flex items-center gap-0.5 truncate shrink-0 ${
              changeType === 'increase' ? 'text-[#55E6C1]' :
              changeType === 'decrease' ? 'text-[#38BDF8]' :
              changeType === 'critical' ? 'text-[#F87171] font-semibold' : 'text-[#94A3B8]'
            }`}>
              {changeType === 'increase' && <ArrowUpRight className="w-3 h-3 shrink-0" />}
              {changeType === 'decrease' && <ArrowDownRight className="w-3 h-3 shrink-0" />}
              {changeType === 'neutral' && <Minus className="w-3 h-3 shrink-0" />}
              <span className="truncate">{change}</span>
            </div>
          )}
          {subtitle && <span className="text-[#94A3B8] truncate text-[10px] text-right">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
