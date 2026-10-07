import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Contestant } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { getTeamBadgeColor } from '../../utils/helpers';
import { AlertTriangle, UserX, Shield, Skull } from 'lucide-react';

export const DangerZoneWidget: React.FC = () => {
  const { currentNominees, evictContestant, setActiveTab } = useHouse();
  const [selectedForEviction, setSelectedForEviction] = useState<Contestant | null>(null);

  const handleConfirmEviction = () => {
    if (selectedForEviction) {
      evictContestant(selectedForEviction.id, 'Danger Zone Public Elimination');
      setSelectedForEviction(null);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-red-600/60 bg-[#0d090d]/90 p-5 shadow-[0_0_25px_rgba(220,38,38,0.25)] relative overflow-hidden backdrop-blur-md flex flex-col h-full">
        {/* Glowing Top Danger Banner */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

        <div className="flex items-center justify-between pb-3 border-b border-red-900/40 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/80 text-red-400 border border-red-600/50 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wider uppercase text-red-400 font-display flex items-center gap-2">
                <span>⚠ DANGER ZONE</span>
              </h3>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
                CONTESTANTS FACING EVICTION ({currentNominees.length})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('nominations')}
            className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            MANAGE →
          </button>
        </div>

        {/* Content list or clear state */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {currentNominees.length > 0 ? (
            currentNominees.map((contestant) => {
              const teamBadge = getTeamBadgeColor(contestant.team);
              return (
                <div
                  key={contestant.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-red-950/20 border border-red-900/50 hover:border-red-600/60 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-md shrink-0 border border-white/10"
                      style={{ backgroundColor: contestant.avatarColor }}
                    >
                      {contestant.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate font-display tracking-wide">
                          {contestant.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                        >
                          {contestant.team}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span className="font-mono text-neutral-200">
                          {contestant.points} PTS
                        </span>
                        <span className="text-red-400 text-[11px] font-semibold flex items-center gap-1">
                          <Skull className="w-3 h-3 text-red-500" />
                          Nominated
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedForEviction(contestant)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_12px_rgba(220,38,38,0.5)] shrink-0 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>EVICT</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-6 text-center rounded-lg bg-emerald-950/10 border border-emerald-900/30">
              <Shield className="w-8 h-8 text-emerald-400 mb-2 opacity-80" />
              <div className="text-sm font-bold tracking-widest text-emerald-400 uppercase font-display">
                THE DANGER ZONE IS CLEAR
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                No contestants are currently nominated for eviction. House is stable.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Eviction Confirmation Modal */}
      <ConfirmModal
        isOpen={!!selectedForEviction}
        title="CONFIRM CONTESTANT EVICTION"
        message={`Are you sure you want to evict ${selectedForEviction?.name}? This contestant will immediately be stripped of status and removed from the active House and leaderboard.`}
        confirmLabel="CONFIRM EVICTION"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={handleConfirmEviction}
        onCancel={() => setSelectedForEviction(null)}
      />
    </>
  );
};
