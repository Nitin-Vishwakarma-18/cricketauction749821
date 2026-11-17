import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { LiveAuctionDashboard } from './components/LiveAuctionDashboard';
import { TeamSquadsView } from './components/TeamSquadsView';
import { SetupView } from './components/SetupView';
import { formatCurrency } from './utils/currency';
import { Radio, Users, Settings, Sun, Moon, Sparkles } from 'lucide-react';

const AuctionAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auction' | 'squads' | 'setup'>('auction');
  const { projectorMode, players, teams, theme, toggleTheme, logoStyle, toggleLogoStyle } = useAuction();

  const totalSold = players.filter(p => p.status === 'SOLD').length;
  const totalSpent = teams.reduce((acc, t) => acc + (t.totalBudget - t.remainingBudget), 0);

  const logoSrc = logoStyle === 'realistic' ? '/epl-logo-realistic.jpg' : '/epl-logo-transparent.png';

  return (
    <div className={`min-h-screen flex flex-col selection:bg-red-600 selection:text-white transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Header - Hidden in Projector Mode */}
      {!projectorMode && (
        <header className={`border-b sticky top-0 z-40 backdrop-blur-xl transition-colors duration-300 ${
          theme === 'dark'
            ? 'border-zinc-900 bg-black/90'
            : 'border-slate-200 bg-white/90 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            {/* Branding with New Logo & EPL Auction Name */}
            <div className="flex items-center gap-3">
              <div
                onClick={toggleLogoStyle}
                className="relative group cursor-pointer"
                title="Click to switch between Realistic 3D Logo and Classic Crest"
              >
                <img
                  src={logoSrc}
                  alt="EPL Auction Logo"
                  className="w-11 h-11 rounded-xl object-contain shadow-lg border border-red-500/30 bg-black/10 dark:bg-black/40 group-hover:scale-105 transition duration-200"
                />
                <span className="absolute -bottom-1 -right-1 p-0.5 bg-red-600 rounded-full text-white text-[8px] opacity-0 group-hover:opacity-100 transition shadow">
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-xl tracking-tight flex items-center gap-1.5 font-display">
                    <span className="text-red-600 drop-shadow">EPL</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>AUCTION</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600/15 text-red-600 border border-red-600/30 font-bold tracking-wider">
                      10,000 PTS
                    </span>
                  </h1>
                </div>
                <p className={`text-[11px] hidden sm:block ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Premier League Player Auction Platform • Real-time Purse Engine
                </p>
              </div>
            </div>

            {/* Navigation Tabs in Black & Red Theme */}
            <nav className={`flex items-center p-1 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-200/70 border-slate-300'
            }`}>
              <button
                onClick={() => setActiveTab('auction')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'auction'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${activeTab === 'auction' ? 'animate-pulse' : ''}`} />
                <span>Live Auction</span>
              </button>

              <button
                onClick={() => setActiveTab('squads')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'squads'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Squads</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                  theme === 'dark'
                    ? 'bg-black border-zinc-800 text-zinc-300'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}>
                  {totalSold}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'setup'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Registry</span>
                <span className="sm:hidden">Setup</span>
              </button>
            </nav>

            {/* Right Controls: Dark / Light Mode Switch + Metrics */}
            <div className="flex items-center gap-3">
              {/* THEME TOGGLE BUTTON (DARK <-> LIGHT) */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-700 text-amber-400 hover:bg-zinc-800 hover:text-amber-300'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                }`}
                title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span className="hidden md:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden md:inline">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Auction Ticker Metric */}
              <div className={`hidden lg:flex items-center gap-4 border-l pl-4 text-xs ${
                theme === 'dark' ? 'border-zinc-800' : 'border-slate-300'
              }`}>
                <div>
                  <span className={`font-semibold uppercase text-[10px] ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'
                  }`}>Spent</span>
                  <div className="font-bold text-red-600 font-mono">{formatCurrency(totalSpent)}</div>
                </div>
                <div>
                  <span className={`font-semibold uppercase text-[10px] ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'
                  }`}>Sold</span>
                  <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {totalSold}/{players.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${projectorMode ? 'p-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full'}`}>
        {activeTab === 'auction' && <LiveAuctionDashboard />}
        {activeTab === 'squads' && <TeamSquadsView />}
        {activeTab === 'setup' && <SetupView />}
      </main>

      {/* Footer */}
      {!projectorMode && (
        <footer className={`border-t py-4 text-center text-xs transition-colors ${
          theme === 'dark'
            ? 'border-zinc-900 bg-black text-zinc-500'
            : 'border-slate-200 bg-white text-slate-500'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>EPL Auction Platform • Premier League 10,000 Points Economy • Red &amp; Team Colors</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuctionProvider>
      <AuctionAppContent />
    </AuctionProvider>
  );
};

export default App;
