'use client';

import { SimulatedPosition, PerformanceMetrics } from '@/lib/strategy/types';
import { Position, PortfolioSummary } from '@/lib/binance/types';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface PositionComparisonProps {
  realPortfolio: PortfolioSummary;
  simulatedPositions: SimulatedPosition[];
  simulatedMetrics: PerformanceMetrics;
  simulatedCash: number;
}

export function PositionComparison({
  realPortfolio,
  simulatedPositions,
  simulatedMetrics,
  simulatedCash
}: PositionComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics Comparison */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Comparison</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Real Portfolio Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <h4 className="font-semibold text-white">Real Portfolio</h4>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <DollarSign size={16} />
                  Total Value
                </div>
                <div className="text-white font-semibold">
                  {formatCurrency(realPortfolio.totalUSD)}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Activity size={16} />
                  P&L
                </div>
                <div className={`font-semibold ${realPortfolio.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(realPortfolio.totalPnL)}
                  <span className="text-sm ml-1">
                    ({formatPercent(realPortfolio.totalPnLPercentage)})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">Positions</div>
                <div className="text-white font-semibold">
                  {realPortfolio.positions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Portfolio Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <h4 className="font-semibold text-white">Simulated Portfolio</h4>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <DollarSign size={16} />
                  Total Value
                </div>
                <div className="text-white font-semibold">
                  {formatCurrency(simulatedMetrics.totalValue)}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Activity size={16} />
                  P&L
                </div>
                <div className={`font-semibold ${simulatedMetrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(simulatedMetrics.totalPnL)}
                  <span className="text-sm ml-1">
                    ({formatPercent(simulatedMetrics.totalPnLPercent)})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">Positions</div>
                <div className="text-white font-semibold">
                  {simulatedPositions.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Stats */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-semibold text-white mb-3">Strategy Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Total Trades</div>
              <div className="text-white font-semibold">{simulatedMetrics.totalTrades}</div>
            </div>
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Win Rate</div>
              <div className="text-white font-semibold">{simulatedMetrics.winRate.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Winning</div>
              <div className="text-green-500 font-semibold">{simulatedMetrics.winningTrades}</div>
            </div>
            <div className="bg-gray-800 rounded p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Losing</div>
              <div className="text-red-500 font-semibold">{simulatedMetrics.losingTrades}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real Positions */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Real Positions
          </h4>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {realPortfolio.positions.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-4">No positions</div>
            ) : (
              realPortfolio.positions.map((position) => (
                <div key={position.symbol} className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{position.asset}</span>
                    <span className="text-gray-400 text-xs">{position.quantity.toFixed(8)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {formatCurrency(position.currentPrice)}
                    </span>
                    <span className="text-white font-semibold">
                      {formatCurrency(position.valueUSD)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Simulated Positions */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Simulated Positions
          </h4>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {/* Cash */}
            <div className="bg-gray-800 rounded p-3 border-l-2 border-yellow-500">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold text-sm">CASH (USD)</span>
                <span className="text-yellow-500 text-xs">Available</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">1.00</span>
                <span className="text-white font-semibold">
                  {formatCurrency(simulatedCash)}
                </span>
              </div>
            </div>

            {/* Positions */}
            {simulatedPositions.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-4">No open positions</div>
            ) : (
              simulatedPositions.map((position, idx) => (
                <div
                  key={idx}
                  className={`bg-gray-800 rounded p-3 border-l-2 ${
                    position.side === 'LONG' ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">
                      {position.symbol.replace('USDT', '')}
                    </span>
                    <span className={`text-xs font-semibold ${
                      position.side === 'LONG' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.side}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Qty: {position.quantity.toFixed(8)}</span>
                    <span className="text-gray-400">
                      Entry: {formatCurrency(position.entryPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${
                      position.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatCurrency(position.unrealizedPnL)}
                      <span className="ml-1">
                        ({formatPercent(position.unrealizedPnLPercent)})
                      </span>
                    </span>
                    <span className="text-white font-semibold">
                      {formatCurrency(position.valueUSD)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
