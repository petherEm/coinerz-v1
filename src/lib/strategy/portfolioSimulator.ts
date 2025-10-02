import { SupportedSymbol } from '../binance/types';
import { SimulatedPosition, TradeLog, PerformanceMetrics, PositionSide, LogType } from './types';

// Generate unique ID - compatible with both client and server
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export interface TradeExecution {
  symbol: SupportedSymbol;
  side: PositionSide;
  quantity: number;
  price: number;
}

export class PortfolioSimulator {
  private cash: number;
  private initialCapital: number;
  private positions: Map<string, SimulatedPosition>;
  private closedTrades: Array<{ pnl: number }>;
  private totalRealizedPnL: number;

  constructor(initialCapital: number) {
    this.initialCapital = initialCapital;
    this.cash = initialCapital;
    this.positions = new Map();
    this.closedTrades = [];
    this.totalRealizedPnL = 0;
  }

  /**
   * Get position key for map
   */
  private getPositionKey(symbol: SupportedSymbol, side: PositionSide): string {
    return `${symbol}-${side}`;
  }

  /**
   * Execute a trade (open or add to position)
   */
  executeTrade(
    symbol: SupportedSymbol,
    side: PositionSide,
    quantity: number,
    price: number
  ): TradeLog | null {
    const valueUSD = quantity * price;

    // Check if we have enough cash
    if (valueUSD > this.cash) {
      return {
        id: generateId(),
        timestamp: new Date(),
        logType: 'ERROR',
        symbol,
        action: side === 'LONG' ? 'OPEN_LONG' : 'OPEN_SHORT',
        quantity,
        price,
        valueUSD,
        message: `Insufficient cash: Need $${valueUSD.toFixed(2)}, Available: $${this.cash.toFixed(2)}`
      };
    }

    const key = this.getPositionKey(symbol, side);
    const existingPosition = this.positions.get(key);

    if (existingPosition) {
      // Add to existing position (average price)
      const totalQuantity = existingPosition.quantity + quantity;
      const totalValue = (existingPosition.quantity * existingPosition.entryPrice) + (quantity * price);
      const avgPrice = totalValue / totalQuantity;

      existingPosition.quantity = totalQuantity;
      existingPosition.entryPrice = avgPrice;
      existingPosition.currentPrice = price;
      existingPosition.valueUSD = totalQuantity * price;

      this.cash -= valueUSD;

      return {
        id: generateId(),
        timestamp: new Date(),
        logType: side === 'LONG' ? 'BUY' : 'SELL',
        symbol,
        action: side === 'LONG' ? 'ADD_LONG' : 'ADD_SHORT',
        quantity,
        price,
        valueUSD,
        message: `Added to ${side} position: ${quantity.toFixed(8)} ${symbol} @ $${price.toFixed(2)} (Avg: $${avgPrice.toFixed(2)})`
      };
    } else {
      // Open new position
      const newPosition: SimulatedPosition = {
        symbol,
        side,
        quantity,
        entryPrice: price,
        currentPrice: price,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        valueUSD,
        openedAt: new Date()
      };

      this.positions.set(key, newPosition);
      this.cash -= valueUSD;

      return {
        id: generateId(),
        timestamp: new Date(),
        logType: side === 'LONG' ? 'BUY' : 'SELL',
        symbol,
        action: side === 'LONG' ? 'OPEN_LONG' : 'OPEN_SHORT',
        quantity,
        price,
        valueUSD,
        message: `Opened ${side} position: ${quantity.toFixed(8)} ${symbol} @ $${price.toFixed(2)}`
      };
    }
  }

  /**
   * Close a position
   */
  closePosition(
    symbol: SupportedSymbol,
    side: PositionSide,
    currentPrice: number
  ): TradeLog | null {
    const key = this.getPositionKey(symbol, side);
    const position = this.positions.get(key);

    if (!position) {
      return {
        id: generateId(),
        timestamp: new Date(),
        logType: 'ERROR',
        symbol,
        action: 'CLOSE_POSITION',
        quantity: 0,
        price: currentPrice,
        valueUSD: 0,
        message: `No ${side} position found for ${symbol}`
      };
    }

    // Calculate P&L
    const pnl = side === 'LONG'
      ? (currentPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - currentPrice) * position.quantity;

    const pnlPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;
    const closeValue = position.quantity * currentPrice;

    // Return cash
    this.cash += closeValue + pnl;
    this.totalRealizedPnL += pnl;

    // Record closed trade
    this.closedTrades.push({ pnl });

    // Remove position
    this.positions.delete(key);

    return {
      id: generateId(),
      timestamp: new Date(),
      logType: 'CLOSE',
      symbol,
      action: 'CLOSE_POSITION',
      quantity: position.quantity,
      price: currentPrice,
      valueUSD: closeValue,
      message: `Closed ${side} position: ${position.quantity.toFixed(8)} ${symbol} @ $${currentPrice.toFixed(2)} | P&L: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)`
    };
  }

  /**
   * Update current prices for all positions
   */
  updatePrices(prices: Record<SupportedSymbol, number>): void {
    this.positions.forEach((position, key) => {
      const currentPrice = prices[position.symbol];
      if (currentPrice) {
        position.currentPrice = currentPrice;
        position.valueUSD = position.quantity * currentPrice;

        // Calculate unrealized P&L
        if (position.side === 'LONG') {
          position.unrealizedPnL = (currentPrice - position.entryPrice) * position.quantity;
        } else {
          position.unrealizedPnL = (position.entryPrice - currentPrice) * position.quantity;
        }

        position.unrealizedPnLPercent = (position.unrealizedPnL / (position.entryPrice * position.quantity)) * 100;
      }
    });
  }

  /**
   * Get all current positions
   */
  getPositions(): SimulatedPosition[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get position for specific symbol and side
   */
  getPosition(symbol: SupportedSymbol, side: PositionSide): SimulatedPosition | undefined {
    const key = this.getPositionKey(symbol, side);
    return this.positions.get(key);
  }

  /**
   * Get current cash balance
   */
  getCash(): number {
    return this.cash;
  }

  /**
   * Calculate performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const unrealizedPnL = this.getPositions().reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    const totalValue = this.cash + this.getPositions().reduce((sum, pos) => sum + pos.valueUSD, 0);
    const totalPnL = this.totalRealizedPnL + unrealizedPnL;
    const totalPnLPercent = (totalPnL / this.initialCapital) * 100;

    const winningTrades = this.closedTrades.filter(t => t.pnl > 0).length;
    const losingTrades = this.closedTrades.filter(t => t.pnl < 0).length;
    const totalTrades = this.closedTrades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const largestWin = this.closedTrades.length > 0
      ? Math.max(...this.closedTrades.map(t => t.pnl))
      : 0;
    const largestLoss = this.closedTrades.length > 0
      ? Math.min(...this.closedTrades.map(t => t.pnl))
      : 0;

    return {
      totalValue,
      initialCapital: this.initialCapital,
      realizedPnL: this.totalRealizedPnL,
      unrealizedPnL,
      totalPnL,
      totalPnLPercent,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      largestWin,
      largestLoss
    };
  }

  /**
   * Reset the portfolio to initial state
   */
  reset(): void {
    this.cash = this.initialCapital;
    this.positions.clear();
    this.closedTrades = [];
    this.totalRealizedPnL = 0;
  }
}
