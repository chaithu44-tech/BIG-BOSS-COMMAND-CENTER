import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Team } from '../../types';
import { FileUp, X } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { bulkImportContestants } = useHouse();
  const [rawText, setRawText] = useState('');
  const [defaultTeam, setDefaultTeam] = useState<Team>('Team Red');
  const [startingPoints, setStartingPoints] = useState<number>(0);

  if (!isOpen) return null;

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    const count = bulkImportContestants(rawText, defaultTeam, startingPoints);
    if (count > 0) {
      setRawText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-red-600/50 rounded-xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.25)]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-700/50 text-red-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">
                IMPORT CONTESTANTS (BULK)
              </h3>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                ONE NAME PER LINE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleImport} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              CONTESTANT NAMES LIST
            </label>
            <textarea
              rows={6}
              placeholder={`Rahul\nPriya\nArjun\nSneha\nVikram\nAnanya`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white font-mono text-xs sm:text-sm focus:border-red-500 outline-none leading-relaxed"
              required
              autoFocus
            />
            <span className="text-[11px] text-neutral-500 block mt-1">
              Empty lines will be ignored. Existing names will be preserved.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                DEFAULT TEAM
              </label>
              <select
                value={defaultTeam}
                onChange={(e) => setDefaultTeam(e.target.value as Team)}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs sm:text-sm focus:border-red-500 outline-none"
              >
                <option value="Team Red">Team Red</option>
                <option value="Team Blue">Team Blue</option>
                <option value="Team Gold">Team Gold</option>
                <option value="Team Black">Team Black</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                STARTING POINTS
              </label>
              <input
                type="number"
                value={startingPoints}
                onChange={(e) => setStartingPoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm font-mono focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase text-neutral-400 hover:text-white cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              IMPORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
