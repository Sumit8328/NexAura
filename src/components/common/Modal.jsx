import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0B1220]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} bg-[#141F30] border border-[#263449] rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150`}>
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#55E6C1]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#55E6C1]" />
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#263449] flex items-center justify-between bg-[#1B293B]/70">
          <div>
            <h3 className="text-base font-semibold text-[#F8FAFC] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#55E6C1] animate-pulse" />
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#1B293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
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
  );
};

export default Modal;
