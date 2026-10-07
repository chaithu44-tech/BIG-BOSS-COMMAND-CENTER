import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Contestant } from '../../types';
import { getTeamBadgeColor } from '../../utils/helpers';
import { Trophy, Crown, ShieldCheck, AlertTriangle, Plus, Minus, ArrowUp, ArrowDown, Sliders } from 'lucide-react';
import { CustomPointsModal } from '../contestants/CustomPointsModal';

interface LeaderboardTableProps {
  compact?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ compact = false }) => {
  const { activeContestants, addPoints, deductPoints } = useHouse();
  const [selectedContestantForPoints, setSelectedContestantForPoints] = useState<Contestant | null>(null);

  // Sort active contestants by points descending
  const sortedContestants = [...activeContestants].sort((a, b) => b.points - a.points);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/60 font-black text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/60 font-black text-xs font-mono">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/60 font-black text-xs font-mono">
          3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900 text-neutral-400 font-mono text-xs">
        {rank}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">
              LIVE HOUSE LEADERBOARD
            </h3>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
              OFFICIAL ACTIVE STANDINGS ({sortedContestants.length} CONTESTANTS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            REAL-TIME SORT
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800/80 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
              <th className="py-2.5 px-3">RANK</th>
              <th className="py-2.5 px-3">CONTESTANT</th>
              <th className="py-2.5 px-3">TEAM</th>
              <th className="py-2.5 px-3 text-right">POINTS</th>
              <th className="py-2.5 px-3 text-center">TASKS</th>
              <th className="py-2.5 px-3">STATUS</th>
              {!compact && <th className="py-2.5 px-3 text-right">QUICK ADJUST</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40 text-xs">
            {sortedContestants.length > 0 ? (
              sortedContestants.map((contestant, index) => {
                const rank = index + 1;
                const teamBadge = getTeamBadgeColor(contestant.team);
                const isTop3 = rank <= 3;

                return (
                  <tr
                    key={contestant.id}
                    className={`transition-colors hover:bg-neutral-800/30 ${
                      rank === 1
                        ? 'bg-amber-950/15'
                        : rank === 2
                        ? 'bg-slate-900/20'
                        : rank === 3
                        ? 'bg-amber-950/10'
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 shrink-0">
                      <div className="flex items-center gap-2">
                        {getRankBadge(rank)}
                      </div>
                    </td>

                    {/* Contestant */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-white text-xs shrink-0"
                          style={{ backgroundColor: contestant.avatarColor }}
                        >
                          {contestant.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white font-display text-sm tracking-wide flex items-center gap-1.5">
                            <span>{contestant.name}</span>
                            {contestant.isCaptain && (
                              <span title="Captain">
                                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              </span>
                            )}
                            {contestant.isImmune && (
                              <span title="Immune">
                                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                              </span>
                            )}
                            {contestant.isNominated && (
                              <span title="Nominated">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                      >
                        {contestant.team}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
                        {contestant.points}
                      </span>
                      <span className="text-[10px] text-neutral-400 ml-1">PTS</span>
                    </td>

                    {/* Tasks */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono text-neutral-300">
                        {contestant.tasksCompleted}
                      </span>
                    </td>

                    {/* Status Badges */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {contestant.isCaptain && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            CAPTAIN
                          </span>
                        )}
                        {contestant.isImmune && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            IMMUNE
                          </span>
                        )}
                        {contestant.isNominated && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white animate-pulse">
                            NOMINATED
                          </span>
                        )}
                        {!contestant.isCaptain && !contestant.isImmune && !contestant.isNominated && (
                          <span className="text-neutral-400 text-[11px]">Safe</span>
                        )}
                      </div>
                    </td>

                    {/* Quick Adjust Buttons */}
                    {!compact && (
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => addPoints(contestant.id, 25)}
                            className="p-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 cursor-pointer"
                            title="Add +25 points"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deductPoints(contestant.id, 25)}
                            className="p-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 cursor-pointer"
                            title="Deduct -25 points"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setSelectedContestantForPoints(contestant)}
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-amber-400 cursor-pointer ml-1"
                            title="Manually enter points to add or deduct"
                          >
                            <Sliders className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500 text-xs">
                  No active contestants inside the house.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Points Add / Deduct Modal */}
      <CustomPointsModal
        contestant={selectedContestantForPoints}
        isOpen={!!selectedContestantForPoints}
        onClose={() => setSelectedContestantForPoints(null)}
      />
    </div>
  );
};
