import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { BarChart3, TrendingUp, ShieldAlert, Award, PieChart } from 'lucide-react';
import { Team } from '../../types';

export const HouseAnalyticsSection: React.FC = () => {
  const {
    activeContestants,
    activeContestantsCount,
    evictedContestantsCount,
    highestScorer,
    lowestScorer,
    averagePoints,
    completedTasksCount,
    pendingTasksCount,
    totalTasksCount,
    currentNominees,
    immuneContestants,
    houseCaptain,
    teamPoints,
  } = useHouse();

  // Find max team points for relative bar widths
  const maxTeamPoints = Math.max(...Object.values(teamPoints), 100);

  const teams: { name: Team; color: string; barBg: string }[] = [
    { name: 'Team Red', color: 'text-red-400', barBg: 'bg-red-600' },
    { name: 'Team Blue', color: 'text-blue-400', barBg: 'bg-blue-600' },
    { name: 'Team Gold', color: 'text-amber-400', barBg: 'bg-amber-500' },
    { name: 'Team Black', color: 'text-zinc-400', barBg: 'bg-zinc-500' },
  ];

  const topScorers = [...activeContestants]
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);

  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-700/50 text-red-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">
              COMPREHENSIVE HOUSE ANALYTICS
            </h3>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
              REAL-TIME AGGREGATES & METRICS
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 5 Stat Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            AVERAGE POINTS
          </span>
          <span className="text-xl font-black text-white font-mono mt-1 block">
            {averagePoints} <span className="text-xs text-neutral-500 font-normal">PTS</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            LOWEST SCORER
          </span>
          <span className="text-base font-bold text-neutral-200 truncate mt-1 block font-display">
            {lowestScorer ? `${lowestScorer.name} (${lowestScorer.points}p)` : '—'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            EVICTED CONTESTANTS
          </span>
          <span className="text-xl font-black text-red-400 font-mono mt-1 block">
            {evictedContestantsCount} <span className="text-xs text-neutral-500 font-normal">HISTORICAL</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            PENDING TASKS
          </span>
          <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
            {pendingTasksCount} <span className="text-xs text-neutral-500 font-normal">IN QUEUE</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            TASK COMPLETION RATE
          </span>
          <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
            {taskCompletionRate}%
          </span>
        </div>
      </div>

      {/* Two Column Visual Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-neutral-800/80">
        {/* Team Score Aggregates */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-display mb-3 flex items-center justify-between">
            <span>TEAM POINT DISTRIBUTION</span>
            <span className="text-[10px] font-mono text-neutral-500">AGGREGATED</span>
          </h4>

          <div className="space-y-3">
            {teams.map((t) => {
              const pts = teamPoints[t.name] || 0;
              const pct = maxTeamPoints > 0 ? Math.round((pts / maxTeamPoints) * 100) : 0;
              return (
                <div key={t.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-semibold ${t.color}`}>{t.name}</span>
                    <span className="font-mono font-bold text-white">{pts} PTS</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full ${t.barBg} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 4 Contestant Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-display mb-3 flex items-center justify-between">
            <span>TOP SCORING HOUSEMATES</span>
            <span className="text-[10px] font-mono text-neutral-500">INDIVIDUAL</span>
          </h4>

          <div className="space-y-2">
            {topScorers.map((c, i) => {
              const maxPts = topScorers[0]?.points || 1;
              const pct = Math.round((c.points / maxPts) * 100);
              return (
                <div key={c.id} className="p-2 rounded-lg bg-neutral-900/50 border border-neutral-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center font-mono text-neutral-400 font-bold">
                        #{i + 1}
                      </span>
                      <span className="font-bold text-white font-display">{c.name}</span>
                      <span className="text-[10px] text-neutral-400">({c.team})</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">{c.points} PTS</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
