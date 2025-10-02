'use client';

import { useMemo } from 'react';
import { PortfolioSummary, Position } from '@/lib/binance/types';
import { PriceUpdate } from '@/lib/binance/websocket';
import { convertUSDToPLN } from '@/lib/binance/utils';

interface UsePortfolioCalculationsProps {
  originalPortfolio: PortfolioSummary;
  livePrices: Record<string, PriceUpdate>;
  usdPlnRate: number;
}

interface LivePortfolioSummary extends PortfolioSummary {
  isLive: boolean;
  lastUpdate?: Date;
}

export function usePortfolioCalculations({
  originalPortfolio,
  livePrices,
  usdPlnRate
}: UsePortfolioCalculationsProps): LivePortfolioSummary {

  return useMemo(() => {
    const hasLivePrices = Object.keys(livePrices).length > 0;

    if (!hasLivePrices) {
      return {
        ...originalPortfolio,
        isLive: false
      };
    }

    // Update positions with live prices
    const updatedPositions: Position[] = originalPortfolio.positions.map(position => {
      const livePrice = livePrices[position.symbol];

      if (!livePrice) {
        return position; // No live price available, keep original
      }

      // Calculate new values with live prices
      const newValueUSD = position.quantity * livePrice.price;
      const newValuePLN = convertUSDToPLN(newValueUSD, usdPlnRate);

      // Calculate P&L based on average price (if we had it) or current vs original
      const pnl = position.quantity * (livePrice.price - position.currentPrice);
      const pnlPercentage = ((livePrice.price - position.currentPrice) / position.currentPrice) * 100;

      return {
        ...position,
        currentPrice: livePrice.price,
        value: position.quantity,
        valueUSD: newValueUSD,
        valuePLN: newValuePLN,
        pnl: position.pnl + pnl, // Add live change to existing P&L
        pnlPercentage: position.pnlPercentage + pnlPercentage
      };
    });

    // Calculate new totals
    const newTotalUSD = updatedPositions.reduce((sum, pos) => sum + pos.valueUSD, 0);
    const newTotalPLN = convertUSDToPLN(newTotalUSD, usdPlnRate);
    const newTotalPnL = updatedPositions.reduce((sum, pos) => sum + pos.pnl, 0);
    const newTotalPnLPercentage = originalPortfolio.totalUSD > 0
      ? ((newTotalUSD - originalPortfolio.totalUSD) / originalPortfolio.totalUSD) * 100
      : 0;

    return {
      totalUSD: newTotalUSD,
      totalPLN: newTotalPLN,
      totalPnL: newTotalPnL,
      totalPnLPercentage: newTotalPnLPercentage,
      positions: updatedPositions,
      isLive: true,
      lastUpdate: new Date()
    };
  }, [originalPortfolio, livePrices, usdPlnRate]);
}