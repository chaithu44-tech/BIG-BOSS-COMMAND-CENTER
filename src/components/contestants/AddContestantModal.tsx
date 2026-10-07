import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Team, ContestantStatus } from '../../types';
import { UserPlus, X } from 'lucide-react';

interface AddContestantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddContestantModal: React.FC<AddContestantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addContestant } = useHouse();
  const [name, setName] = useState('');
  const [team, setTeam] = useState<Team>('Team Red');
  const [points, setPoints] = useState<number>(0);
  const [status, setStatus] = useState<ContestantStatus>('Active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const success = addContestant(name.trim(), team, points, status);
    if (success) {
      setName('');
      setPoints(0);
      setStatus('Active');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e1017] border border-red-600/50 rounded-xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.25)]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-700/50 text-red-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">
              ADD NEW CONTESTANT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              CONTESTANT NAME *
            </label>
            <input
              type="text"
              placeholder="e.g. Siddharth, Pooja, Kabir..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                TEAM
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value as Team)}
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
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm font-mono focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              STATUS
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContestantStatus)}
              className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Evicted">Evicted</option>
            </select>
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
              ADD CONTESTANT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
