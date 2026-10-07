import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { Contestant, Team } from '../types';
import { ContestantCard } from '../components/contestants/ContestantCard';
import { AddContestantModal } from '../components/contestants/AddContestantModal';
import { BulkImportModal } from '../components/contestants/BulkImportModal';
import { EditContestantModal } from '../components/contestants/EditContestantModal';
import { CustomPointsModal } from '../components/contestants/CustomPointsModal';
import { UserPlus, FileUp, Search, Filter, Users, ShieldAlert, Award } from 'lucide-react';

export const ContestantsView: React.FC = () => {
  const { contestants, activeContestantsCount } = useHouse();

  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<'ALL' | Team>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'NOMINATED' | 'IMMUNE' | 'EVICTED'>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(null);
  const [customPointsContestant, setCustomPointsContestant] = useState<Contestant | null>(null);

  const { setCustomPoints } = useHouse();

  // Filter contestants
  const filteredContestants = contestants.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter === 'ALL' || c.team === teamFilter;
    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') matchesStatus = !c.isEvicted && c.status === 'Active';
    else if (statusFilter === 'NOMINATED') matchesStatus = c.isNominated && !c.isEvicted;
    else if (statusFilter === 'IMMUNE') matchesStatus = c.isImmune && !c.isEvicted;
    else if (statusFilter === 'EVICTED') matchesStatus = c.isEvicted || c.status === 'Evicted';

    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0d0f17] border border-neutral-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" />
            <span>CONTESTANT MANAGEMENT</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full authority over active housemates, teams, penalties, immunity, and eviction nominations.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>ADD CONTESTANT</span>
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-neutral-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>IMPORT CONTESTANTS</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl bg-[#0b0c12] border border-neutral-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contestant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black border border-neutral-800 rounded-lg text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 shrink-0 font-display">
            FILTER:
          </span>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as 'ALL' | Team)}
            className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:border-red-500 outline-none"
          >
            <option value="ALL">All Teams</option>
            <option value="Team Red">Team Red</option>
            <option value="Team Blue">Team Blue</option>
            <option value="Team Gold">Team Gold</option>
            <option value="Team Black">Team Black</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:border-red-500 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="NOMINATED">Nominated</option>
            <option value="IMMUNE">Immune</option>
            <option value="EVICTED">Evicted</option>
          </select>
        </div>
      </div>

      {/* Contestant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContestants.length > 0 ? (
          filteredContestants.map((c) => (
            <ContestantCard
              key={c.id}
              contestant={c}
              onEdit={(contestant) => setEditingContestant(contestant)}
              onOpenCustomPoints={(contestant) => setCustomPointsContestant(contestant)}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-neutral-500 rounded-xl bg-neutral-900/30 border border-neutral-800">
            No contestants matching current filter criteria.
          </div>
        )}
      </div>

      {/* Modals */}
      <AddContestantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <BulkImportModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />

      <EditContestantModal
        contestant={editingContestant}
        isOpen={!!editingContestant}
        onClose={() => setEditingContestant(null)}
      />

      <CustomPointsModal
        contestant={customPointsContestant}
        isOpen={!!customPointsContestant}
        onClose={() => setCustomPointsContestant(null)}
        onSave={(id, amount) => setCustomPoints(id, amount)}
      />
    </div>
  );
};
