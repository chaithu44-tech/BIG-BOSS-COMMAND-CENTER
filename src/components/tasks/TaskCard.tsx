import React from 'react';
import { Task } from '../../types';
import { useHouse } from '../../context/HouseContext';
import { Play, CheckCircle2, Clock, Users, Award, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { startTask, completeTask } = useHouse();

  const getStatusBadge = () => {
    switch (task.status) {
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
            PENDING
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-950/80 text-red-300 border border-red-600/60 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            ACTIVE
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            COMPLETED
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all duration-200 ${
        task.status === 'ACTIVE'
          ? 'bg-[#150a0d] border-red-600/60 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
          : task.status === 'COMPLETED'
          ? 'bg-[#08120c] border-emerald-900/40 opacity-80'
          : 'bg-[#0e1017] border-neutral-800/80 hover:border-neutral-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-base font-bold text-white font-display tracking-wide">
            {task.title}
          </h4>
          {getStatusBadge()}
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
          {task.description || 'No specific task briefing provided.'}
        </p>

        {/* Task Parameters Info */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/50 border border-neutral-800/60 mb-3 text-xs">
          <div>
            <span className="text-[10px] uppercase text-neutral-500 font-bold block">
              ASSIGNED
            </span>
            <span className="font-semibold text-neutral-200 truncate block">
              {task.assignedToName}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-neutral-500 font-bold block">
              REWARD
            </span>
            <span className="font-mono font-bold text-amber-400">
              +{task.pointReward} PTS
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-neutral-500 font-bold block">
              DURATION
            </span>
            <span className="font-mono text-neutral-300">
              {task.durationMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
        {task.status === 'PENDING' && (
          <button
            onClick={() => startTask(task.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-[0_0_12px_rgba(220,38,38,0.4)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START TASK</span>
          </button>
        )}

        {task.status === 'ACTIVE' && (
          <button
            onClick={() => completeTask(task.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETE TASK</span>
          </button>
        )}

        {task.status === 'COMPLETED' && (
          <div className="w-full text-center py-1.5 text-xs font-semibold text-emerald-400 font-mono">
            Concluded at {task.completedAt || 'Past Shift'}
          </div>
        )}
      </div>
    </div>
  );
};
