import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Download, 
  Flame,
  Zap,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';
import { Team } from '../types';
import { getTeamBadgeColor } from '../utils/helpers';

export const PerformanceAnalyticsView: React.FC = () => {
  const {
    activeContestants,
    evictedContestants,
    tasks,
    teamPoints,
    completedTasksCount,
    totalTasksCount,
    averagePoints,
    highestScorer,
    currentNominees,
    currentRole,
    rolesConfig,
  } = useHouse();

  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [metricSort, setMetricSort] = useState<'efficiency' | 'points' | 'tasks'>('efficiency');

  // Filtered contestants
  const filteredContestants = activeContestants.filter(
    (c) => selectedTeam === 'ALL' || c.team === selectedTeam
  );

  // Compute performance metrics
  const totalActivePoints = activeContestants.reduce((sum, c) => sum + c.points, 0);
  const maxPossiblePoints = highestScorer ? highestScorer.points : 100;

  // Calculate efficiency score: (points / maxPoints * 50) + (tasksCompleted * 15) + (isImmune ? 10 : 0) - (isNominated ? 15 : 0)
  const contestantMetrics = filteredContestants.map((c) => {
    const scoreRatio = maxPossiblePoints > 0 ? (c.points / maxPossiblePoints) * 50 : 0;
    const taskBonus = Math.min(c.tasksCompleted * 12, 35);
    const immunityBonus = c.isImmune ? 10 : 0;
    const nominationPenalty = c.isNominated ? 12 : 0;
    const rawEfficiency = Math.round(scoreRatio + taskBonus + immunityBonus - nominationPenalty);
    const efficiency = Math.max(5, Math.min(99, rawEfficiency));

    // Survival risk index (0% safe, 100% extreme danger)
    let riskIndex = 15;
    if (c.isNominated) riskIndex += 55;
    if (c.points < averagePoints) riskIndex += 20;
    if (c.isImmune || c.isCaptain) riskIndex = 0;

    return {
      ...c,
      efficiency,
      riskIndex,
    };
  });

  // Sort metrics
  const sortedMetrics = [...contestantMetrics].sort((a, b) => {
    if (metricSort === 'efficiency') return b.efficiency - a.efficiency;
    if (metricSort === 'points') return b.points - a.points;
    return b.tasksCompleted - a.tasksCompleted;
  });

  // Team summary data
  const teams: { name: Team; color: string; bg: string; border: string }[] = [
    { name: 'Team Red', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-600/40' },
    { name: 'Team Blue', color: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-600/40' },
    { name: 'Team Gold', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/40' },
    { name: 'Team Black', color: 'text-zinc-400', bg: 'bg-zinc-400', border: 'border-zinc-700/40' },
  ];

  const maxTeamPoints = Math.max(...Object.values(teamPoints), 100);

  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Export report handler
  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      reportTitle: 'Big Boss House Performance Intelligence Dossier',
      generatedByRole: rolesConfig[currentRole]?.title,
      summary: {
        activeContestants: activeContestants.length,
        evictedContestants: evictedContestants.length,
        averagePoints,
        highestScorer: highestScorer?.name,
        taskCompletionRate: `${taskCompletionRate}%`,
        activeNominees: currentNominees.length,
      },
      teamDistribution: teamPoints,
      contestantRatings: sortedMetrics.map((m) => ({
        name: m.name,
        team: m.team,
        points: m.points,
        tasksCompleted: m.tasksCompleted,
        efficiencyScore: `${m.efficiency}%`,
        riskIndex: `${m.riskIndex}%`,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `big_boss_performance_analytics_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-800 bg-[#0c0d14]/90 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-700/40 text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.3)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white font-display">
                PERFORMANCE INTELLIGENCE & ANALYTICS
              </h2>
              <p className="text-xs text-neutral-400 tracking-wider">
                COMPREHENSIVE TELEMETRY, EFFICIENCY INDICES & RISK PROFILING
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/50 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4 text-red-400" />
          <span>EXPORT ANALYTICS DOSSIER</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0e1017] relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">HOUSE EFFICIENCY INDEX</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {taskCompletionRate}%
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{completedTasksCount} / {totalTasksCount}</span>
            <span>tasks completed house-wide</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0e1017] relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL SCORE CAPITAL</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black font-mono text-red-400">
            {totalActivePoints.toLocaleString()} <span className="text-sm text-neutral-500">PTS</span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-300 font-semibold">{averagePoints} pts</span>
            <span>average per active housemate</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
              style={{ width: '75%' }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0e1017] relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">DANGER ZONE EXPOSURE</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {currentNominees.length} <span className="text-sm text-neutral-500">AT RISK</span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="text-red-400 font-semibold">
              {activeContestants.length > 0 ? Math.round((currentNominees.length / activeContestants.length) * 100) : 0}%
            </span>
            <span>of active roster facing eviction</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 rounded-full animate-pulse"
              style={{ width: `${activeContestants.length > 0 ? (currentNominees.length / activeContestants.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0e1017] relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">APEX PERFORMER</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-display text-amber-400 truncate">
            {highestScorer ? highestScorer.name : '—'}
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="text-white font-mono font-bold">{highestScorer ? `${highestScorer.points} pts` : '0 pts'}</span>
            <span className="text-neutral-500">({highestScorer?.team})</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Team Power Distribution Matrix */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-[#0c0d14] shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
              FACTION DOMINANCE MATRIX
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 uppercase">
            LIVE SCORE ACCUMULATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map((t) => {
            const score = teamPoints[t.name] || 0;
            const percentage = maxTeamPoints > 0 ? Math.round((score / maxTeamPoints) * 100) : 0;
            const members = activeContestants.filter((c) => c.team === t.name);

            return (
              <div 
                key={t.name}
                className={`p-4 rounded-xl bg-neutral-900/60 border ${t.border} transition-all hover:bg-neutral-900`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${t.color}`}>
                    {t.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {score} PTS
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full ${t.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/60">
                  <span>{members.length} Active Members</span>
                  <span className="font-mono">{percentage}% Index</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contestant Performance Efficiency Table */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-[#0c0d14] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-4">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CONTESTANT EFFICIENCY & RISK ROSTER
            </h3>
            <p className="text-xs text-neutral-400">
              Multi-dimensional evaluation factoring points, task executions, and survival status
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Teams</option>
              <option value="Team Red">Team Red</option>
              <option value="Team Blue">Team Blue</option>
              <option value="Team Gold">Team Gold</option>
              <option value="Team Black">Team Black</option>
            </select>

            <div className="flex items-center rounded-lg bg-neutral-900 p-0.5 border border-neutral-800 text-xs">
              <button
                onClick={() => setMetricSort('efficiency')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  metricSort === 'efficiency' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Efficiency
              </button>
              <button
                onClick={() => setMetricSort('points')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  metricSort === 'points' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Points
              </button>
              <button
                onClick={() => setMetricSort('tasks')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  metricSort === 'tasks' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 px-3">CONTESTANT</th>
                <th className="pb-3 px-3">TEAM</th>
                <th className="pb-3 px-3 text-right">POINTS</th>
                <th className="pb-3 px-3 text-center">TASKS</th>
                <th className="pb-3 px-3">EFFICIENCY RATING</th>
                <th className="pb-3 px-3 text-center">EVICTION RISK</th>
                <th className="pb-3 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {sortedMetrics.map((c, index) => {
                const teamStyle = getTeamBadgeColor(c.team);

                return (
                  <tr key={c.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-neutral-500 w-4">
                          #{index + 1}
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner"
                          style={{ backgroundColor: c.avatarColor }}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white font-display flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.isCaptain && <span title="Captain">👑</span>}
                            {c.isImmune && <span title="Immune">🛡</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${teamStyle.bg} ${teamStyle.text} ${teamStyle.border}`}>
                        {c.team}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      {c.points}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-neutral-300">
                      {c.tasksCompleted}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              c.efficiency >= 70 ? 'bg-emerald-500' : c.efficiency >= 45 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${c.efficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-white w-8 text-right">
                          {c.efficiency}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        c.riskIndex >= 50 
                          ? 'bg-red-950/80 text-red-300 border border-red-700/60 animate-pulse'
                          : c.riskIndex >= 20 
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/40'
                      }`}>
                        {c.riskIndex}% RISK
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {c.isNominated ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded uppercase">
                          NOMINATED
                        </span>
                      ) : c.isImmune ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded uppercase">
                          IMMUNE
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                          SAFE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
