import React from 'react';
import { AlertCircle, Cpu, WifiOff } from 'lucide-react';

export const DataDisclaimerBanner = ({ 
  mode = 'prototype', // 'prototype' | 'offline' | 'simulation' | 'methodology'
  customText = null,
  compact = false 
}) => {
  const content = {
    prototype: {
      icon: Cpu,
      title: 'LOCAL PROTOTYPE DATASET ACTIVE',
      desc: 'Displaying high-fidelity illustrative logistics telemetry. Backend decoupled for standalone evaluation; API contract prepared for Python FastAPI & Antigravity integration.',
      border: 'border-[#55E6C1]/30',
      bg: 'bg-[#141F30]/80',
      text: 'text-[#55E6C1]',
      iconColor: 'text-[#55E6C1]'
    },
    simulation: {
      icon: AlertCircle,
      title: 'CLIENT-SIDE ILLUSTRATIVE SIMULATION',
      desc: 'Heuristic scenario model executing locally. Calculations represent synthetic operational estimates rather than live neural network weights or physical GPS telemetry.',
      border: 'border-[#38BDF8]/30',
      bg: 'bg-[#141F30]/80',
      text: 'text-[#38BDF8]',
      iconColor: 'text-[#38BDF8]'
    },
    offline: {
      icon: WifiOff,
      title: 'OFFLINE BUFFER ENGAGED',
      desc: 'Transactions queued locally in client storage. Events will stage for reconciliation upon backend connectivity resumption.',
      border: 'border-[#F87171]/30',
      bg: 'bg-[#141F30]/80',
      text: 'text-[#F87171]',
      iconColor: 'text-[#F87171]'
    }
  };

  const active = content[mode] || content.prototype;
  const Icon = active.icon;

  if (compact) {
    return (
      <div className={`px-3 py-1.5 rounded-md border ${active.border} ${active.bg} flex items-center gap-2 text-xs font-mono ${active.text}`}>
        <Icon className={`w-3.5 h-3.5 shrink-0 ${active.iconColor}`} />
        <span className="truncate">{customText || active.title}: {active.desc}</span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-lg border ${active.border} ${active.bg} flex items-start gap-3 text-xs font-mono ${active.text} shadow-sm backdrop-blur-sm`}>
      <div className={`p-1 rounded bg-black/40 border ${active.border} shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${active.iconColor}`} />
      </div>
      <div>
        <p className="font-semibold tracking-wide uppercase">{active.title}</p>
        <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
          {customText || active.desc}
        </p>
      </div>
    </div>
  );
};

export default DataDisclaimerBanner;
