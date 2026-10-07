import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { getTeamBadgeColor } from '../utils/helpers';
import { Crown, CheckCircle2, Shield, Users, Award, X } from 'lucide-react';

export const CaptaincyView: React.FC = () => {
  const { houseCaptain, activeContestants, setCaptain } = useHouse();
  const [showSelectModal, setShowSelectModal] = useState(false);

  const handleSelectNewCaptain = (id: string) => {
    setCaptain(id);
    setShowSelectModal(false);
  };

  const captainTeamBadge = houseCaptain ? getTeamBadgeColor(houseCaptain.team) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>HOUSE CAPTAINCY CONTROL</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Sole executive leadership of the House. Governs luxury rations, room allocations, and task delegations.
          </p>
        </div>

        <button
          onClick={() => setShowSelectModal(true)}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer shrink-0 flex items-center gap-2"
        >
          <Crown className="w-4 h-4 fill-black" />
          <span>CHANGE CAPTAIN</span>
        </button>
      </div>

      {/* Large Featured Current House Captain Card */}
      {houseCaptain ? (
        <div className="rounded-2xl border border-amber-500/60 bg-gradient-to-br from-[#1c160c] via-[#100d07] to-[#0a0a0c] p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden">
          {/* Top Gold Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-black text-white text-3xl sm:text-4xl shadow-2xl shrink-0 border-2 border-amber-400/80 relative"
                style={{ backgroundColor: houseCaptain.avatarColor }}
              >
                {houseCaptain.name.charAt(0)}
                <div className="absolute -top-3 -right-3 p-1.5 rounded-full bg-amber-400 text-black shadow-lg">
                  <Crown className="w-5 h-5 fill-black" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-display flex items-center gap-1">
                    <span>REIGNING HOUSE CAPTAIN</span>
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase font-display tracking-wide">
                  {houseCaptain.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  {captainTeamBadge && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded border ${captainTeamBadge.bg} ${captainTeamBadge.text} ${captainTeamBadge.border}`}
                    >
                      {houseCaptain.team}
                    </span>
                  )}
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {houseCaptain.points} PTS
                  </span>
                  <span className="text-xs text-neutral-400">
                    · {houseCaptain.tasksCompleted} Tasks Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 max-w-xs text-xs text-neutral-300 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1 font-display uppercase tracking-wide">
                  PRIVILEGES ACTIVE
                </span>
                Exempt from daily chore rotas, immune to nomination penalties during term, and possesses casting tie-break vote.
              </div>

              <button
                onClick={() => setShowSelectModal(true)}
                className="px-5 py-2.5 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                APPOINT NEW SUCCESSOR
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-[#0e1017] p-8 text-center">
          <Crown className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white uppercase font-display">
            CAPTAINCY VACANT
          </h3>
          <p className="text-xs text-neutral-400 mt-1 mb-4">
            No housemate has been crowned captain yet. Appoint a leader to enforce house governance.
          </p>
          <button
            onClick={() => setShowSelectModal(true)}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            SELECT CAPTAIN NOW
          </button>
        </div>
      )}

      {/* Eligible Candidates Roster */}
      <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl">
        <h3 className="text-base font-bold tracking-wider uppercase text-white font-display mb-4">
          HOUSEMATE CANDIDATE POOL ({activeContestants.length} ACTIVE)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeContestants.map((c) => {
            const isCurrent = c.isCaptain;
            const badge = getTeamBadgeColor(c.team);
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/70'
                    : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-display flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {isCurrent && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span className={badge.text}>{c.team}</span>
                      <span>· {c.points} PTS</span>
                    </div>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-[11px] font-bold text-amber-400 font-display uppercase tracking-wider px-2 py-1 bg-amber-500/10 rounded">
                    CURRENT
                  </span>
                ) : (
                  <button
                    onClick={() => setCaptain(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-600 hover:text-black text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    APPOINT
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Captain Modal */}
      {showSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e1017] border border-amber-500/50 rounded-xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white font-display">
                  APPOINT HOUSE CAPTAIN
                </h3>
              </div>
              <button
                onClick={() => setShowSelectModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mt-3 mb-4">
              Select an active contestant to receive captaincy. Any previous captain automatically loses status.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeContestants.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectNewCaptain(c.id)}
                  disabled={c.isCaptain}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    c.isCaptain
                      ? 'bg-amber-950/40 border-amber-600/50 opacity-60 cursor-default'
                      : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm font-display">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {c.team} · {c.points} PTS
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-400">
                    {c.isCaptain ? 'REIGNING' : 'SELECT →'}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowSelectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
