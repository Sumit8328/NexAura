import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = 'max-w-md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-[#0B1220]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`w-screen ${width} bg-[#141F30] border-l border-[#263449] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200`}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#263449] bg-[#1B293B]/70 flex items-center justify-between">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F8FAFC] truncate">{title}</h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-[#94A3B8] font-mono mt-1 truncate">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#1B293B] transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 px-6 py-5 overflow-y-auto space-y-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-[#263449] bg-[#1B293B]/50 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
