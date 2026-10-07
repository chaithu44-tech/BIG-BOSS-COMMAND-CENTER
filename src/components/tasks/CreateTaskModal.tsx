import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Team } from '../../types';
import { CheckSquare, X } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTask, activeContestants } = useHouse();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedType, setAssignedType] = useState<'individual' | 'team'>('individual');
  const [assignedIndividualId, setAssignedIndividualId] = useState(
    activeContestants[0]?.id || ''
  );
  const [assignedTeam, setAssignedTeam] = useState<Team>('Team Red');
  const [pointReward, setPointReward] = useState<number>(100);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetId = '';
    let targetName = '';

    if (assignedType === 'individual') {
      const contestant = activeContestants.find((c) => c.id === assignedIndividualId);
      targetId = assignedIndividualId;
      targetName = contestant ? contestant.name : 'Unknown';
    } else {
      targetId = assignedTeam;
      targetName = assignedTeam;
    }

    createTask(
      title.trim(),
      description.trim(),
      assignedType,
      targetId,
      targetName,
      pointReward,
      durationMinutes
    );

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e1017] border border-emerald-600/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">
              CREATE HOUSE CHALLENGE
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
              TASK NAME *
            </label>
            <input
              type="text"
              placeholder="e.g. Endurance Buzzer Challenge..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-emerald-500 outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              placeholder="Detailed rules and objective for the housemates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs sm:text-sm focus:border-emerald-500 outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                ASSIGN TARGET
              </label>
              <select
                value={assignedType}
                onChange={(e) => setAssignedType(e.target.value as 'individual' | 'team')}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
              >
                <option value="individual">Individual Contestant</option>
                <option value="team">Full Team</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                {assignedType === 'individual' ? 'SELECT CONTESTANT' : 'SELECT TEAM'}
              </label>
              {assignedType === 'individual' ? (
                <select
                  value={assignedIndividualId}
                  onChange={(e) => setAssignedIndividualId(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.team})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value as Team)}
                  className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
                >
                  <option value="Team Red">Team Red</option>
                  <option value="Team Blue">Team Blue</option>
                  <option value="Team Gold">Team Gold</option>
                  <option value="Team Black">Team Black</option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                POINT REWARD
              </label>
              <input
                type="number"
                min="0"
                value={pointReward}
                onChange={(e) => setPointReward(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm font-mono focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                DURATION (MINS)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm font-mono focus:border-emerald-500 outline-none"
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
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md cursor-pointer"
            >
              CREATE TASK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
