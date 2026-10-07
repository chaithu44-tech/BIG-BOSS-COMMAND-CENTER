import React from 'react';
import { useHouse } from '../context/HouseContext';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { HouseAnalyticsSection } from '../components/dashboard/HouseAnalyticsSection';
import { Trophy, Crown, Flame, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { highestScorer, activeContestants } = useHouse();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>OFFICIAL LEADERBOARD</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dynamic scoring hierarchy. Point adjustments reflect instantly across the rankings.
          </p>
        </div>

        {highestScorer && (
          <div className="px-4 py-2 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                CURRENT LEADER
              </span>
              <span className="text-sm font-bold text-white font-display">
                {highestScorer.name} — {highestScorer.points} PTS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Leaderboard Table */}
      <LeaderboardTable compact={false} />

      {/* Analytics breakdown */}
      <HouseAnalyticsSection />
    </div>
  );
};
