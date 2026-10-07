import React, { useState, useMemo } from 'react';
import { useHouse } from '../context/HouseContext';
import { ActivityType } from '../types';
import {
  Activity,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Crown,
  CheckCircle2,
  UserX,
  Megaphone,
  UserPlus,
  Radio,
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  Pause,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const ActivityLogView: React.FC = () => {
  const {
    activities,
    clearActivities,
    exportActivities,
    isAutoLoggingActive,
    setIsAutoLoggingActive,
    currentRole,
  } = useHouse();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [showClearModal, setShowClearModal] = useState(false);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'points':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'nomination':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'immunity':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'captain':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'eviction':
        return <UserX className="w-4 h-4 text-red-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-purple-400" />;
      case 'contestant':
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <Radio className="w-4 h-4 text-neutral-400" />;
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch = act.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'ALL' || act.type === selectedType;
      const matchesSeverity =
        selectedSeverity === 'ALL' || (act.severity || 'normal') === selectedSeverity;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [activities, searchQuery, selectedType, selectedSeverity]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-800 bg-[#0c0d14]/90 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-700/50 text-red-400 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold uppercase tracking-wider text-white font-display">
                REAL-TIME SURVEILLANCE ACTIVITY LOG
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-700 text-neutral-300">
                <span className={`w-2 h-2 rounded-full ${isAutoLoggingActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                {isAutoLoggingActive ? 'FEED STREAM: LIVE' : 'FEED: PAUSED'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 tracking-wider">
              HIGH-FREQUENCY AUDIT TRAIL, TELEMETRY PACKETS & EXECUTIVE EVENT LOGS
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAutoLoggingActive(!isAutoLoggingActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isAutoLoggingActive
                ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                : 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:text-white'
            }`}
            title="Pause or Resume live incoming surveillance telemetry stream"
          >
            {isAutoLoggingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isAutoLoggingActive ? 'PAUSE STREAM' : 'RESUME STREAM'}</span>
          </button>

          <button
            onClick={() => exportActivities('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Export activity logs as CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={() => exportActivities('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Export activity logs as JSON"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            title="Flush activity logs"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>CLEAR LOGS</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-[#0e1017] shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event logs by keyword, contestant name, camera..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <span>TYPE:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="points">Points & Scores</option>
            <option value="nomination">Nominations</option>
            <option value="immunity">Immunity</option>
            <option value="captain">Captaincy</option>
            <option value="task">Tasks & Missions</option>
            <option value="eviction">Evictions</option>
            <option value="announcement">Announcements</option>
            <option value="security">Security & Surveillance</option>
            <option value="system">System Telemetry</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings</option>
            <option value="normal">Standard Logs</option>
          </select>
        </div>
      </div>

      {/* Main Terminal-Style Logs Container */}
      <div className="rounded-xl border border-neutral-800 bg-[#090a10] shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-[#0e1017] border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono text-neutral-400 ml-2 text-[11px]">
              surveillance_audit_stream.log
            </span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            TOTAL RECORDS: <span className="text-white font-bold">{filteredActivities.length}</span>
          </div>
        </div>

        {/* Logs Stream */}
        <div className="p-4 max-h-[620px] overflow-y-auto divide-y divide-neutral-900/80 font-mono text-xs">
          {filteredActivities.length === 0 ? (
            <div className="py-16 text-center text-neutral-500">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse text-red-500" />
              <p>No matching surveillance logs found.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-red-400 underline cursor-pointer"
                >
                  Clear search filter
                </button>
              )}
            </div>
          ) : (
            filteredActivities.map((act) => {
              const isCrit = act.severity === 'critical';
              const isWarn = act.severity === 'warning';

              return (
                <div
                  key={act.id}
                  className={`py-3 px-2 flex items-start gap-3 transition-colors hover:bg-neutral-900/50 ${
                    isCrit ? 'bg-red-950/20' : isWarn ? 'bg-amber-950/10' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <span className="text-neutral-500 shrink-0 select-none text-[11px]">
                    [{act.timestamp}]
                  </span>

                  {/* Icon badge */}
                  <div className="shrink-0 p-1 rounded bg-neutral-900 border border-neutral-800">
                    {getActivityIcon(act.type)}
                  </div>

                  {/* Severity badge */}
                  {isCrit ? (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-900/80 text-red-200 border border-red-600/60">
                      CRITICAL
                    </span>
                  ) : isWarn ? (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-950/80 text-amber-300 border border-amber-600/40">
                      WARN
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded text-neutral-400 bg-neutral-900 border border-neutral-800">
                      {act.type.toUpperCase()}
                    </span>
                  )}

                  {/* Message */}
                  <span className={`flex-1 break-words leading-relaxed ${
                    isCrit ? 'text-red-200 font-semibold' : isWarn ? 'text-amber-200' : 'text-neutral-300'
                  }`}>
                    {act.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clear Logs Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        title="CLEAR ACTIVITY LOG"
        message="Are you sure you want to clear the entire surveillance activity stream? Historical activity items currently in session will be erased."
        confirmLabel="PURGE LOGS"
        cancelLabel="CANCEL"
        variant="danger"
        onConfirm={() => {
          clearActivities();
          setShowClearModal(false);
        }}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
