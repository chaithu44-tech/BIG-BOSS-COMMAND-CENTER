import React, { useState } from 'react';
import { Contestant } from '../../types';
import { useHouse } from '../../context/HouseContext';
import { getTeamBadgeColor } from '../../utils/helpers';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Crown,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Edit,
  Trash2,
  UserX,
  Plus,
  Minus,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface ContestantCardProps {
  contestant: Contestant;
  onEdit: (contestant: Contestant) => void;
  onOpenCustomPoints: (contestant: Contestant) => void;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  onEdit,
  onOpenCustomPoints,
}) => {
  const {
    addPoints,
    deductPoints,
    nominateContestant,
    removeNomination,
    grantImmunity,
    removeImmunity,
    setCaptain,
    evictContestant,
    deleteContestant,
  } = useHouse();

  const [showEvictModal, setShowEvictModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [manualInput, setManualInput] = useState<string>('');

  const handleManualAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(manualInput, 10);
    if (!isNaN(val) && val > 0) {
      addPoints(contestant.id, val);
      setManualInput('');
    }
  };

  const handleManualDeduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(manualInput, 10);
    if (!isNaN(val) && val > 0) {
      deductPoints(contestant.id, val);
      setManualInput('');
    }
  };

  const teamBadge = getTeamBadgeColor(contestant.team);
  const isEvicted = contestant.isEvicted || contestant.status === 'Evicted';

  return (
    <>
      <div
        className={`rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
          contestant.isCaptain
            ? 'bg-[#121008] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            : contestant.isNominated
            ? 'bg-[#14080a] border-red-600/70 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
            : contestant.isImmune
            ? 'bg-[#081215] border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            : isEvicted
            ? 'bg-[#0a0a0c] border-neutral-800 opacity-60'
            : 'bg-[#0e1017] border-neutral-800/80 hover:border-neutral-700'
        } p-4`}
      >
        {/* Top Status Accent Bar */}
        {contestant.isCaptain && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
        )}
        {contestant.isNominated && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />
        )}
        {contestant.isImmune && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-300 to-cyan-500" />
        )}

        {/* Card Header: Avatar, Name, Badges */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-md shrink-0 border border-white/10"
                style={{ backgroundColor: contestant.avatarColor }}
              >
                {contestant.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white tracking-wide truncate font-display">
                    {contestant.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                  >
                    {contestant.team}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {contestant.tasksCompleted} Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Badges */}
            <div className="flex flex-col items-end gap-1">
              {contestant.isCaptain && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  CAPTAIN
                </span>
              )}
              {contestant.isImmune && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-cyan-950/70 text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  IMMUNE
                </span>
              )}
              {contestant.isNominated && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-600 text-white flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  DANGER
                </span>
              )}
              {isEvicted && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700">
                  EVICTED
                </span>
              )}
            </div>
          </div>

          {/* Points Display */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-neutral-800/80 mb-3">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              SCORE
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white font-mono tracking-tight">
                {contestant.points}
              </span>
              <span className="text-xs font-semibold text-neutral-400">PTS</span>
              {!isEvicted && (
                <button
                  onClick={() => onOpenCustomPoints(contestant)}
                  className="p-1 text-neutral-400 hover:text-amber-400 transition-colors ml-1 cursor-pointer"
                  title="Set exact custom points"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Point Adjust Buttons */}
          {!isEvicted && (
            <div className="space-y-2 mb-3">
              {/* Manual Direct Point Input Form */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
                <input
                  type="number"
                  min="1"
                  placeholder="Manual pts (e.g. 75)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualAdd();
                  }}
                  className="w-full min-w-0 px-2 py-1 bg-black border border-neutral-700/80 rounded text-xs font-mono text-white placeholder-neutral-500 focus:border-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleManualAdd}
                  disabled={!manualInput}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase tracking-wider shrink-0 cursor-pointer shadow-sm transition-all"
                  title="Add custom points"
                >
                  + ADD
                </button>
                <button
                  type="button"
                  onClick={handleManualDeduct}
                  disabled={!manualInput}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase tracking-wider shrink-0 cursor-pointer shadow-sm transition-all"
                  title="Deduct custom points"
                >
                  - DEDUCT
                </button>
              </div>

              {/* Quick Presets Grid */}
              <div className="grid grid-cols-4 gap-1">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={`plus-${amt}`}
                    onClick={() => addPoints(contestant.id, amt)}
                    className="py-1 px-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 hover:border-emerald-600/60 text-emerald-300 text-[11px] font-bold font-mono rounded transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    {amt}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={`minus-${amt}`}
                    onClick={() => deductPoints(contestant.id, amt)}
                    className="py-1 px-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600/60 text-red-300 text-[11px] font-bold font-mono rounded transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <Minus className="w-2.5 h-2.5" />
                    {amt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Status Controls */}
        <div className="pt-2.5 border-t border-neutral-800/80 space-y-2">
          {!isEvicted && (
            <div className="grid grid-cols-3 gap-1.5">
              {/* Nominate / Remove Nomination */}
              {contestant.isNominated ? (
                <button
                  onClick={() => removeNomination(contestant.id)}
                  className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  CLEAR NOM
                </button>
              ) : (
                <button
                  onClick={() => nominateContestant(contestant.id)}
                  className="py-1.5 px-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-[10px] font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  NOMINATE
                </button>
              )}

              {/* Immunity Toggle */}
              {contestant.isImmune ? (
                <button
                  onClick={() => removeImmunity(contestant.id)}
                  className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  REVOKE IMM
                </button>
              ) : (
                <button
                  onClick={() => grantImmunity(contestant.id)}
                  className="py-1.5 px-2 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-[10px] font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  IMMUNITY
                </button>
              )}

              {/* Captaincy */}
              <button
                onClick={() => setCaptain(contestant.id)}
                disabled={contestant.isCaptain}
                className={`py-1.5 px-2 text-[10px] font-bold uppercase rounded cursor-pointer transition-colors ${
                  contestant.isCaptain
                    ? 'bg-amber-950/80 border border-amber-600/60 text-amber-300 opacity-80 cursor-default'
                    : 'bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300'
                }`}
              >
                {contestant.isCaptain ? 'CAPTAIN' : 'MAKE CAPT'}
              </button>
            </div>
          )}

          {/* Secondary Actions: Edit, Evict, Delete */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => onEdit(contestant)}
              className="flex-1 py-1.5 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              <span>EDIT</span>
            </button>

            {!isEvicted && (
              <button
                onClick={() => setShowEvictModal(true)}
                className="py-1.5 px-2.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Evict contestant from house"
              >
                <UserX className="w-3 h-3" />
                <span>EVICT</span>
              </button>
            )}

            {!isEvicted && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 rounded bg-neutral-900 hover:bg-red-950/50 border border-neutral-800 hover:border-red-800/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete contestant"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Eviction Confirmation Modal */}
      <ConfirmModal
        isOpen={showEvictModal}
        title="CONFIRM CONTESTANT EVICTION"
        message={`Are you sure you want to evict ${contestant.name}? This will remove them from the active House and leaderboard, and log them into Eviction History.`}
        confirmLabel="CONFIRM EVICTION"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={() => {
          evictContestant(contestant.id, 'Big Boss Direct Order');
          setShowEvictModal(false);
        }}
        onCancel={() => setShowEvictModal(false)}
      />

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="DELETE CONTESTANT"
        message={`Are you sure you want to delete this contestant (${contestant.name})? This action removes their profile entirely.`}
        confirmLabel="DELETE"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={() => {
          deleteContestant(contestant.id);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};
