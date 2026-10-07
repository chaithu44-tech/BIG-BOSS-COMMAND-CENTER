import React, { useState, useEffect } from 'react';
import { useHouse } from '../../context/HouseContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Bell,
  RotateCcw,
  Menu,
  Clock,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    resetHouse,
    announcements,
    activities,
    isVoiceEnabled,
    setIsVoiceEnabled,
    speakCurrentAnnouncement,
  } = useHouse();
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('00:00:00');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'BIG BOSS COMMAND CENTER',
          subtitle: 'LIVE HOUSE MONITORING & SYSTEM CONSOLE',
        };
      case 'contestants':
        return {
          title: 'CONTESTANT ROSTER',
          subtitle: 'MANAGE STATUS, TEAMS, AND INDIVIDUAL CREDITS',
        };
      case 'leaderboard':
        return {
          title: 'OFFICIAL LEADERBOARD',
          subtitle: 'REAL-TIME ACTIVE HOUSE RANKING BY POINTS',
        };
      case 'tasks':
        return {
          title: 'TASK OPERATIONS',
          subtitle: 'CHALLENGE DISPATCH, COUNTDOWNS & REWARDS',
        };
      case 'nominations':
        return {
          title: 'NOMINATION CONTROL',
          subtitle: 'EVICTION CANDIDATE REGISTRY & DANGER ZONE',
        };
      case 'captaincy':
        return {
          title: 'HOUSE CAPTAINCY',
          subtitle: 'EXECUTIVE APPOINTMENT & LEADERSHIP PRIVILEGES',
        };
      case 'announcements':
        return {
          title: 'BROADCAST CENTER',
          subtitle: 'ISSUE SUPREME DECREES TO THE ENTIRE HOUSE',
        };
      case 'eviction':
        return {
          title: 'EVICTION CHAMBER',
          subtitle: 'EXPULSION EXECUTIONS & HISTORICAL ARCHIVES',
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#08090e]/90 backdrop-blur-md border-b border-red-950/40 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-wider text-white font-display leading-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            <p className="text-[11px] font-medium tracking-wider uppercase text-neutral-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center: Pulsing LIVE Beacon */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-xs font-bold tracking-widest text-red-200 uppercase font-display flex items-center gap-1.5">
            <span>LIVE — BIG BOSS IS WATCHING</span>
            <Eye className="w-3.5 h-3.5 text-red-400" />
          </span>
        </div>

        {/* Right: Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-200">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white">
              {currentTimeStr}
            </span>
          </div>

          {/* Voice Pronunciation Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (nextState) {
                speakCurrentAnnouncement('Voice pronunciation online. Big Boss audio transmission is active.');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-red-950/70 border-red-600/70 text-red-300 hover:text-white shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={isVoiceEnabled ? 'Voice Pronunciation: ACTIVE (Click to Mute)' : 'Voice Pronunciation: MUTED (Click to Enable & Test)'}
            aria-label="Toggle voice announcements"
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider">VOICE: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider">VOICE: OFF</span>
              </>
            )}
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activities.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-neutral-900" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f1118] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-display flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      RECENT TRANSMISSIONS
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {activities.length} EVENTS
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800/60 mt-2 space-y-2">
                    {activities.slice(0, 6).map((act) => (
                      <div key={act.id} className="pt-2 text-xs flex items-start gap-2">
                        <span className="text-[10px] font-mono text-neutral-500 shrink-0 mt-0.5">
                          {act.timestamp}
                        </span>
                        <span className="text-neutral-300 flex-1">{act.message}</span>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <div className="py-6 text-center text-xs text-neutral-500">
                        No recent activity recorded.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset House Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600/60 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            title="Reset House to initial demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">RESET HOUSE</span>
          </button>
        </div>
      </header>

      {/* House Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="RESET HOUSE STATE"
        message="Are you sure you want to reset all house data back to initial demo state? All custom contestants, point overrides, and task changes will be restored to defaults."
        confirmLabel="RESTORE DEMO DATA"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={() => {
          resetHouse();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
};
