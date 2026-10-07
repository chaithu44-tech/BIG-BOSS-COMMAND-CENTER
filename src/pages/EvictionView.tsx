import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { EvictionHistoryTable } from '../components/dashboard/EvictionHistoryTable';
import { Contestant } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { getTeamBadgeColor } from '../utils/helpers';
import { UserX, AlertTriangle, Skull, Shield, CheckCircle2 } from 'lucide-react';

export const EvictionView: React.FC = () => {
  const { currentNominees, activeContestants, evictContestant } = useHouse();
  const [selectedForEviction, setSelectedForEviction] = useState<Contestant | null>(null);
  const [directEvictId, setDirectEvictId] = useState<string>(activeContestants[0]?.id || '');

  const handleConfirm = () => {
    if (selectedForEviction) {
      evictContestant(selectedForEviction.id, 'Public Vote Eviction Protocol');
      setSelectedForEviction(null);
    }
  };

  const handleDirectEvictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = activeContestants.find((c) => c.id === directEvictId);
    if (target) {
      setSelectedForEviction(target);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <UserX className="w-6 h-6 text-red-600" />
            <span>EVICTION CHAMBER</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Execute final expulsions and review the official eviction archive. Expelled contestants are barred from scoring.
          </p>
        </div>

        {/* Direct Eviction Order Trigger */}
        {activeContestants.length > 0 && (
          <form onSubmit={handleDirectEvictSubmit} className="flex items-center gap-2">
            <select
              value={directEvictId}
              onChange={(e) => setDirectEvictId(e.target.value)}
              className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-semibold text-white focus:border-red-500 outline-none"
            >
              {activeContestants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.team}) {c.isNominated ? '⚠ NOMINATED' : ''}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>ORDER EVICTION</span>
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone Candidates Facing Immediate Eviction */}
      <div className="rounded-xl border border-red-600/50 bg-[#0d090d]/90 p-5 shadow-[0_0_25px_rgba(220,38,38,0.2)]">
        <div className="flex items-center justify-between pb-3 border-b border-red-900/40 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-base font-bold tracking-wider uppercase text-red-400 font-display">
              ACTIVE NOMINEES FACING ELIMINATION ({currentNominees.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {currentNominees.length === 0 ? 'STATUS: SAFE' : 'STATUS: CRITICAL'}
          </span>
        </div>

        {currentNominees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentNominees.map((c) => {
              const teamBadge = getTeamBadgeColor(c.team);
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-red-950/20 border border-red-800/60 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0 border border-white/10"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-display">
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                          >
                            {c.team}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-300">
                            {c.points} PTS
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      NOMINATED
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedForEviction(c)}
                    className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    <span>CONFIRM EVICTION OF {c.name.toUpperCase()}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-400 bg-emerald-950/10 rounded-lg border border-emerald-900/30">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
            No active housemates are nominated for eviction right now.
          </div>
        )}
      </div>

      {/* Eviction History Archive */}
      <EvictionHistoryTable />

      {/* Eviction Confirmation Modal */}
      <ConfirmModal
        isOpen={!!selectedForEviction}
        title="EXECUTE IMMEDIATE EVICTION"
        message={`Are you sure you want to evict ${selectedForEviction?.name}? They will immediately be stripped of active status, expelled from the House, removed from the leaderboard, and permanently archived into Eviction History.`}
        confirmLabel="CONFIRM EVICTION"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setSelectedForEviction(null)}
      />
    </div>
  );
};
