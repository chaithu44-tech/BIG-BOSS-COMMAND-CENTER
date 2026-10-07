import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { getTeamBadgeColor } from '../../utils/helpers';
import { UserX, Clock, Award } from 'lucide-react';

export const EvictionHistoryTable: React.FC = () => {
  const { evictions } = useHouse();

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-700/50 text-red-500">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">
              EVICTION ARCHIVE & HISTORY
            </h3>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
              PERMANENT LOG OF EXPELLED CONTESTANTS ({evictions.length})
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
              <th className="py-2.5 px-3">CONTESTANT</th>
              <th className="py-2.5 px-3">TEAM</th>
              <th className="py-2.5 px-3 text-right">FINAL POINTS</th>
              <th className="py-2.5 px-3 text-center">TASKS COMPLETED</th>
              <th className="py-2.5 px-3">EVICTION TIMESTAMP</th>
              <th className="py-2.5 px-3">DISMISSAL REASON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40 text-xs">
            {evictions.length > 0 ? (
              evictions.map((record) => {
                const teamBadge = getTeamBadgeColor(record.team);
                return (
                  <tr key={record.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center">
                          {record.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white font-display text-sm tracking-wide">
                          {record.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                      >
                        {record.team}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-300">
                      {record.finalPoints} PTS
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-neutral-400">
                      {record.tasksCompleted}
                    </td>

                    <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                      {record.evictionTime}
                    </td>

                    <td className="py-3 px-3 text-neutral-400 text-xs truncate max-w-xs">
                      {record.reason}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500 text-xs">
                  NO EVICTIONS RECORDED
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
