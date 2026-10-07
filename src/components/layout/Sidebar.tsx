import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  Trophy,
  CheckSquare,
  AlertTriangle,
  Crown,
  Megaphone,
  UserX,
  Eye,
  Radio,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, activeContestantsCount, currentNominees } = useHouse();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'contestants',
      label: 'Contestants',
      icon: <Users className="w-4 h-4" />,
      badge: activeContestantsCount,
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: 'nominations',
      label: 'Nominations',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: currentNominees.length > 0 ? currentNominees.length : undefined,
    },
    {
      id: 'captaincy',
      label: 'Captaincy',
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Megaphone className="w-4 h-4" />,
    },
    {
      id: 'eviction',
      label: 'Eviction',
      icon: <UserX className="w-4 h-4" />,
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0b10] border-r border-red-950/40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl shadow-red-950/50' : '-translate-x-full'
        }`}
      >
        {/* Top Logo Area */}
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-900 to-black border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Eye className="w-5 h-5 text-red-400 animate-pulse" />
              <div className="absolute inset-0 rounded-lg border border-red-400/20" />
            </div>

            <div>
              <div className="text-lg font-black tracking-widest text-white uppercase font-display flex items-center gap-1.5 leading-none">
                <span>BIG BOSS</span>
              </div>
              <div className="text-[10px] font-semibold tracking-widest text-red-400 uppercase mt-1">
                COMMAND CENTER
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Surveillance Status Mini-Banner */}
        <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-red-950/30 border border-red-800/30 flex items-center gap-2 text-xs">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-red-300 uppercase">
            FEED: CAM-01 PRIMARY
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-950/70 text-white border border-red-600/50 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-red-400' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      item.id === 'nominations'
                        ? 'bg-red-600 text-white animate-pulse'
                        : isActive
                        ? 'bg-red-500/30 text-red-300 border border-red-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status Block */}
        <div className="p-4 border-t border-neutral-800/80 bg-[#08090d]">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-display">
              HOUSE LIVE
            </span>
            <span className="ml-auto text-[10px] font-mono text-neutral-500 flex items-center gap-1">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              24/7
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/50 text-neutral-400">
            <span className="uppercase text-[11px] tracking-wider font-medium">ACTIVE CONTESTANTS:</span>
            <span className="font-mono font-bold text-white text-sm bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {activeContestantsCount}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
