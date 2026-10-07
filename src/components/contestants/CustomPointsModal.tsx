import React, { useState, useEffect } from 'react';
import { Contestant } from '../../types';
import { X, Flame, Plus, Minus, Check } from 'lucide-react';
import { useHouse } from '../../context/HouseContext';

interface CustomPointsModalProps {
  contestant: Contestant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, amount: number) => void;
}

export const CustomPointsModal: React.FC<CustomPointsModalProps> = ({
  contestant,
  isOpen,
  onClose,
  onSave,
}) => {
  const { addPoints, deductPoints, setCustomPoints } = useHouse();

  const [mode, setMode] = useState<'adjust' | 'exact'>('adjust');
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [exactScore, setExactScore] = useState<number>(0);

  useEffect(() => {
    if (contestant) {
      setExactScore(contestant.points);
      setAdjustAmount(50);
    }
  }, [contestant]);

  if (!isOpen || !contestant) return null;

  const handleAdd = () => {
    if (adjustAmount > 0) {
      addPoints(contestant.id, adjustAmount);
      onClose();
    }
  };

  const handleDeduct = () => {
    if (adjustAmount > 0) {
      deductPoints(contestant.id, adjustAmount);
      onClose();
    }
  };

  const handleSetExact = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(contestant.id, exactScore);
    } else {
      setCustomPoints(contestant.id, exactScore);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e1017] border border-amber-500/50 rounded-xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">
              MANUAL POINT MANAGEMENT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contestant Info Header */}
        <div className="mt-4 p-3 rounded-lg bg-black/60 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              CONTESTANT
            </span>
            <span className="text-base font-bold text-white font-display">
              {contestant.name} ({contestant.team})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              CURRENT SCORE
            </span>
            <span className="text-base font-mono font-bold text-amber-400">
              {contestant.points} PTS
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-lg bg-black border border-neutral-800">
          <button
            type="button"
            onClick={() => setMode('adjust')}
            className={`py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'adjust'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ± Add / Deduct
          </button>
          <button
            type="button"
            onClick={() => setMode('exact')}
            className={`py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'exact'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Exact Score
          </button>
        </div>

        {mode === 'adjust' ? (
          /* Add / Deduct Mode */
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                POINTS TO ADD OR DEDUCT
              </label>
              <input
                type="number"
                min="1"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white font-mono text-lg focus:border-amber-500 outline-none"
                placeholder="Enter points (e.g. 50)"
                autoFocus
              />
            </div>

            {/* Quick preset buttons for common amounts */}
            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 75, 150].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAdjustAmount(amt)}
                  className="py-1 text-xs font-mono font-bold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded cursor-pointer transition-colors"
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Primary Action Buttons: ADD or DEDUCT */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADD {adjustAmount} PTS</span>
              </button>

              <button
                type="button"
                onClick={handleDeduct}
                className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Minus className="w-4 h-4" />
                <span>- DEDUCT {adjustAmount} PTS</span>
              </button>
            </div>
          </div>
        ) : (
          /* Exact Score Mode */
          <form onSubmit={handleSetExact} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                EXACT TOTAL POINTS
              </label>
              <input
                type="number"
                value={exactScore}
                onChange={(e) => setExactScore(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white font-mono text-lg focus:border-amber-500 outline-none"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>SET EXACT SCORE</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
