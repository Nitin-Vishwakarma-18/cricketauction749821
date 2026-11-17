import React, { useState } from 'react';
import {
  Gavel,
  CheckCircle,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Clock,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency, getRecommendedIncrements } from '../utils/currency';
import { PlayerRole } from '../types/auction';

export const LiveAuctionDashboard: React.FC = () => {
  const {
    teams,
    players,
    currentPlayer,
    currentBid,
    highestBidder,
    bidHistory,
    isTimerRunning,
    timerSeconds,
    soundMuted,
    projectorMode,
    lastMessage,
    theme,
    placeBid,
    increaseBidBy,
    markSold,
    markUnsold,
    undoLastAction,
    nextPlayer,
    prevPlayer,
    selectPlayer,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSound,
    toggleProjectorMode,
  } = useAuction();

  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [selectedPaddleTeamId, setSelectedPaddleTeamId] = useState<string | null>(null);

  if (!currentPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-900 shadow-xl">
        <Award className="w-16 h-16 text-red-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Players in Auction Pool</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-2">Add players to the registry to begin the EPL live auction.</p>
      </div>
    );
  }

  const roleBadgeColors: Record<PlayerRole, string> = {
    'Batsman': 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/80 dark:text-blue-400 dark:border-blue-500/30',
    'Bowler': 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/80 dark:text-red-400 dark:border-red-500/30',
    'All-Rounder': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-500/30',
    'Wicketkeeper': 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500/30',
  };

  const increments = getRecommendedIncrements(currentBid);

  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTeamId = selectedPaddleTeamId || highestBidder?.id;
    if (!targetTeamId) {
      alert('Please click on a franchise paddle first to select which team is bidding.');
      return;
    }

    const numericAmount = parseInt(customBidAmount, 10); // entered in Points
    if (isNaN(numericAmount) || numericAmount <= currentBid) {
      alert(`Custom bid must be greater than current bid of ${formatCurrency(currentBid)}`);
      return;
    }

    placeBid(targetTeamId, numericAmount);
    setCustomBidAmount('');
  };

  const getTeamSquadCount = (teamId: string) => {
    return players.filter(p => p.soldToTeamId === teamId).length;
  };

  const canTeamAfford = (teamRemainingBudget: number, targetAmount: number) => {
    return teamRemainingBudget >= targetAmount;
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'max-w-[1920px] mx-auto px-6 py-4' : ''}`}>
      {/* Toast Notification Banner */}
      {lastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-top-4 duration-300 ${
            lastMessage.type === 'success'
              ? 'bg-emerald-900/95 border-emerald-500/50 text-white'
              : lastMessage.type === 'error'
              ? 'bg-red-900/95 border-red-500/60 text-white'
              : 'bg-slate-900/95 dark:bg-zinc-900/95 border-red-500/40 text-white'
          }`}
        >
          {lastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {lastMessage.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400" />}
          {lastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-red-400" />}
          <span className="font-medium text-sm sm:text-base">{lastMessage.text}</span>
        </div>
      )}

      {/* Top Quick-Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            Live Broadcast
          </div>
          <span className="text-slate-600 dark:text-zinc-400 text-sm hidden sm:inline">
            EPL Round: <strong className="text-slate-900 dark:text-white">Active Pool</strong> | Player #{currentPlayer.order} of {players.length}
          </span>
        </div>

        {/* Center Quick Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPlayer}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-black dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-white transition cursor-pointer"
            title="Previous Player"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <select
            value={currentPlayer.id}
            onChange={(e) => selectPlayer(e.target.value)}
            className="bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 text-sm rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.order} {p.name} ({p.role}) - {p.status}
              </option>
            ))}
          </select>
          <button
            onClick={nextPlayer}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-black dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-white transition cursor-pointer"
            title="Next Player"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          {/* Gavel Countdown Display */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-black border border-slate-300 dark:border-zinc-800 shadow-sm">
            <Clock className={`w-4 h-4 ${timerSeconds <= 5 ? 'text-red-600 animate-pulse' : 'text-slate-500 dark:text-zinc-400'}`} />
            <span
              className={`font-mono font-bold text-lg ${
                timerSeconds <= 5 ? 'text-red-600 animate-pulse font-extrabold' : 'text-slate-900 dark:text-white'
              }`}
            >
              {timerSeconds}s
            </span>
            <div className="flex items-center gap-1 ml-1 border-l border-slate-300 dark:border-zinc-800 pl-2">
              {isTimerRunning ? (
                <button
                  onClick={pauseTimer}
                  className="p-1 hover:text-red-600 text-slate-500 dark:text-zinc-400 cursor-pointer"
                  title="Pause Clock"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => startTimer(timerSeconds || 15)}
                  className="p-1 hover:text-emerald-600 text-slate-500 dark:text-zinc-400 cursor-pointer"
                  title="Resume Clock"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={resetTimer}
                className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-400 dark:text-zinc-500 cursor-pointer"
                title="Reset Clock to 20s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sound & Projector Toggles */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              soundMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-600'
                : 'bg-slate-100 dark:bg-black border-slate-300 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-white'
            }`}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio Effects'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleProjectorMode}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              projectorMode
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-slate-100 dark:bg-black border-slate-300 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-white'
            }`}
            title="Toggle Big Screen Projector Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={undoLastAction}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-black hover:bg-slate-200 dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
            title="Undo Last Sold / Unsold Action"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Undo</span>
          </button>
        </div>
      </div>

      {/* Main Broadcast Stage (Hero Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player Card (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="relative rounded-3xl overflow-hidden glass-card shadow-2xl group transition-all duration-500"
            style={{
              borderColor: highestBidder ? `${highestBidder.primaryColor}90` : 'rgba(220, 38, 38, 0.4)',
            }}
          >
            {/* Dynamic Background Aura: Team Color or Fiery Red */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none transition-all duration-700"
              style={{
                backgroundColor: highestBidder ? highestBidder.primaryColor : '#dc2626',
              }}
            />

            {/* Status Ribbon */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-lg ${
                  currentPlayer.status === 'SOLD'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : currentPlayer.status === 'UNSOLD'
                    ? 'bg-red-600 text-white border-red-400'
                    : 'bg-red-600 text-white border-red-500 font-extrabold animate-pulse shadow-red-600/50'
                }`}
              >
                {currentPlayer.status === 'IN_AUCTION' ? 'ON THE HAMMER' : currentPlayer.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadgeColors[currentPlayer.role]}`}>
                {currentPlayer.role}
              </span>
            </div>

            {/* Overseas / Domestic Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/80 border border-zinc-700 text-white backdrop-blur-md shadow">
                {currentPlayer.isOverseas ? '✈ Overseas' : '🇬🇧 Domestic'}
              </span>
            </div>

            {/* Player Photo Showcase */}
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-gradient-to-b from-zinc-800 to-black flex items-end justify-center">
              <img
                src={currentPlayer.photoUrl}
                alt={currentPlayer.name}
                className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Player Name Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-red-400 text-sm font-tech font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {currentPlayer.country}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentPlayer.name}
                </h1>
                {currentPlayer.stats.specialty && (
                  <p className="text-zinc-200 text-xs sm:text-sm mt-1 line-clamp-1 italic">
                    "{currentPlayer.stats.specialty}"
                  </p>
                )}
              </div>
            </div>

            {/* Player Performance Stats Grid */}
            <div className="p-6 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-zinc-900 transition-colors">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Matches</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.matches}</div>
                </div>

                {currentPlayer.role === 'Bowler' ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Wickets</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.wickets ?? '-'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Economy</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.economy ?? '-'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Best</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.bestBowling ?? '-'}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Runs</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.runs ?? '-'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Strike Rate</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.strikeRate ?? '-'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-sm">
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">HS</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentPlayer.stats.highestScore ?? '-'}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Live Auction Engine & Bidding Deck (Col 6-12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Big Bid Spotlight Card */}
          <div
            className="relative rounded-3xl p-6 sm:p-8 glass-card shadow-2xl overflow-hidden transition-all duration-500"
            style={{
              borderColor: highestBidder ? `${highestBidder.primaryColor}90` : 'rgba(220, 38, 38, 0.4)',
            }}
          >
            {/* Dynamic Light Background Accent */}
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{
                backgroundColor: highestBidder ? highestBidder.primaryColor : '#dc2626',
              }}
            />

            {/* Base vs Current Bid Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-900 pb-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">Base Price</span>
                <div className="text-xl font-bold text-slate-800 dark:text-zinc-300 mt-0.5">
                  {formatCurrency(currentPlayer.basePrice, { fullLabel: true })}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-red-600 dark:text-red-500 font-bold flex items-center justify-end gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Current Standing Bid
                </span>
                <div className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 dark:from-red-400 dark:via-rose-300 dark:to-white tracking-tight drop-shadow font-display">
                  {formatCurrency(currentBid)}
                </div>
              </div>
            </div>

            {/* Leading Franchise Spotlight */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                {highestBidder ? (
                  <>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl ring-2 ring-white/20 shrink-0"
                      style={{ backgroundColor: highestBidder.primaryColor }}
                    >
                      {highestBidder.shortName}
                    </div>
                    <div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                        Current Highest Bidder
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {highestBidder.name}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-slate-400 dark:text-zinc-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-600 font-bold">
                      --
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No Bids Placed Yet</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-500">Awaiting opening bid at base price ({formatCurrency(currentPlayer.basePrice)})</div>
                    </div>
                  </div>
                )}
              </div>

              {highestBidder && (
                <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-zinc-900 sm:pl-5">
                  <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Franchise Purse Left</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(highestBidder.remainingBudget - (currentPlayer.status === 'SOLD' ? 0 : currentBid))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Increment Buttons in Points */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase">
                <span>Quick Increments (+Points)</span>
                {selectedPaddleTeamId && (
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    Active paddle: <strong>{teams.find(t => t.id === selectedPaddleTeamId)?.shortName}</strong>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {increments.map((inc) => (
                  <button
                    key={inc.value}
                    onClick={() => increaseBidBy(inc.value, selectedPaddleTeamId || undefined)}
                    disabled={currentPlayer.status === 'SOLD'}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 dark:bg-black hover:bg-red-50 dark:hover:bg-red-950/60 border border-slate-300 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-600/60 text-slate-800 dark:text-zinc-200 hover:text-red-600 dark:hover:text-white shadow-sm active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-500" />
                    {inc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bid Entry Form in Points */}
            <form onSubmit={handleCustomBidSubmit} className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  placeholder={`Custom Bid in Points (e.g. ${currentBid + 500})`}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-red-600 dark:text-red-400 font-bold">PTS</span>
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white transition shadow-md shadow-red-600/30 cursor-pointer"
              >
                Place Custom
              </button>
            </form>
          </div>

          {/* Franchise Bidding Paddles Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-600 dark:text-red-500" />
                Team Bidding Paddles (Click to Raise Bid)
              </h3>
              <span className="text-xs text-slate-500 dark:text-zinc-500">10,000 Points Purse</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {teams.map((team) => {
                const nextBidPrice = (highestBidder === null && currentBid === currentPlayer.basePrice)
                  ? currentPlayer.basePrice
                  : currentBid + increments[0].value;
                const isAffordable = canTeamAfford(team.remainingBudget, nextBidPrice);
                const squadCount = getTeamSquadCount(team.id);
                const isLeader = highestBidder?.id === team.id;
                const isSelectedPaddle = selectedPaddleTeamId === team.id;

                return (
                  <div
                    key={team.id}
                    onClick={() => {
                      if (!isAffordable) return;
                      setSelectedPaddleTeamId(team.id);
                      placeBid(team.id, nextBidPrice);
                    }}
                    style={{
                      borderColor: isLeader ? team.primaryColor : isSelectedPaddle ? '#dc2626' : undefined,
                    }}
                    className={`relative p-3.5 rounded-2xl border transition-all select-none ${
                      isLeader
                        ? 'bg-slate-100 dark:bg-zinc-900 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black shadow-lg scale-[1.02]'
                        : isSelectedPaddle
                        ? 'bg-red-50 dark:bg-zinc-900 border-red-500'
                        : isAffordable
                        ? 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800/80 hover:border-red-400 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-950 cursor-pointer active:scale-95 shadow-sm'
                        : 'bg-slate-100 dark:bg-zinc-950/40 border-slate-200 dark:border-zinc-900 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isLeader && (
                      <span
                        className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        LEADING
                      </span>
                    )}

                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow shrink-0"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.shortName}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{team.name}</div>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Purse: {formatCurrency(team.remainingBudget)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-zinc-900 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                      <span>Squad: {squadCount}/{team.maxSquadSize}</span>
                      {!isAffordable ? (
                        <span className="text-red-600 dark:text-red-400 font-bold">Low Purse</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 hover:underline font-semibold flex items-center">
                          Raise <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Decision Controls Bar */}
          <div className="p-5 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* SOLD BUTTON */}
              <button
                onClick={markSold}
                disabled={!highestBidder || currentPlayer.status === 'SOLD'}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-950/40 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Gavel className="w-5 h-5 animate-hammer" />
                <span>Sold to {highestBidder ? highestBidder.shortName : '...'}</span>
              </button>

              {/* UNSOLD BUTTON */}
              <button
                onClick={markUnsold}
                disabled={currentPlayer.status === 'SOLD'}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-slate-100 dark:bg-black hover:bg-red-50 dark:hover:bg-red-950/80 hover:text-red-600 dark:hover:text-red-400 border border-slate-300 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-600/50 text-slate-700 dark:text-zinc-300 shadow-md active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Mark Unsold</span>
              </button>
            </div>

            {/* Next Player Shortcut */}
            <button
              onClick={nextPlayer}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-black hover:bg-slate-200 dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition cursor-pointer"
            >
              <span>Next Player In Pool</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Hammer Bid History Ticker */}
          {bidHistory.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-900 shadow-sm">
              <div className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                Hammer Bid Trail
              </div>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {bidHistory.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                  >
                    <span className="font-bold text-slate-500 dark:text-zinc-400">#{bidHistory.length - idx}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow"
                      style={{ backgroundColor: item.teamColor }}
                    >
                      {item.teamShortName}
                    </span>
                    <span className="font-bold text-red-600 dark:text-red-400 font-mono">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
