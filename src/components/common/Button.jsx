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
    primary: 'bg-[#55E6C1] hover:bg-[#7EECD0] text-[#0B1220] font-semibold shadow-[0_0_12px_-2px_rgba(85,230,193,0.35)] hover:shadow-[0_0_16px_0px_rgba(85,230,193,0.5)] focus:ring-[#55E6C1] border border-[#55E6C1]',
    secondary: 'bg-[#1B293B] hover:bg-[#202E42] text-[#F8FAFC] border border-[#263449] hover:border-[#38BDF8]/50 focus:ring-[#38BDF8]',
    outline: 'bg-transparent hover:bg-[#55E6C1]/10 text-[#55E6C1] border border-[#55E6C1]/50 hover:border-[#55E6C1] focus:ring-[#55E6C1]',
    danger: 'bg-[#F87171] hover:bg-[#EF4444] text-[#0B1220] font-semibold shadow-[0_0_12px_-2px_rgba(248,113,113,0.35)] focus:ring-[#F87171] border border-[#F87171]',
    warning: 'bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0B1220] font-semibold shadow-[0_0_12px_-2px_rgba(251,191,36,0.35)] focus:ring-[#FBBF24] border border-[#FBBF24]',
    ghost: 'bg-transparent hover:bg-[#1B293B]/70 text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent focus:ring-[#263449]'
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
