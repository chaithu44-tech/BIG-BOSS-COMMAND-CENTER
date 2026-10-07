import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { DangerZoneWidget } from '../components/dashboard/DangerZoneWidget';
import { getTeamBadgeColor } from '../utils/helpers';
import {
  AlertTriangle,
  ShieldCheck,
  Shield,
  UserX,
  Plus,
  Minus,
  CheckCircle2,
  Skull,
} from 'lucide-react';

export const NominationsView: React.FC = () => {
  const {
    activeContestants,
    currentNominees,
    immuneContestants,
    nominateContestant,
    removeNomination,
    grantImmunity,
    removeImmunity,
  } = useHouse();

  const [selectedContestantId, setSelectedContestantId] = useState<string>(
    activeContestants[0]?.id || ''
  );

  const handleNominateSelected = () => {
    if (selectedContestantId) {
      nominateContestant(selectedContestantId);
    }
  };

  const handleImmunitySelected = () => {
    if (selectedContestantId) {
      grantImmunity(selectedContestantId);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>NOMINATIONS & IMMUNITY DESK</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Decide which housemates face public eviction and bestow supreme immunity shields.
          </p>
        </div>

        {/* Quick Quick Nominate Console */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-black/60 border border-neutral-800">
          <select
            value={selectedContestantId}
            onChange={(e) => setSelectedContestantId(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-semibold text-white focus:border-red-500 outline-none"
          >
            {activeContestants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.team}) {c.isImmune ? '🛡 IMMUNE' : c.isNominated ? '⚠ NOM' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleNominateSelected}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
          >
            NOMINATE
          </button>

          <button
            onClick={handleImmunitySelected}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GRANT IMMUNITY</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Danger Zone on Top/Left + Full Interactive Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: The Danger Zone Widget */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
          <DangerZoneWidget />
        </div>

        {/* Right: Active Contestants Nomination Controls Table */}
        <div className="lg:col-span-7 xl:col-span-7 rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div>
                <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">
                  HOUSEMATE STATUS & ACTIONS
                </h3>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                  ENFORCE NOMINATION RULES & IMMUNITY SAFEGUARDS
                </p>
              </div>

              <span className="text-xs text-neutral-400 font-mono">
                {currentNominees.length} Nominated · {immuneContestants.length} Immune
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
              {activeContestants.map((c) => {
                const teamBadge = getTeamBadgeColor(c.team);
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      c.isNominated
                        ? 'bg-red-950/20 border-red-700/60'
                        : c.isImmune
                        ? 'bg-cyan-950/20 border-cyan-700/50'
                        : 'bg-neutral-900/40 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-display tracking-wide truncate">
                            {c.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${teamBadge.bg} ${teamBadge.text} ${teamBadge.border}`}
                          >
                            {c.team}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          {c.isImmune && (
                            <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-cyan-400" />
                              🛡 IMMUNE
                            </span>
                          )}
                          {c.isNominated && (
                            <span className="text-[10px] font-bold text-red-400 flex items-center gap-0.5">
                              <Skull className="w-3 h-3 text-red-500" />
                              NOMINATED
                            </span>
                          )}
                          {!c.isImmune && !c.isNominated && (
                            <span className="text-[10px] text-neutral-400">Eligible</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Nominate / Remove */}
                      {c.isNominated ? (
                        <button
                          onClick={() => removeNomination(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          REVOKE NOM
                        </button>
                      ) : (
                        <button
                          onClick={() => nominateContestant(c.id)}
                          disabled={c.isImmune}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                            c.isImmune
                              ? 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                              : 'bg-red-950/70 hover:bg-red-900 border border-red-700 text-red-300'
                          }`}
                          title={c.isImmune ? 'Cannot nominate immune contestant' : 'Nominate for eviction'}
                        >
                          NOMINATE
                        </button>
                      )}

                      {/* Immunity / Remove */}
                      {c.isImmune ? (
                        <button
                          onClick={() => removeImmunity(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          REVOKE IMM
                        </button>
                      ) : (
                        <button
                          onClick={() => grantImmunity(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          IMMUNITY
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
