import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { StatCards } from '../components/dashboard/StatCards';
import { DangerZoneWidget } from '../components/dashboard/DangerZoneWidget';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { TaskTimerWidget } from '../components/dashboard/TaskTimerWidget';
import { TaskCard } from '../components/tasks/TaskCard';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { LiveActivityWidget } from '../components/dashboard/LiveActivityWidget';
import { AnnouncementWidget } from '../components/dashboard/AnnouncementWidget';
import { EvictionHistoryTable } from '../components/dashboard/EvictionHistoryTable';
import { HouseAnalyticsSection } from '../components/dashboard/HouseAnalyticsSection';
import { Plus, CheckSquare, Eye, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { tasks, setActiveTab } = useHouse();
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Active or pending tasks for quick action
  const activeOrPendingTasks = tasks.filter((t) => t.status !== 'COMPLETED').slice(0, 2);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header is rendered in Top Header, but we provide an authentic Command Console Banner */}
      <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-red-950/40 via-[#0e1017] to-neutral-900 border border-red-900/40 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 font-display mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>PRIMARY REALITY COMMAND CONSOLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-wider">
              BIG BOSS COMMAND CENTER
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
              Continuous live telemetry, disciplinary controls, nomination monitoring, and eviction powers over the entire House.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('contestants')}
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
            >
              MANAGE HOUSEMATES
            </button>
            <button
              onClick={() => setActiveTab('nominations')}
              className="px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              DANGER ZONE
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Statistics Cards */}
      <section>
        <StatCards />
      </section>

      {/* 3. Main Area: Left Leaderboard (60%) + Right Danger Zone (40%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <LeaderboardTable compact={false} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <DangerZoneWidget />
        </div>
      </section>

      {/* 4. Second Area: Task Management + Countdown Timer */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Task Operations */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">
                    ACTIVE TASK OPERATIONS
                  </h3>
                  <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                    CURRENT CHALLENGES IN PROGRESS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW TASK</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  VIEW ALL →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeOrPendingTasks.length > 0 ? (
                activeOrPendingTasks.map((t) => <TaskCard key={t.id} task={t} />)
              ) : (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-500 bg-neutral-900/30 rounded-lg border border-neutral-800/60">
                  NO ACTIVE TASKS
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Timer */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <TaskTimerWidget />
        </div>
      </section>

      {/* 5. Third Area: Live Activity Feed + Big Boss Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <LiveActivityWidget />
        </div>
        <div className="flex flex-col">
          <AnnouncementWidget />
        </div>
      </section>

      {/* 6. Fourth Area: House Analytics & Charts */}
      <section>
        <HouseAnalyticsSection />
      </section>

      {/* 7. Bottom Area: Eviction History */}
      <section>
        <EvictionHistoryTable />
      </section>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
      />
    </div>
  );
};
