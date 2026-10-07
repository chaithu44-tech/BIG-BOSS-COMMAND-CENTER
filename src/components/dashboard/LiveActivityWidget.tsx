import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { ActivityType } from '../../types';
import {
  Flame,
  AlertTriangle,
  ShieldCheck,
  Crown,
  CheckCircle2,
  UserX,
  Megaphone,
  UserPlus,
  Radio,
  Clock,
} from 'lucide-react';

export const LiveActivityWidget: React.FC = () => {
  const { activities } = useHouse();

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'points':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'nomination':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      case 'immunity':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'captain':
        return <Crown className="w-3.5 h-3.5 text-yellow-400" />;
      case 'task':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'eviction':
        return <UserX className="w-3.5 h-3.5 text-red-600" />;
      case 'announcement':
        return <Megaphone className="w-3.5 h-3.5 text-rose-400" />;
      case 'contestant':
        return <UserPlus className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800/40">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white font-display">
              LIVE ACTIVITY FEED
            </h3>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
              HOUSE SURVEILLANCE LOGS
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
          {activities.length} EVENTS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[320px]">
        {activities.length > 0 ? (
          activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-800/60 hover:border-neutral-700/80 transition-all text-xs"
            >
              <div className="p-1 rounded bg-black/50 shrink-0 mt-0.5">
                {getActivityIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-neutral-200 font-medium leading-relaxed break-words">
                  {act.message}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-neutral-500 pt-0.5">
                <Clock className="w-2.5 h-2.5 text-neutral-600" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-neutral-500 text-xs">
            No activity logs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
