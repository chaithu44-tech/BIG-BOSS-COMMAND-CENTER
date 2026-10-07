import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHouse();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-blue-500/50';
        let bgColor = 'bg-[#0f111a]/95';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          borderColor = 'border-emerald-500/50';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderColor = 'border-amber-500/50';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'error') {
          borderColor = 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
          icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-right`}
          >
            {icon}
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs font-bold tracking-wider uppercase text-neutral-200">
                {toast.title}
              </div>
              <div className="text-xs text-neutral-300 mt-0.5 break-words">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
