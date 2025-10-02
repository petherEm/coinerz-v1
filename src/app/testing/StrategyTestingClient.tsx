'use client';

import { PortfolioSummary } from '@/lib/binance/types';
import { useStrategyExecution } from '@/hooks/useStrategyExecution';
import { StrategyTerminal } from '@/components/strategy/StrategyTerminal';
import { StrategyControls } from '@/components/strategy/StrategyControls';
import { PositionComparison } from '@/components/strategy/PositionComparison';
import { ConnectionStatus } from '@/components/ui/connection-status';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface StrategyTestingClientProps {
  realPortfolio: PortfolioSummary;
}

export function StrategyTestingClient({ realPortfolio }: StrategyTestingClientProps) {
  const {
    strategyType,
    status,
    config,
    logs,
    positions,
    metrics,
    cash,
    isConnected,
    start,
    pause,
    stop,
    reset,
    updateConfig,
    changeStrategy
  } = useStrategyExecution();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Strategy Testing
              </h1>
              <p className="text-gray-400">
                Statistical Arbitrage (Mean Reversion) - Simulated Execution
              </p>
            </div>
            <ConnectionStatus
              isConnected={isConnected}
              lastUpdate={logs.length > 0 ? logs[logs.length - 1].timestamp : null}
            />
          </div>
        </header>

        {/* Strategy Controls */}
        <div className="mb-6">
          <StrategyControls
            strategyType={strategyType}
            status={status}
            config={config}
            onStart={start}
            onPause={pause}
            onStop={stop}
            onReset={reset}
            onConfigChange={updateConfig}
            onStrategyChange={changeStrategy}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Terminal */}
          <div className="lg:col-span-1">
            <StrategyTerminal
              logs={logs}
              isRunning={status === 'running'}
            />
          </div>

          {/* Position Comparison */}
          <div className="lg:col-span-1">
            <PositionComparison
              realPortfolio={realPortfolio}
              simulatedPositions={positions}
              simulatedMetrics={metrics}
              simulatedCash={cash}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">About Mean Reversion Strategy</h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>
              This strategy exploits temporary price discrepancies between correlated cryptocurrency pairs.
              When the price spread deviates significantly from its historical mean (measured by z-score),
              the strategy opens hedged positions expecting the spread to revert.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-white font-semibold mb-2">✓ Advantages</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Based on statistical relationships</li>
                  <li>Hedged positions reduce market risk</li>
                  <li>Clear entry and exit signals</li>
                  <li>Works in both bull and bear markets</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">⚠️ Risks</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Correlations can break during market stress</li>
                  <li>Requires sufficient liquidity</li>
                  <li>Transaction costs impact profitability</li>
                  <li>Spread may widen before reverting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
