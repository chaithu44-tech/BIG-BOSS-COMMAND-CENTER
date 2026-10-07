import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-md bg-[#0e1017] border ${
          isDanger ? 'border-red-600/70 shadow-[0_0_30px_rgba(220,38,38,0.35)]' : 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
        } rounded-xl p-6 overflow-hidden`}
      >
        {/* Ambient Top Glow Line */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 ${
            isDanger ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600' : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
          }`} 
        />

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg shrink-0 ${isDanger ? 'bg-red-950/80 text-red-400 border border-red-700/50' : 'bg-amber-950/80 text-amber-400 border border-amber-700/50'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white font-display">
              {title}
            </h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800/80">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-lg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg transition-all cursor-pointer shadow-lg ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 shadow-red-900/40 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
