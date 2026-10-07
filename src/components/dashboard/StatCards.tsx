import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { Users, Crown, Trophy, CheckSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StatCards: React.FC = () => {
  const {
    activeContestantsCount,
    houseCaptain,
    highestScorer,
    completedTasksCount,
    totalTasksCount,
    currentNominees,
    immuneContestants,
    setActiveTab,
  } = useHouse();

  const cards = [
    {
      title: 'ACTIVE CONTESTANTS',
      value: activeContestantsCount,
      subtext: 'Inside the House',
      icon: <Users className="w-5 h-5 text-red-400" />,
      border: 'border-red-900/40 hover:border-red-600/50',
      action: () => setActiveTab('contestants'),
    },
    {
      title: 'HOUSE CAPTAIN',
      value: houseCaptain ? houseCaptain.name : 'VACANT',
      subtext: houseCaptain ? `${houseCaptain.team} · Supreme Lead` : 'Appointment Required',
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-900/40 hover:border-amber-500/50',
      highlight: !!houseCaptain,
      action: () => setActiveTab('captaincy'),
    },
    {
      title: 'HIGHEST SCORER',
      value: highestScorer ? highestScorer.name : '—',
      subtext: highestScorer ? `${highestScorer.points} PTS · Rank #1` : 'No points yet',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      border: 'border-yellow-900/40 hover:border-yellow-500/50',
      action: () => setActiveTab('leaderboard'),
    },
    {
      title: 'COMPLETED TASKS',
      value: `${completedTasksCount} / ${totalTasksCount}`,
      subtext: `${totalTasksCount - completedTasksCount} Tasks Remaining`,
      icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
      border: 'border-emerald-900/40 hover:border-emerald-600/50',
      action: () => setActiveTab('tasks'),
    },
    {
      title: 'CURRENT NOMINEES',
      value: currentNominees.length,
      subtext: currentNominees.length > 0 ? 'Facing Eviction' : 'Danger Zone Safe',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      border: currentNominees.length > 0 
        ? 'border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.25)]' 
        : 'border-neutral-800 hover:border-neutral-700',
      badge: currentNominees.length > 0 ? 'DANGER' : undefined,
      action: () => setActiveTab('nominations'),
    },
    {
      title: 'IMMUNE CONTESTANTS',
      value: immuneContestants.length,
      subtext: immuneContestants.length > 0 ? immuneContestants.map(c => c.name).join(', ') : 'No Immunity Active',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      border: 'border-cyan-900/40 hover:border-cyan-600/50',
      action: () => setActiveTab('nominations'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => (
        <button
          key={idx}
          onClick={card.action}
          className={`relative text-left p-4 rounded-xl bg-[#0c0e15]/90 border ${card.border} transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer backdrop-blur-md overflow-hidden`}
        >
          {card.badge && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-red-600 text-white animate-pulse">
              {card.badge}
            </span>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 font-display">
              {card.title}
            </span>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 group-hover:bg-neutral-800 transition-colors">
              {card.icon}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-white font-display tracking-wide truncate">
            {card.value}
          </div>

          <div className="text-[11px] text-neutral-400 mt-1 truncate">
            {card.subtext}
          </div>
        </button>
      ))}
    </div>
  );
};
