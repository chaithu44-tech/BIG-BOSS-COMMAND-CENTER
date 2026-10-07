import React, { useState, useEffect } from 'react';
import { useHouse } from '../../context/HouseContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserRole } from '../../types';
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
  Shield,
  ShieldAlert,
  ChevronDown,
  Check,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    resetHouse,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    currentRole,
    setCurrentRole,
    rolesConfig,
    isVoiceEnabled,
    setIsVoiceEnabled,
    speakCurrentAnnouncement,
  } = useHouse();

  const [currentTimeStr, setCurrentTimeStr] = useState<string>('00:00:00');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
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
      case 'analytics':
        return {
          title: 'PERFORMANCE ANALYTICS',
          subtitle: 'HOUSE TELEMETRY, EFFICIENCY & FACTION METRICS',
        };
      case 'activity-log':
        return {
          title: 'SURVEILLANCE LOGS',
          subtitle: 'REAL-TIME EVENT STREAMS & TELEMETRY AUDIT',
        };
      default:
        return {
          title: 'BIG BOSS COMMAND CENTER',
          subtitle: 'LIVE HOUSE MONITORING',
        };
    }
  };

  const { title, subtitle } = getPageInfo();
  const activeRoleConfig = rolesConfig[currentRole];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#08090e]/95 backdrop-blur-md border-b border-red-950/40 px-3 sm:px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle + Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-display leading-tight flex items-center gap-2 truncate">
              <span className="truncate">{title}</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-neutral-400 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center: Pulsing LIVE Beacon */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.2)] shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-xs font-bold tracking-widest text-red-200 uppercase font-display flex items-center gap-1.5">
            <span>LIVE — BIG BOSS IS WATCHING</span>
            <Eye className="w-3.5 h-3.5 text-red-400" />
          </span>
        </div>

        {/* Right: Role Switcher, Clock, Voice, Notifications & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Role-Based Access Control (RBAC) Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                currentRole === 'big_boss'
                  ? 'bg-red-950/80 border-red-600/70 text-red-200 hover:border-red-400'
                  : currentRole === 'producer'
                  ? 'bg-amber-950/80 border-amber-600/70 text-amber-200 hover:border-amber-400'
                  : 'bg-blue-950/80 border-blue-600/70 text-blue-200 hover:border-blue-400'
              }`}
              title="Switch user role & clearance privileges"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-mono">{activeRoleConfig?.badge}</span>
              <span className="sm:hidden font-mono">{activeRoleConfig?.clearanceLevel === 5 ? 'BB' : activeRoleConfig?.clearanceLevel === 3 ? 'PROD' : 'AUDIT'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0e1017] border border-neutral-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="pb-2.5 mb-2 border-b border-neutral-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-display flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-red-400" />
                      SECURITY CLEARANCE & ROLES
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Select operator identity to toggle authority levels.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {(Object.keys(rolesConfig) as UserRole[]).map((rKey) => {
                      const rConfig = rolesConfig[rKey];
                      const isCurrent = currentRole === rKey;

                      return (
                        <button
                          key={rKey}
                          onClick={() => {
                            setCurrentRole(rKey);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-neutral-800/90 border-red-500/70 shadow-sm'
                              : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                              {rConfig.title}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black border border-neutral-800 text-neutral-300">
                                {rConfig.badge}
                              </span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-red-400" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {rConfig.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Live Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-200">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-white">
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
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-red-950/70 border-red-600/70 text-red-300 hover:text-white shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={isVoiceEnabled ? 'Voice Pronunciation: ACTIVE (Click to Mute)' : 'Voice Pronunciation: MUTED (Click to Enable & Test)'}
            aria-label="Toggle voice announcements"
          >
            {isVoiceEnabled ? (
              <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Event Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
              aria-label="Event Notifications"
              title="Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-[10px] font-bold text-white font-mono flex items-center justify-center animate-pulse border border-neutral-900 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f1118] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-display">
                        EVENT NOTIFICATION HUB
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] font-semibold text-neutral-400 hover:text-white uppercase cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={clearNotifications}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 cursor-pointer"
                        title="Clear all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-850 mt-2 space-y-2">
                    {notifications.map((notif) => {
                      const isUnread = !notif.read;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionTab) {
                              setActiveTab(notif.actionTab);
                              setShowNotifications(false);
                            }
                          }}
                          className={`pt-2 pb-2 px-2 rounded-lg cursor-pointer transition-all ${
                            isUnread ? 'bg-neutral-900/80 border-l-2 border-red-500' : 'hover:bg-neutral-900/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${
                              notif.type === 'critical' ? 'text-red-400' : notif.type === 'warning' ? 'text-amber-400' : 'text-neutral-200'
                            }`}>
                              {notif.title}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.actionTab && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-red-400 font-semibold uppercase">
                              <span>Open {notif.actionTab}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-xs text-neutral-500">
                        No notifications recorded.
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600/60 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            title="Reset House to initial demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">RESET</span>
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
