import { SupportedSymbol } from '../binance/types';
import { MeanReversionConfig, PriceHistory } from './types';

export interface SpreadData {
  timestamp: Date;
  spread: number;
  zScore: number;
}

export interface TradingSignal {
  pairId: string;
  symbolA: SupportedSymbol;
  symbolB: SupportedSymbol;
  action: 'OPEN_LONG_A_SHORT_B' | 'OPEN_SHORT_A_LONG_B' | 'CLOSE_POSITIONS' | 'HOLD';
  zScore: number;
  spreadValue: number;
  priceA: number;
  priceB: number;
  hedgeRatio: number;
}

/**
 * Calculate the mean of an array of numbers
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the standard deviation of an array of numbers
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate the hedge ratio (beta) between two price series
 * This determines how many units of B to trade for each unit of A
 */
function calculateHedgeRatio(pricesA: number[], pricesB: number[]): number {
  if (pricesA.length !== pricesB.length || pricesA.length === 0) {
    return 1.0; // Default to 1:1 if not enough data
  }

  const meanA = calculateMean(pricesA);
  const meanB = calculateMean(pricesB);

  let covariance = 0;
  let varianceB = 0;

  for (let i = 0; i < pricesA.length; i++) {
    const diffA = pricesA[i] - meanA;
    const diffB = pricesB[i] - meanB;
    covariance += diffA * diffB;
    varianceB += diffB * diffB;
  }

  if (varianceB === 0) return 1.0;

  // Hedge ratio = Cov(A,B) / Var(B)
  return covariance / varianceB;
}

/**
 * Calculate the spread between two correlated assets
 * Spread = PriceA - (HedgeRatio * PriceB)
 */
export function calculateSpread(
  priceA: number,
  priceB: number,
  hedgeRatio: number
): number {
  return priceA - (hedgeRatio * priceB);
}

/**
 * Calculate z-score for the current spread
 * Z-Score = (Current Spread - Mean Spread) / Std Dev of Spread
 */
export function calculateZScore(
  currentSpread: number,
  historicalSpreads: number[]
): number {
  if (historicalSpreads.length === 0) return 0;

  const mean = calculateMean(historicalSpreads);
  const stdDev = calculateStdDev(historicalSpreads, mean);

  if (stdDev === 0) return 0;

  return (currentSpread - mean) / stdDev;
}

/**
 * Generate trading signals based on Mean Reversion strategy
 */
export class MeanReversionStrategy {
  private config: MeanReversionConfig;
  private priceHistories: Map<SupportedSymbol, number[]>;
  private spreadHistories: Map<string, number[]>;
  private openPairs: Set<string>;

  constructor(config: MeanReversionConfig) {
    this.config = config;
    this.priceHistories = new Map();
    this.spreadHistories = new Map();
    this.openPairs = new Set();
  }

  /**
   * Update price history for a symbol
   */
  updatePrice(symbol: SupportedSymbol, price: number): void {
    if (!this.priceHistories.has(symbol)) {
      this.priceHistories.set(symbol, []);
    }

    const history = this.priceHistories.get(symbol)!;
    history.push(price);

    // Keep only the lookback period
    if (history.length > this.config.lookbackPeriod) {
      history.shift();
    }
  }

  /**
   * Get price history for a symbol
   */
  getPriceHistory(symbol: SupportedSymbol): number[] {
    return this.priceHistories.get(symbol) || [];
  }

  /**
   * Check if a pair position is open
   */
  isPairOpen(symbolA: SupportedSymbol, symbolB: SupportedSymbol): boolean {
    const pairId = `${symbolA}-${symbolB}`;
    return this.openPairs.has(pairId);
  }

  /**
   * Mark a pair as open
   */
  openPair(symbolA: SupportedSymbol, symbolB: SupportedSymbol): void {
    const pairId = `${symbolA}-${symbolB}`;
    this.openPairs.add(pairId);
  }

  /**
   * Mark a pair as closed
   */
  closePair(symbolA: SupportedSymbol, symbolB: SupportedSymbol): void {
    const pairId = `${symbolA}-${symbolB}`;
    this.openPairs.delete(pairId);
  }

  /**
   * Get number of open pairs
   */
  getOpenPairsCount(): number {
    return this.openPairs.size;
  }

  /**
   * Generate trading signal for a pair
   */
  generateSignal(
    symbolA: SupportedSymbol,
    symbolB: SupportedSymbol,
    currentPriceA: number,
    currentPriceB: number
  ): TradingSignal | null {
    const pairId = `${symbolA}-${symbolB}`;
    const historyA = this.getPriceHistory(symbolA);
    const historyB = this.getPriceHistory(symbolB);

    // Need enough data for statistical analysis
    if (historyA.length < this.config.lookbackPeriod ||
        historyB.length < this.config.lookbackPeriod) {
      return null;
    }

    // Calculate hedge ratio
    const hedgeRatio = calculateHedgeRatio(historyA, historyB);

    // Calculate current spread
    const currentSpread = calculateSpread(currentPriceA, currentPriceB, hedgeRatio);

    // Get or initialize spread history
    if (!this.spreadHistories.has(pairId)) {
      this.spreadHistories.set(pairId, []);
    }

    const spreadHistory = this.spreadHistories.get(pairId)!;
    spreadHistory.push(currentSpread);

    // Keep only the lookback period
    if (spreadHistory.length > this.config.lookbackPeriod) {
      spreadHistory.shift();
    }

    // Need enough spread data
    if (spreadHistory.length < this.config.lookbackPeriod) {
      return null;
    }

    // Calculate z-score
    const zScore = calculateZScore(currentSpread, spreadHistory);

    const isPairOpen = this.isPairOpen(symbolA, symbolB);

    // Generate signal
    let action: TradingSignal['action'] = 'HOLD';

    if (!isPairOpen) {
      // Entry signals
      if (zScore > this.config.entryZScore && this.getOpenPairsCount() < this.config.maxPositions) {
        // Spread is too high - short A, long B
        action = 'OPEN_SHORT_A_LONG_B';
      } else if (zScore < -this.config.entryZScore && this.getOpenPairsCount() < this.config.maxPositions) {
        // Spread is too low - long A, short B
        action = 'OPEN_LONG_A_SHORT_B';
      }
    } else {
      // Exit signals
      if (Math.abs(zScore) <= this.config.exitZScore) {
        // Spread has reverted to mean
        action = 'CLOSE_POSITIONS';
      }
    }

    return {
      pairId,
      symbolA,
      symbolB,
      action,
      zScore,
      spreadValue: currentSpread,
      priceA: currentPriceA,
      priceB: currentPriceB,
      hedgeRatio
    };
  }

  /**
   * Reset the strategy state
   */
  reset(): void {
    this.priceHistories.clear();
    this.spreadHistories.clear();
    this.openPairs.clear();
  }
}
