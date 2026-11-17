/**
 * Points & Purse utilities for Cricket Auction Platform (10,000 Points System)
 */

export const formatCurrency = (amount: number, options?: { fullLabel?: boolean; compact?: boolean }): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 PTS';

  const fullLabel = options?.fullLabel ?? false;
  const compact = options?.compact ?? false;

  if (compact && amount >= 1000) {
    const k = amount / 1000;
    const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
    return `${formatted}k PTS`;
  }

  const formattedNum = amount.toLocaleString('en-US');
  return fullLabel ? `${formattedNum} Points` : `${formattedNum} PTS`;
};

export const formatPointsNumber = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Smart dynamic bid increments based on current bid level in a 10,000 points economy
 */
export const getRecommendedIncrements = (currentBid: number): { label: string; value: number }[] => {
  if (currentBid < 500) {
    // Under 500 pts: 25, 50, 100, 200
    return [
      { label: '+25 PTS', value: 25 },
      { label: '+50 PTS', value: 50 },
      { label: '+100 PTS', value: 100 },
      { label: '+200 PTS', value: 200 },
    ];
  } else if (currentBid < 2000) {
    // 500 to 2,000 pts: 50, 100, 200, 500
    return [
      { label: '+50 PTS', value: 50 },
      { label: '+100 PTS', value: 100 },
      { label: '+200 PTS', value: 200 },
      { label: '+500 PTS', value: 500 },
    ];
  } else if (currentBid < 5000) {
    // 2,000 to 5,000 pts: 100, 200, 500, 1,000
    return [
      { label: '+100 PTS', value: 100 },
      { label: '+200 PTS', value: 200 },
      { label: '+500 PTS', value: 500 },
      { label: '+1,000 PTS', value: 1000 },
    ];
  } else {
    // Above 5,000 pts: 250, 500, 1,000, 2,000
    return [
      { label: '+250 PTS', value: 250 },
      { label: '+500 PTS', value: 500 },
      { label: '+1,000 PTS', value: 1000 },
      { label: '+2,000 PTS', value: 2000 },
    ];
  }
};
