import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../utils/currency';
import { PlayerRole } from '../types/auction';
import { Trophy, ArrowDownToLine } from 'lucide-react';

export const TeamSquadsView: React.FC = () => {
  const { teams, players, theme } = useAuction();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<'All' | PlayerRole>('All');

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const teamSquad = players.filter(p => p.soldToTeamId === selectedTeam?.id);

  const filteredSquad = activeCategory === 'All'
    ? teamSquad
    : teamSquad.filter(p => p.role === activeCategory);

  const totalSpent = selectedTeam ? selectedTeam.totalBudget - selectedTeam.remainingBudget : 0;
  const spentPercent = selectedTeam ? Math.min(100, (totalSpent / selectedTeam.totalBudget) * 100) : 0;
  const overseasCount = teamSquad.filter(p => p.isOverseas).length;

  const roleCounts: Record<PlayerRole, number> = {
    'Batsman': teamSquad.filter(p => p.role === 'Batsman').length,
    'Bowler': teamSquad.filter(p => p.role === 'Bowler').length,
    'All-Rounder': teamSquad.filter(p => p.role === 'All-Rounder').length,
    'Wicketkeeper': teamSquad.filter(p => p.role === 'Wicketkeeper').length,
  };

  const roleColors: Record<PlayerRole, string> = {
    'Batsman': 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/20',
    'Bowler': 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-500/20',
    'All-Rounder': 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/20',
    'Wicketkeeper': 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/20',
  };

  const exportCSV = () => {
    if (!selectedTeam) return;
    const headers = ['Player Name', 'Role', 'Country', 'Base Price (Points)', 'Sold Price (Points)'];
    const rows = teamSquad.map(p => [
      `"${p.name}"`,
      `"${p.role}"`,
      `"${p.country}"`,
      p.basePrice,
      p.soldPrice || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedTeam.shortName}_EPL_Squad_Auction.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Team Selection Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/15 text-red-600 border border-red-600/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              EPL Franchise Squads &amp; Rosters
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/15 text-red-600 border border-red-600/30 font-mono font-bold">
                10,000 PTS PURSE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Automated points balance and categorized roster breakdown</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          disabled={teamSquad.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-black dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition disabled:opacity-40 cursor-pointer shadow-sm"
        >
          <ArrowDownToLine className="w-4 h-4 text-red-600" />
          Export CSV
        </button>
      </div>

      {/* Team Tabs with Dynamic Team Primary Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {teams.map(team => {
          const isSelected = team.id === selectedTeam?.id;
          const count = players.filter(p => p.soldToTeamId === team.id).length;
          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              style={{
                borderColor: isSelected ? team.primaryColor : undefined,
              }}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-slate-100 dark:bg-zinc-900 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black shadow-lg scale-[1.02]'
                  : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-950 shadow-sm'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow shrink-0"
                style={{ backgroundColor: team.primaryColor }}
              >
                {team.shortName}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{team.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {count} players • {formatCurrency(team.remainingBudget)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Team Financial & Quota Overview */}
      {selectedTeam && (
        <div
          className="p-6 rounded-3xl glass-card shadow-2xl space-y-6 transition-all duration-300"
          style={{
            borderColor: `${selectedTeam.primaryColor}60`,
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-900">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl ring-2 ring-white/10 shrink-0"
                style={{ backgroundColor: selectedTeam.primaryColor }}
              >
                {selectedTeam.shortName}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedTeam.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  <span>Squad: <strong className="text-slate-900 dark:text-white">{teamSquad.length}</strong> / {selectedTeam.maxSquadSize}</span>
                  <span>•</span>
                  <span>Overseas: <strong className="text-slate-900 dark:text-white">{overseasCount}</strong> / {selectedTeam.maxOverseas}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-900 shadow-sm">
                <div className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase font-semibold">Remaining Purse</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatCurrency(selectedTeam.remainingBudget)}
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-900 shadow-sm">
                <div className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase font-semibold">Points Spent</div>
                <div className="text-xl font-black text-red-600 font-mono">
                  {formatCurrency(totalSpent)}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Utilization Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-zinc-400 mb-2 font-medium">
              <span>Purse Utilization: <strong className="text-slate-900 dark:text-white">{spentPercent.toFixed(1)}%</strong></span>
              <span>{formatCurrency(totalSpent)} / {formatCurrency(selectedTeam.totalBudget)}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-black rounded-full overflow-hidden border border-slate-300 dark:border-zinc-900 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${spentPercent}%`,
                  backgroundColor: selectedTeam.primaryColor,
                }}
              />
            </div>
          </div>

          {/* Role Counts Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'] as PlayerRole[]).map(r => (
              <div
                key={r}
                className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm ${roleColors[r]}`}
              >
                <span className="text-xs font-semibold">{r}</span>
                <span className="text-lg font-black">{roleCounts[r]}</span>
              </div>
            ))}
          </div>

          {/* Role Category Filters */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-900 pb-3">
            {(['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-black border border-slate-200 dark:border-zinc-900'
                }`}
              >
                {cat} {cat === 'All' ? `(${teamSquad.length})` : `(${roleCounts[cat as PlayerRole]})`}
              </button>
            ))}
          </div>

          {/* Squad Player List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSquad.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-500 dark:text-zinc-500 text-sm">
                No players purchased in this category yet.
              </div>
            ) : (
              filteredSquad.map(player => (
                <div
                  key={player.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-900 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-zinc-800 transition shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-11 h-11 rounded-xl object-cover object-top border border-slate-200 dark:border-zinc-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{player.name}</span>
                        {player.isOverseas && <span className="text-[10px] text-blue-600 dark:text-blue-400 shrink-0">✈</span>}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {player.role} • {player.country}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase">Sold For</div>
                    <div className="text-sm font-bold text-red-600 dark:text-red-400 font-mono">
                      {formatCurrency(player.soldPrice || player.basePrice)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
