import { Player, Team } from '../types/auction';

export const DEFAULT_PURSE_POINTS = 10000;

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    primaryColor: '#facc15', // Gold / Yellow
    secondaryColor: '#1e3a8a',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
  {
    id: 'team-mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    primaryColor: '#2563eb', // Royal Blue
    secondaryColor: '#f59e0b',
    logoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
  {
    id: 'team-rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    primaryColor: '#dc2626', // Crimson Red
    secondaryColor: '#000000',
    logoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
  {
    id: 'team-kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    primaryColor: '#7c3aed', // Purple & Gold
    secondaryColor: '#facc15',
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
  {
    id: 'team-rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    primaryColor: '#ec4899', // Pink & Blue
    secondaryColor: '#1d4ed8',
    logoUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
  {
    id: 'team-srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    primaryColor: '#ea580c', // Bright Orange
    secondaryColor: '#000000',
    logoUrl: 'https://images.unsplash.com/photo-1489944445391-11dd35574ca6?w=120&auto=format&fit=crop&q=80',
    totalBudget: DEFAULT_PURSE_POINTS, // 10,000 Points
    remainingBudget: DEFAULT_PURSE_POINTS,
    maxSquadSize: 25,
    maxOverseas: 8,
  },
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Virat Kohli',
    role: 'Batsman',
    country: 'India',
    basePrice: 2000, // 2,000 Points
    status: 'IN_AUCTION',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 1,
    stats: {
      matches: 252,
      runs: 8004,
      strikeRate: 131.97,
      highestScore: '113',
      specialty: 'Right-hand Top Order Anchor & Chaser',
      rating: 98,
    },
  },
  {
    id: 'player-2',
    name: 'Jasprit Bumrah',
    role: 'Bowler',
    country: 'India',
    basePrice: 2000, // 2,000 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 2,
    stats: {
      matches: 133,
      wickets: 165,
      economy: 7.30,
      bestBowling: '5/10',
      specialty: 'Right-arm Fast Death-Overs Specialist',
      rating: 99,
    },
  },
  {
    id: 'player-3',
    name: 'Heinrich Klaasen',
    role: 'Wicketkeeper',
    country: 'South Africa',
    basePrice: 1500, // 1,500 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    isOverseas: true,
    order: 3,
    stats: {
      matches: 35,
      runs: 993,
      strikeRate: 168.31,
      highestScore: '104*',
      specialty: 'Explosive Spin Destroyer & Gloveman',
      rating: 95,
    },
  },
  {
    id: 'player-4',
    name: 'Hardik Pandya',
    role: 'All-Rounder',
    country: 'India',
    basePrice: 1500, // 1,500 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 4,
    stats: {
      matches: 137,
      runs: 2525,
      wickets: 64,
      strikeRate: 145.86,
      economy: 8.92,
      specialty: 'Pace-Bowling All-Rounder & Finisher',
      rating: 94,
    },
  },
  {
    id: 'player-5',
    name: 'Travis Head',
    role: 'Batsman',
    country: 'Australia',
    basePrice: 1500, // 1,500 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    isOverseas: true,
    order: 5,
    stats: {
      matches: 25,
      runs: 772,
      strikeRate: 182.50,
      highestScore: '102',
      specialty: 'High-Octane Powerplay Destroyer',
      rating: 96,
    },
  },
  {
    id: 'player-6',
    name: 'Rashid Khan',
    role: 'Bowler',
    country: 'Afghanistan',
    basePrice: 1500, // 1,500 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    isOverseas: true,
    order: 6,
    stats: {
      matches: 121,
      wickets: 149,
      economy: 6.82,
      bestBowling: '4/24',
      specialty: 'Mystery Leg-Spin & Hard Hitter',
      rating: 97,
    },
  },
  {
    id: 'player-7',
    name: 'Rishabh Pant',
    role: 'Wicketkeeper',
    country: 'India',
    basePrice: 1500, // 1,500 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 7,
    stats: {
      matches: 111,
      runs: 3284,
      strikeRate: 148.93,
      highestScore: '128*',
      specialty: 'Fearless Middle-Order Left-Hander',
      rating: 95,
    },
  },
  {
    id: 'player-8',
    name: 'Andre Russell',
    role: 'All-Rounder',
    country: 'West Indies',
    basePrice: 1200, // 1,200 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    isOverseas: true,
    order: 8,
    stats: {
      matches: 127,
      runs: 2484,
      wickets: 115,
      strikeRate: 174.93,
      economy: 9.25,
      specialty: 'Match-Winning Power Striker & Death Bowler',
      rating: 96,
    },
  },
  {
    id: 'player-9',
    name: 'Rinku Singh',
    role: 'Batsman',
    country: 'India',
    basePrice: 800, // 800 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 9,
    stats: {
      matches: 45,
      runs: 893,
      strikeRate: 143.34,
      highestScore: '67*',
      specialty: 'Ice-Cold Death-Overs Finisher',
      rating: 91,
    },
  },
  {
    id: 'player-10',
    name: 'Kuldeep Yadav',
    role: 'Bowler',
    country: 'India',
    basePrice: 1000, // 1,000 Points
    status: 'UPCOMING',
    photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=80',
    isOverseas: false,
    order: 10,
    stats: {
      matches: 84,
      wickets: 87,
      economy: 8.04,
      bestBowling: '4/14',
      specialty: 'Left-Arm Wrist Spinner & Wicket Taker',
      rating: 92,
    },
  },
];
