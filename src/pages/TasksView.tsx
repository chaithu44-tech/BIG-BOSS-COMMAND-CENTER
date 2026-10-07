import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { TaskCard } from '../components/tasks/TaskCard';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskTimerWidget } from '../components/dashboard/TaskTimerWidget';
import { CheckSquare, Plus, Filter, Play, CheckCircle2, Clock } from 'lucide-react';
import { TaskStatus } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, completedTasksCount, totalTasksCount } = useHouse();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-500" />
            <span>TASK & CHALLENGE COMMAND</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Deploy house challenges, track timers, and reward luxury score bonuses upon successful completion.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE TASK</span>
        </button>
      </div>

      {/* Grid: Tasks Operations + Large Countdown Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filter and Task Cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0b0c12] border border-neutral-800 w-fit">
            {(['ALL', 'PENDING', 'ACTIVE', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  filter === st
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => <TaskCard key={t.id} task={t} />)
            ) : (
              <div className="col-span-2 py-12 text-center text-xs text-neutral-500 rounded-xl bg-neutral-900/30 border border-neutral-800">
                NO TASKS IN THIS STATUS CATEGORY
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Challenge Countdown Timer */}
        <div className="lg:col-span-5 xl:col-span-4">
          <TaskTimerWidget />
        </div>
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
