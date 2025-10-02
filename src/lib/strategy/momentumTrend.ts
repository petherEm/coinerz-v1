import { SupportedSymbol } from '../binance/types';
import { MomentumTrendConfig } from './types';

export interface MomentumSignal {
  symbol: SupportedSymbol;
  action: 'BUY' | 'SELL' | 'HOLD' | 'CLOSE';
  price: number;
  indicator: 'EMA' | 'SMA' | 'RSI';
  indicatorValue: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  strength: number; // 0-100
}

/**
 * Calculate Simple Moving Average
 */
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;

  const slice = prices.slice(-period);
  const sum = slice.reduce((acc, price) => acc + price, 0);
  return sum / period;
}

/**
 * Calculate Exponential Moving Average
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  if (prices.length < period) {
    // Use SMA for initial EMA
    return calculateSMA(prices, prices.length);
  }

  const multiplier = 2 / (period + 1);
  let ema = calculateSMA(prices.slice(0, period), period);

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

/**
 * Calculate RSI (Relative Strength Index)
 */
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50; // Neutral

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const recentChanges = changes.slice(-period);

  let gains = 0;
  let losses = 0;

  recentChanges.forEach(change => {
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  });

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

/**
 * Momentum/Trend Following Strategy
 * Rides short-term momentum with strict risk management
 */
export class MomentumTrendStrategy {
  private config: MomentumTrendConfig;
  private priceHistories: Map<SupportedSymbol, number[]>;
  private openPositions: Map<SupportedSymbol, {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
  }>;

  constructor(config: MomentumTrendConfig) {
    this.config = config;
    this.priceHistories = new Map();
    this.openPositions = new Map();
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

    // Keep only what we need (max of trend period + some buffer)
    const maxLength = Math.max(this.config.trendPeriod, this.config.momentumPeriod) + 50;
    if (history.length > maxLength) {
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
   * Check if position is open for symbol
   */
  hasPosition(symbol: SupportedSymbol): boolean {
    return this.openPositions.has(symbol);
  }

  /**
   * Open a position
   */
  openPosition(symbol: SupportedSymbol, entryPrice: number): void {
    const stopLoss = entryPrice * (1 - this.config.stopLossPercent / 100);
    const takeProfit = entryPrice * (1 + this.config.takeProfitPercent / 100);

    this.openPositions.set(symbol, {
      entryPrice,
      stopLoss,
      takeProfit
    });
  }

  /**
   * Close a position
   */
  closePosition(symbol: SupportedSymbol): void {
    this.openPositions.delete(symbol);
  }

  /**
   * Get number of open positions
   */
  getOpenPositionsCount(): number {
    return this.openPositions.size;
  }

  /**
   * Calculate trend based on selected indicator
   */
  private calculateTrend(prices: number[]): {
    value: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number;
  } {
    const currentPrice = prices[prices.length - 1];
    let indicatorValue = 0;
    let trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    let strength = 0;

    if (this.config.trendIndicator === 'EMA') {
      indicatorValue = calculateEMA(prices, this.config.trendPeriod);

      if (currentPrice > indicatorValue) {
        trend = 'BULLISH';
        strength = ((currentPrice - indicatorValue) / indicatorValue) * 100;
      } else if (currentPrice < indicatorValue) {
        trend = 'BEARISH';
        strength = ((indicatorValue - currentPrice) / indicatorValue) * 100;
      }
    } else if (this.config.trendIndicator === 'SMA') {
      indicatorValue = calculateSMA(prices, this.config.trendPeriod);

      if (currentPrice > indicatorValue) {
        trend = 'BULLISH';
        strength = ((currentPrice - indicatorValue) / indicatorValue) * 100;
      } else if (currentPrice < indicatorValue) {
        trend = 'BEARISH';
        strength = ((indicatorValue - currentPrice) / indicatorValue) * 100;
      }
    } else if (this.config.trendIndicator === 'RSI') {
      indicatorValue = calculateRSI(prices, this.config.momentumPeriod);

      if (indicatorValue > this.config.rsiOverbought) {
        trend = 'BEARISH'; // Overbought - potential reversal
        strength = indicatorValue - this.config.rsiOverbought;
      } else if (indicatorValue < this.config.rsiOversold) {
        trend = 'BULLISH'; // Oversold - potential bounce
        strength = this.config.rsiOversold - indicatorValue;
      } else {
        trend = 'NEUTRAL';
        strength = Math.abs(indicatorValue - 50); // Distance from neutral
      }
    }

    return { value: indicatorValue, trend, strength: Math.min(strength, 100) };
  }

  /**
   * Generate trading signal
   */
  generateSignal(symbol: SupportedSymbol, currentPrice: number): MomentumSignal | null {
    const prices = this.getPriceHistory(symbol);

    // Need enough data
    const minRequired = Math.max(this.config.trendPeriod, this.config.momentumPeriod);
    if (prices.length < minRequired) {
      return null;
    }

    const { value, trend, strength } = this.calculateTrend(prices);
    const hasPosition = this.hasPosition(symbol);

    let action: MomentumSignal['action'] = 'HOLD';

    if (hasPosition) {
      // Check for exit conditions
      const position = this.openPositions.get(symbol)!;

      if (currentPrice <= position.stopLoss) {
        action = 'CLOSE';
        // Stop loss hit
      } else if (currentPrice >= position.takeProfit) {
        action = 'CLOSE';
        // Take profit hit
      } else if (trend === 'BEARISH' && strength > 2) {
        // Trend reversal - quick exit
        action = 'CLOSE';
      }
    } else {
      // Check for entry conditions
      if (this.getOpenPositionsCount() >= this.config.maxPositions) {
        return null; // Max positions reached
      }

      // Enter on strong bullish trend
      if (trend === 'BULLISH' && strength > 1.5) {
        action = 'BUY';
      }
    }

    return {
      symbol,
      action,
      price: currentPrice,
      indicator: this.config.trendIndicator,
      indicatorValue: value,
      trend,
      strength
    };
  }

  /**
   * Reset strategy state
   */
  reset(): void {
    this.priceHistories.clear();
    this.openPositions.clear();
  }
}
