import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-midnight-950 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-mono',
    md: 'text-sm px-3.5 py-2 gap-2 font-mono',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-sans'
  };

  const variantClasses = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-midnight-950 font-semibold shadow-[0_0_15px_-3px_rgba(0,240,255,0.4)] hover:shadow-[0_0_20px_0px_rgba(0,240,255,0.6)] focus:ring-cyan-400 border border-cyan-400',
    secondary: 'bg-midnight-800 hover:bg-midnight-750 text-slate-200 border border-midnight-700 hover:border-slate-500 focus:ring-slate-500',
    outline: 'bg-transparent hover:bg-cyan-950/30 text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 focus:ring-cyan-400',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)] focus:ring-rose-400 border border-rose-500',
    warning: 'bg-amber-500 hover:bg-amber-400 text-midnight-950 font-semibold shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] focus:ring-amber-400 border border-amber-400',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent focus:ring-slate-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
