/**
 * Server-Side Auction State Engine
 * Implements atomic bid processing, budget deduction, and concurrency guardrails.
 */

export interface TeamEntity {
  id: string;
  name: string;
  shortName: string;
  totalBudget: bigint;
  remainingBudget: bigint;
  maxSquadSize: number;
  maxOverseas: number;
}

export interface PlayerEntity {
  id: string;
  name: string;
  role: string;
  isOverseas: boolean;
  basePrice: bigint;
  soldPrice?: bigint;
  soldToTeamId?: string;
  status: 'UPCOMING' | 'IN_AUCTION' | 'SOLD' | 'UNSOLD';
}

export interface BidPayload {
  playerId: string;
  teamId: string;
  amount: bigint;
}

export class AuctionEngine {
  /**
   * Validates if a franchise is legally allowed to place a bid
   */
  public static validateBid(
    player: PlayerEntity,
    team: TeamEntity,
    teamCurrentSquad: PlayerEntity[],
    proposedAmount: bigint,
    currentHighestBid: bigint
  ): { valid: boolean; reason?: string } {
    if (player.status !== 'IN_AUCTION') {
      return { valid: false, reason: `Player is not on the auction hammer. Current status: ${player.status}` };
    }

    if (proposedAmount <= currentHighestBid) {
      return { valid: false, reason: `Bid of ₹${proposedAmount} must strictly exceed current highest bid of ₹${currentHighestBid}` };
    }

    if (proposedAmount > team.remainingBudget) {
      return { valid: false, reason: `${team.name} has insufficient budget! Available: ₹${team.remainingBudget}, Bid: ₹${proposedAmount}` };
    }

    if (teamCurrentSquad.length >= team.maxSquadSize) {
      return { valid: false, reason: `${team.name} has reached the maximum squad limit of ${team.maxSquadSize} players` };
    }

    if (player.isOverseas) {
      const overseasCount = teamCurrentSquad.filter(p => p.isOverseas).length;
      if (overseasCount >= team.maxOverseas) {
        return { valid: false, reason: `${team.name} has reached the maximum overseas player quota (${team.maxOverseas})` };
      }
    }

    // Minimum Reserve Check (IPL Reserve Rule):
    // Franchise must retain at least minimum base prices for remaining required squad slots
    const minReservePerSlot = BigInt(2000000); // 20 Lakhs
    const emptySlots = team.maxSquadSize - (teamCurrentSquad.length + 1);
    const requiredReserve = BigInt(emptySlots) * minReservePerSlot;

    if (team.remainingBudget - proposedAmount < requiredReserve) {
      return {
        valid: false,
        reason: `${team.name} must reserve at least ₹${requiredReserve} to fill their remaining ${emptySlots} squad slots.`,
      };
    }

    return { valid: true };
  }

  /**
   * Executes atomic budget deduction and roster update upon gavel strike
   */
  public static executeSale(
    player: PlayerEntity,
    team: TeamEntity,
    finalAmount: bigint
  ): { updatedPlayer: PlayerEntity; updatedTeam: TeamEntity } {
    if (finalAmount > team.remainingBudget) {
      throw new Error(`Critical: Final amount ₹${finalAmount} exceeds ${team.name}'s remaining purse ₹${team.remainingBudget}`);
    }

    const updatedTeam: TeamEntity = {
      ...team,
      remainingBudget: team.remainingBudget - finalAmount,
    };

    const updatedPlayer: PlayerEntity = {
      ...player,
      status: 'SOLD',
      soldPrice: finalAmount,
      soldToTeamId: team.id,
    };

    return { updatedPlayer, updatedTeam };
  }
}
