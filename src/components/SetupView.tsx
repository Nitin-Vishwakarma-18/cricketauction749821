import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { PlayerRole } from '../types/auction';
import { formatCurrency } from '../utils/currency';
import { DEFAULT_PURSE_POINTS } from '../data/initialData';
import { ShieldCheck, UserPlus, RefreshCw, Trash2, Users } from 'lucide-react';

export const SetupView: React.FC = () => {
  const { teams, players, addTeam, removeTeam, addPlayer, removePlayer, resetAuction, theme } = useAuction();

  // Tab: 'players' | 'teams'
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');

  // Team Form State
  const [teamName, setTeamName] = useState('');
  const [teamShortName, setTeamShortName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#dc2626'); // Default Crimson Red
  const [budgetPoints, setBudgetPoints] = useState(DEFAULT_PURSE_POINTS.toString());

  // Player Form State
  const [playerName, setPlayerName] = useState('');
  const [role, setRole] = useState<PlayerRole>('Batsman');
  const [country, setCountry] = useState('England');
  const [basePricePoints, setBasePricePoints] = useState('1000'); // 1,000 Points
  const [isOverseas, setIsOverseas] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamShortName.trim()) return;

    const points = parseInt(budgetPoints, 10) || DEFAULT_PURSE_POINTS;

    addTeam({
      name: teamName.trim(),
      shortName: teamShortName.trim().toUpperCase(),
      primaryColor,
      secondaryColor: '#000000',
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
      totalBudget: points,
      maxSquadSize: 25,
      maxOverseas: 8,
    });

    setTeamName('');
    setTeamShortName('');
    setBudgetPoints(DEFAULT_PURSE_POINTS.toString());
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const price = parseInt(basePricePoints, 10) || 500;

    addPlayer({
      name: playerName.trim(),
      role,
      country: country.trim() || 'England',
      basePrice: price,
      isOverseas,
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      stats: {
        matches: 0,
        runs: 0,
        wickets: 0,
        strikeRate: 0,
        specialty: specialty.trim() || `${role} Specialist`,
      },
    });

    setPlayerName('');
    setPhotoUrl('');
    setSpecialty('');
    setBasePricePoints('1000');
  };

  const handleRemoveTeam = (teamId: string, teamName: string) => {
    if (window.confirm(`Are you sure you want to remove team "${teamName}"? Any players bought by this team will return to the auction pool.`)) {
      removeTeam(teamId);
    }
  };

  const handleRemovePlayer = (playerId: string, playerName: string) => {
    if (window.confirm(`Are you sure you want to remove player "${playerName}"? If sold, points will be refunded to the team.`)) {
      removePlayer(playerId);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with Theme Adaptation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            EPL Auction Registry &amp; Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Add or remove Premier League franchises and players • 10,000 Points purse system
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-200/80 dark:bg-black border border-slate-300 dark:border-zinc-800 p-1">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'players'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Players ({players.length})
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Franchises ({teams.length})
            </button>
          </div>

          <button
            onClick={resetAuction}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-300 dark:border-red-800/50 text-xs font-semibold text-red-700 dark:text-red-300 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Pool (10k Pts)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registration Forms */}
        <div className="lg:col-span-5">
          {activeTab === 'players' ? (
            <div className="p-6 rounded-3xl glass-card space-y-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm uppercase tracking-wider">
                <UserPlus className="w-4 h-4" />
                Register New EPL Player
              </div>

              <form onSubmit={handleAddPlayer} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Player Full Name</label>
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Bukayo Saka"
                    className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Playing Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as PlayerRole)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Batsman">Forward / Batsman</option>
                      <option value="Bowler">Defender / Bowler</option>
                      <option value="All-Rounder">Midfielder / All-Rounder</option>
                      <option value="Wicketkeeper">Goalkeeper / Keeper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. England"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Base Price (Points)</label>
                    <input
                      type="number"
                      step="50"
                      min="50"
                      max="10000"
                      required
                      value={basePricePoints}
                      onChange={(e) => setBasePricePoints(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 block">Default 1,000 PTS</span>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={isOverseas}
                        onChange={(e) => setIsOverseas(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-xs font-semibold">Overseas Player</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Specialty Description</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Explosive Winger &amp; Set-Piece Specialist"
                    className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Add Player to EPL Pool
                </button>
              </form>
            </div>
          ) : (
            /* Add Team Form */
            <div className="p-6 rounded-3xl glass-card space-y-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Register New EPL Franchise
              </div>

              <form onSubmit={handleAddTeam} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Arsenal FC"
                    className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Short Name (Code)</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={teamShortName}
                      onChange={(e) => setTeamShortName(e.target.value)}
                      placeholder="e.g. ARS"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Purse (Points)</label>
                    <input
                      type="number"
                      required
                      value={budgetPoints}
                      onChange={(e) => setBudgetPoints(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 block">Default: 10,000 Points</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Franchise Color Accent</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">{primaryColor}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Create EPL Franchise
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Existing Records with Remove/Delete Option */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600 dark:text-red-500" />
                {activeTab === 'players' ? `Active Player Pool (${players.length})` : `Registered EPL Teams (${teams.length})`}
              </h3>
              <span className="text-xs text-slate-500 dark:text-zinc-500">Click the trash icon to remove</span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {activeTab === 'players' ? (
                players.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-zinc-500 text-sm">
                    No players registered. Add players using the form on the left.
                  </div>
                ) : (
                  players.map(p => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover object-top border border-slate-200 dark:border-zinc-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                            <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">#{p.order}</span>
                            <span className="truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">({p.country})</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-2">
                            <span>{p.role}</span>
                            <span>•</span>
                            <span>Base: <strong className="text-red-600 dark:text-red-400">{formatCurrency(p.basePrice)}</strong></span>
                            {p.isOverseas && <span className="text-[10px] text-blue-600 dark:text-blue-400">✈ Overseas</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'SOLD'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                              : p.status === 'UNSOLD'
                              ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                              : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          {p.status}
                        </span>

                        {/* Remove Player Button */}
                        <button
                          onClick={() => handleRemovePlayer(p.id, p.name)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 dark:bg-zinc-900 dark:hover:bg-red-950/80 border border-slate-200 hover:border-red-400 dark:border-zinc-800 dark:hover:border-red-600/50 text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition cursor-pointer"
                          title={`Remove ${p.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                teams.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-zinc-500 text-sm">
                    No franchises registered. Add a team using the form on the left.
                  </div>
                ) : (
                  teams.map(t => {
                    const squadMembers = players.filter(p => p.soldToTeamId === t.id);
                    return (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow"
                            style={{ backgroundColor: t.primaryColor }}
                          >
                            {t.shortName}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{t.name}</div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                              Squad: {squadMembers.length}/{t.maxSquadSize} • Initial Purse: {formatCurrency(t.totalBudget)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase">Available</div>
                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              {formatCurrency(t.remainingBudget)}
                            </div>
                          </div>

                          {/* Remove Team Button */}
                          <button
                            onClick={() => handleRemoveTeam(t.id, t.name)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 dark:bg-zinc-900 dark:hover:bg-red-950/80 border border-slate-200 hover:border-red-400 dark:border-zinc-800 dark:hover:border-red-600/50 text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition cursor-pointer"
                            title={`Remove franchise ${t.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
