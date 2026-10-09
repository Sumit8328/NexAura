import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4500, action = null }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = { id, title, message, type, action };

    setToasts(prev => [toast, ...prev.slice(0, 4)]); // max 5

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = (title, message) => addToast({ title, message, type: 'success' });
  const error = (title, message) => addToast({ title, message, type: 'error', duration: 6000 });
  const warning = (title, message) => addToast({ title, message, type: 'warning' });
  const info = (title, message) => addToast({ title, message, type: 'info' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Render Viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const typeConfig = {
            success: {
              icon: CheckCircle2,
              border: 'border-emerald-500/50',
              bg: 'bg-midnight-900/95',
              textColor: 'text-emerald-400',
              glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
            },
            error: {
              icon: AlertCircle,
              border: 'border-rose-500/50',
              bg: 'bg-midnight-900/95',
              textColor: 'text-rose-400',
              glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]'
            },
            warning: {
              icon: AlertTriangle,
              border: 'border-amber-500/50',
              bg: 'bg-midnight-900/95',
              textColor: 'text-amber-400',
              glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
            },
            info: {
              icon: Info,
              border: 'border-cyan-500/50',
              bg: 'bg-midnight-900/95',
              textColor: 'text-cyan-400',
              glow: 'shadow-[0_0_15px_-3px_rgba(0,240,255,0.25)]'
            }
          }[toast.type] || {
            icon: Info,
            border: 'border-slate-700',
            bg: 'bg-midnight-900',
            textColor: 'text-slate-300',
            glow: ''
          };

          const Icon = typeConfig.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-lg border ${typeConfig.border} ${typeConfig.bg} backdrop-blur-md ${typeConfig.glow} shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-150`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${typeConfig.textColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 leading-snug">{toast.title}</p>
                {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action.onClick();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
