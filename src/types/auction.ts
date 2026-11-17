export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';

export type PlayerStatus = 'UPCOMING' | 'IN_AUCTION' | 'SOLD' | 'UNSOLD';

export interface PlayerStats {
  matches: number;
  runs?: number;
  wickets?: number;
  strikeRate?: number;
  economy?: number;
  highestScore?: string;
  bestBowling?: string;
  rating?: number;
  specialty?: string;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  country: string;
  basePrice: number; // in Points
  soldPrice?: number;
  soldToTeamId?: string;
  status: PlayerStatus;
  photoUrl: string;
  isOverseas: boolean;
  order: number;
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  totalBudget: number; // in Points (default: 10,000 Points)
  remainingBudget: number; // in Points
  maxSquadSize: number;
  maxOverseas: number;
}

export interface BidRecord {
  id: string;
  playerId: string;
  teamId: string;
  teamName: string;
  teamShortName: string;
  teamColor: string;
  amount: number; // in Points
  timestamp: number;
}

export interface AuctionHistoryAction {
  id: string;
  type: 'SOLD' | 'UNSOLD';
  playerId: string;
  teamId?: string;
  amount?: number;
  previousTeamRemainingBudget?: number;
  timestamp: number;
}
