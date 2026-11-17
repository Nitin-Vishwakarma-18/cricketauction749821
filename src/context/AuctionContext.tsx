import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { Player, Team, BidRecord, AuctionHistoryAction } from '../types/auction';
import { INITIAL_TEAMS, INITIAL_PLAYERS, DEFAULT_PURSE_POINTS } from '../data/initialData';
import { sound } from '../utils/audio';
import { formatCurrency } from '../utils/currency';

const STORAGE_KEY_TEAMS = 'cricket_auction_teams_v2';
const STORAGE_KEY_PLAYERS = 'cricket_auction_players_v2';
const STORAGE_KEY_ACTIONS = 'cricket_auction_actions_v2';

interface AuctionContextType {
  teams: Team[];
  players: Player[];
  currentPlayer: Player | null;
  currentBid: number;
  highestBidder: Team | null;
  bidHistory: BidRecord[];
  isTimerRunning: boolean;
  timerSeconds: number;
  soundMuted: boolean;
  projectorMode: boolean;
  lastMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  theme: 'dark' | 'light';
  logoStyle: 'realistic' | 'edited';

  // Actions
  placeBid: (teamId: string, amount: number) => { success: boolean; error?: string };
  increaseBidBy: (increment: number, specificTeamId?: string) => { success: boolean; error?: string };
  markSold: () => boolean;
  markUnsold: () => boolean;
  undoLastAction: () => boolean;
  nextPlayer: () => void;
  prevPlayer: () => void;
  selectPlayer: (playerId: string) => void;
  startTimer: (seconds?: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  toggleSound: () => void;
  toggleProjectorMode: () => void;
  toggleTheme: () => void;
  toggleLogoStyle: () => void;
  addTeam: (team: Omit<Team, 'id' | 'remainingBudget'>) => void;
  removeTeam: (teamId: string) => void;
  addPlayer: (player: Omit<Player, 'id' | 'status' | 'order'>) => void;
  removePlayer: (playerId: string) => void;
  resetAuction: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('epl_auction_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  // Logo variant state: 'realistic' | 'edited'
  const [logoStyle, setLogoStyle] = useState<'realistic' | 'edited'>(() => {
    const saved = localStorage.getItem('epl_auction_logo_style');
    return saved === 'edited' || saved === 'realistic' ? saved : 'realistic';
  });

  // Load initial or persisted state with auto-migration to 10k points
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If old crore values are found, fall back to initial
          if (parsed[0].totalBudget > 100000) {
            return INITIAL_TEAMS;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEAMS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].basePrice > 50000) {
            return INITIAL_PLAYERS;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PLAYERS;
  });

  const [actions, setActions] = useState<AuctionHistoryAction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Active player selection
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(() => {
    const activeIdx = players.findIndex(p => p.status === 'IN_AUCTION');
    if (activeIdx !== -1) return activeIdx;
    const firstUpcoming = players.findIndex(p => p.status === 'UPCOMING');
    return firstUpcoming !== -1 ? firstUpcoming : 0;
  });

  const currentPlayer = players[currentPlayerIndex] || null;

  // Active bidding state on current player
  const [currentBid, setCurrentBid] = useState<number>(currentPlayer ? currentPlayer.basePrice : 0);
  const [currentHighestBidderId, setCurrentHighestBidderId] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<BidRecord[]>([]);

