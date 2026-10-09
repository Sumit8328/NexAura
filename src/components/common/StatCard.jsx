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
    cyan: 'border-cyan-500/30 hover:border-cyan-500/60',
    red: 'border-rose-500/40 hover:border-rose-500/70 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]',
    amber: 'border-amber-500/40 hover:border-amber-500/70',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/60',
    slate: 'border-midnight-700/80 hover:border-slate-600'
  };

  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    slate: 'text-slate-400 bg-slate-800 border-slate-700'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative bg-midnight-900/80 backdrop-blur-md rounded-lg p-4 border transition-all duration-200 group ${borderColors[variant]} ${
        onClick ? 'cursor-pointer hover:bg-midnight-850' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{value}</span>
            {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2 rounded-md border ${iconColors[variant]} shrink-0 transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-midnight-800 flex items-center justify-between text-xs font-mono">
          {change && (
            <div className={`flex items-center gap-1 ${
              changeType === 'increase' ? 'text-emerald-400' :
              changeType === 'decrease' ? 'text-rose-400' :
              changeType === 'critical' ? 'text-rose-400 font-semibold' : 'text-slate-400'
            }`}>
              {changeType === 'increase' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'decrease' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </div>
          )}
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
