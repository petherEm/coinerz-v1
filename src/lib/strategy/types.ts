import { SupportedSymbol } from '../binance/types';

export type LogType = 'BUY' | 'SELL' | 'HEDGE' | 'INFO' | 'ERROR' | 'CLOSE';
export type PositionSide = 'LONG' | 'SHORT';
export type StrategyStatus = 'idle' | 'running' | 'paused' | 'stopped';

export interface TradeLog {
  id: string;
  timestamp: Date;
  logType: LogType;
  symbol: SupportedSymbol;
  action: string;
  quantity: number;
  price: number;
  valueUSD: number;
  message: string;
}

export interface SimulatedPosition {
  symbol: SupportedSymbol;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  valueUSD: number;
  openedAt: Date;
}

export interface PerformanceMetrics {
  totalValue: number;
  initialCapital: number;
  realizedPnL: number;
  unrealizedPnL: number;
  totalPnL: number;
  totalPnLPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  largestWin: number;
  largestLoss: number;
}

export type StrategyType = 'mean_reversion' | 'momentum_trend';

export type TrendIndicator = 'EMA' | 'SMA' | 'RSI';

export interface MeanReversionConfig {
  entryZScore: number;      // e.g., 2.0 - enter when spread deviates by 2 std devs
  exitZScore: number;        // e.g., 0.0 - exit when spread returns to mean
  lookbackPeriod: number;    // e.g., 50 - number of data points for mean/std calculation
  positionSize: number;      // e.g., 0.1 - fraction of capital per trade (10%)
  maxPositions: number;      // e.g., 4 - max number of open pairs
  correlationPairs: Array<{
    symbolA: SupportedSymbol;
    symbolB: SupportedSymbol;
  }>;
}

export interface MomentumTrendConfig {
  trendPeriod: number;        // e.g., 20 - EMA/SMA period for trend
  momentumPeriod: number;     // e.g., 14 - RSI period or momentum calculation
  stopLossPercent: number;    // e.g., 2.0 - stop loss percentage
  takeProfitPercent: number;  // e.g., 5.0 - take profit percentage
  positionSize: number;       // e.g., 0.1 - fraction of capital per trade (10%)
  maxPositions: number;       // e.g., 3 - max concurrent positions
  trendIndicator: TrendIndicator; // Which indicator to use
  rsiOverbought: number;      // e.g., 70 - RSI overbought threshold
  rsiOversold: number;        // e.g., 30 - RSI oversold threshold
}

export type StrategyConfig = MeanReversionConfig | MomentumTrendConfig;

export interface StrategySession {
  id: string;
  strategyType: StrategyType;
  status: StrategyStatus;
  config: StrategyConfig;
  initialCapital: number;
  startedAt: Date | null;
  endedAt: Date | null;
}

export interface StrategyState {
  session: StrategySession;
  logs: TradeLog[];
  positions: SimulatedPosition[];
  metrics: PerformanceMetrics;
  cash: number; // Available cash in USD
}

export interface PriceHistory {
  symbol: SupportedSymbol;
  prices: Array<{
    timestamp: Date;
    price: number;
  }>;
}