  // Auction Controls & Timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sync theme to root class and localStorage
  useEffect(() => {
    localStorage.setItem('epl_auction_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('epl_auction_logo_style', logoStyle);
  }, [logoStyle]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(actions));
  }, [actions]);

  // When current player changes, reset the hammer state
  useEffect(() => {
    if (currentPlayer) {
      if (currentPlayer.status === 'SOLD' && currentPlayer.soldPrice) {
        setCurrentBid(currentPlayer.soldPrice);
        setCurrentHighestBidderId(currentPlayer.soldToTeamId || null);
      } else {
        setCurrentBid(currentPlayer.basePrice);
        setCurrentHighestBidderId(null);
      }
      setBidHistory([]);
      setIsTimerRunning(false);
      setTimerSeconds(20);
    }
  }, [currentPlayerIndex, players.length]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playHammer();
            return 0;
          }
          if (prev <= 4) {
            sound.playHammer(); // warning tick on last 3 seconds
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const highestBidder = teams.find(t => t.id === currentHighestBidderId) || null;

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setLastMessage({ type, text });
    setTimeout(() => {
      setLastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLogoStyle = () => {
    setLogoStyle(prev => (prev === 'realistic' ? 'edited' : 'realistic'));
  };

  /**
   * Place Bid logic with automated validation rules (Points System)
   */
  const placeBid = (teamId: string, amount: number): { success: boolean; error?: string } => {
    if (!currentPlayer) {
      return { success: false, error: 'No player currently on auction hammer.' };
    }

    if (currentPlayer.status === 'SOLD') {
      return { success: false, error: 'Player is already sold.' };
    }

    const team = teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, error: 'Team not found.' };
    }

    // Validation 1: Budget sufficiency
    if (amount > team.remainingBudget) {
      const err = `${team.name} has insufficient points! Available: ${formatCurrency(team.remainingBudget)}, Bid: ${formatCurrency(amount)}`;
      showNotification('error', err);
      return { success: false, error: err };
    }

    // Validation 2: Squad size limit
    const currentSquad = players.filter(p => p.soldToTeamId === team.id);
    if (currentSquad.length >= team.maxSquadSize) {
      const err = `${team.name} has already reached maximum squad limit of ${team.maxSquadSize} players!`;
      showNotification('error', err);
      return { success: false, error: err };
    }

    // Validation 3: Overseas limit
    if (currentPlayer.isOverseas) {
      const overseasCount = currentSquad.filter(p => p.isOverseas).length;
      if (overseasCount >= team.maxOverseas) {
        const err = `${team.name} has reached maximum overseas quota (${team.maxOverseas})!`;
        showNotification('error', err);
        return { success: false, error: err };
      }
    }

    // Validation 4: Must exceed current bid (or equal base price on first bid)
    if (currentHighestBidderId !== null && amount <= currentBid) {
      const err = `Bid must exceed current highest bid of ${formatCurrency(currentBid)}`;
      showNotification('error', err);
      return { success: false, error: err };
    }

    // Passed validations: register bid!
    const newRecord: BidRecord = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      playerId: currentPlayer.id,
      teamId: team.id,
      teamName: team.name,
      teamShortName: team.shortName,
      teamColor: team.primaryColor,
      amount,
      timestamp: Date.now(),
    };

    setCurrentBid(amount);
    setCurrentHighestBidderId(team.id);
    setBidHistory(prev => [newRecord, ...prev]);

    // Reset countdown timer to 15s for the next bid
    setTimerSeconds(15);
    setIsTimerRunning(true);

    sound.playBid();
    showNotification('info', `${team.shortName} raised bid to ${formatCurrency(amount)}`);

    return { success: true };
  };

  /**
   * Helper to increase bid by specified increment
   */
  const increaseBidBy = (increment: number, specificTeamId?: string): { success: boolean; error?: string } => {
    const targetTeamId = specificTeamId || currentHighestBidderId;
    if (!targetTeamId) {
      showNotification('error', 'Select a team first to place the bid.');
      return { success: false, error: 'Select a team paddle first.' };
    }

    const nextAmount = (currentHighestBidderId === null && currentBid === currentPlayer?.basePrice)
      ? currentPlayer.basePrice
      : currentBid + increment;

    return placeBid(targetTeamId, nextAmount);
  };

  /**
   * Mark as SOLD: Automates budget deduction, roster assignment, sound & visual fanfare
   */
  const markSold = (): boolean => {
    if (!currentPlayer) return false;

    if (!currentHighestBidderId) {
      showNotification('error', 'Cannot sell without a bidding team! Place at least one bid.');
      return false;
    }

    const winningTeam = teams.find(t => t.id === currentHighestBidderId);
    if (!winningTeam) return false;

    // Deduct points budget atomically
    const finalAmount = currentBid;
    const prevBudget = winningTeam.remainingBudget;

    setTeams(prevTeams =>
      prevTeams.map(t =>
        t.id === winningTeam.id
          ? { ...t, remainingBudget: t.remainingBudget - finalAmount }
          : t
      )
    );

    // Update player status
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === currentPlayer.id
          ? {
              ...p,
              status: 'SOLD',
              soldPrice: finalAmount,
              soldToTeamId: winningTeam.id,
            }
          : p
      )
    );

    // Save history for UNDO
    const historyItem: AuctionHistoryAction = {
      id: `act-${Date.now()}`,
      type: 'SOLD',
      playerId: currentPlayer.id,
      teamId: winningTeam.id,
      amount: finalAmount,
      previousTeamRemainingBudget: prevBudget,
      timestamp: Date.now(),
    };
    setActions(prev => [historyItem, ...prev]);

    setIsTimerRunning(false);

    // Audio & Confetti Celebrations
    sound.playSold();
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: [winningTeam.primaryColor, '#ef4444', '#ffffff', '#dc2626'],
    });

    showNotification('success', `SOLD! ${currentPlayer.name} joins ${winningTeam.name} for ${formatCurrency(finalAmount)}!`);
    return true;
  };

  /**
   * Mark as UNSOLD
   */
  const markUnsold = (): boolean => {
    if (!currentPlayer) return false;

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === currentPlayer.id
          ? { ...p, status: 'UNSOLD', soldPrice: undefined, soldToTeamId: undefined }
          : p
      )
    );

    const historyItem: AuctionHistoryAction = {
      id: `act-${Date.now()}`,
      type: 'UNSOLD',
      playerId: currentPlayer.id,
      timestamp: Date.now(),
    };
    setActions(prev => [historyItem, ...prev]);

    setIsTimerRunning(false);
    sound.playUnsold();
    showNotification('info', `${currentPlayer.name} goes UNSOLD.`);
    return true;
  };

  /**
   * Full UNDO engine: rolls back budget and roster status safely
   */
  const undoLastAction = (): boolean => {
    if (actions.length === 0) {
      showNotification('error', 'No auction actions to undo.');
      return false;
    }

    const [lastAction, ...remainingActions] = actions;
    setActions(remainingActions);

    if (lastAction.type === 'SOLD' && lastAction.teamId && lastAction.amount) {
      // Refund winning team points
      setTeams(prevTeams =>
        prevTeams.map(t =>
          t.id === lastAction.teamId
            ? { ...t, remainingBudget: t.remainingBudget + lastAction.amount! }
            : t
        )
      );

      // Revert player to UPCOMING / IN_AUCTION
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === lastAction.playerId
            ? { ...p, status: 'IN_AUCTION', soldPrice: undefined, soldToTeamId: undefined }
            : p
        )
      );

      // Jump back to that player
      const targetIdx = players.findIndex(p => p.id === lastAction.playerId);
      if (targetIdx !== -1) {
        setCurrentPlayerIndex(targetIdx);
      }

      showNotification('info', 'Undo successful: Player sale reversed and points refunded.');
      return true;
    }

    if (lastAction.type === 'UNSOLD') {
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === lastAction.playerId
            ? { ...p, status: 'IN_AUCTION' }
            : p
        )
      );
      const targetIdx = players.findIndex(p => p.id === lastAction.playerId);
      if (targetIdx !== -1) {
        setCurrentPlayerIndex(targetIdx);
      }
      showNotification('info', 'Undo successful: Player unsold status reversed.');
      return true;
    }

    return false;
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    }
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(prev => prev - 1);
    }
  };

  const selectPlayer = (playerId: string) => {
    const idx = players.findIndex(p => p.id === playerId);
    if (idx !== -1) {
      setCurrentPlayerIndex(idx);
    }
  };

  const startTimer = (seconds = 20) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(20);
  };

  const toggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const toggleProjectorMode = () => {
    setProjectorMode(prev => !prev);
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'remainingBudget'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      totalBudget: teamData.totalBudget || DEFAULT_PURSE_POINTS,
      remainingBudget: teamData.totalBudget || DEFAULT_PURSE_POINTS,
    };
    setTeams(prev => [...prev, newTeam]);
    showNotification('success', `Team "${newTeam.name}" registered with ${formatCurrency(newTeam.totalBudget)} purse.`);
  };

  const removeTeam = (teamId: string) => {
    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam) return;

    // Reset any players that belonged to this deleted team
    setPlayers(prev =>
      prev.map(p =>
        p.soldToTeamId === teamId
          ? { ...p, status: 'IN_AUCTION', soldToTeamId: undefined, soldPrice: undefined }
          : p
      )
    );

    // If highest bidder on active hammer was this team, reset highest bidder
    if (currentHighestBidderId === teamId) {
      setCurrentHighestBidderId(null);
      if (currentPlayer) {
        setCurrentBid(currentPlayer.basePrice);
      }
    }

    // Remove from team list
    setTeams(prev => prev.filter(t => t.id !== teamId));
    showNotification('info', `Franchise "${targetTeam.name}" removed from auction.`);
  };

  const addPlayer = (playerData: Omit<Player, 'id' | 'status' | 'order'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}`,
      status: 'UPCOMING',
      order: players.length + 1,
    };
    setPlayers(prev => [...prev, newPlayer]);
    showNotification('success', `Player "${newPlayer.name}" added to auction pool.`);
  };

  const removePlayer = (playerId: string) => {
    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer) return;

    // If player was sold, refund the points to the purchasing team
    if (targetPlayer.status === 'SOLD' && targetPlayer.soldToTeamId && targetPlayer.soldPrice) {
      setTeams(prev =>
        prev.map(t =>
          t.id === targetPlayer.soldToTeamId
            ? { ...t, remainingBudget: t.remainingBudget + targetPlayer.soldPrice! }
            : t
        )
      );
    }

    // Remove player & reorder remaining
    const updatedPlayers = players
      .filter(p => p.id !== playerId)
      .map((p, index) => ({ ...p, order: index + 1 }));

    setPlayers(updatedPlayers);

    // Adjust active index if removing current or edge
    if (currentPlayerIndex >= updatedPlayers.length) {
      setCurrentPlayerIndex(Math.max(0, updatedPlayers.length - 1));
    }

    showNotification('info', `Player "${targetPlayer.name}" removed from roster.`);
  };

  const resetAuction = () => {
    if (window.confirm('Reset auction state? This will clear all sales and restore team budgets to 10,000 points.')) {
      setTeams(INITIAL_TEAMS);
      setPlayers(INITIAL_PLAYERS);
      setActions([]);
      setCurrentPlayerIndex(0);
      localStorage.removeItem(STORAGE_KEY_TEAMS);
      localStorage.removeItem(STORAGE_KEY_PLAYERS);
      localStorage.removeItem(STORAGE_KEY_ACTIONS);
      showNotification('info', 'Auction pool reset to default 10,000 points.');
    }
  };

  return (
    <AuctionContext.Provider
      value={{
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
        logoStyle,
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
        toggleTheme,
        toggleLogoStyle,
        addTeam,
        removeTeam,
        addPlayer,
        removePlayer,
        resetAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = (): AuctionContextType => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
