'use client';

import { ChartGrid } from '../charts/ChartGrid';
import { PortfolioSummary } from '../portfolio/PortfolioSummary';
import { ConnectionStatus } from '../ui/connection-status';
import { CandlestickData, SupportedSymbol, PortfolioSummary as PortfolioSummaryType } from '@/lib/binance/types';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import Link from 'next/link';
import { TestTube } from 'lucide-react';

interface DashboardProps {
  chartData: Record<SupportedSymbol, CandlestickData[]>;
  currentPrices: Record<string, number>;
  portfolio: PortfolioSummaryType;
}

export function Dashboard({ chartData, currentPrices, portfolio }: DashboardProps) {
  const { prices: livePrices, isConnected, lastUpdate } = useBinanceWebSocket();

  // Get current USD/PLN rate (you could also fetch this live)
  const usdPlnRate = 4.0; // This could be dynamic from an API call
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Coinerz Dashboard
              </h1>
              <p className="text-gray-400">
                Real-time cryptocurrency portfolio and market data
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/testing"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <TestTube size={18} />
                Strategy Testing
              </Link>
              <ConnectionStatus
                isConnected={isConnected}
                lastUpdate={lastUpdate}
              />
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Portfolio Section */}
          <section>
            <PortfolioSummary
              portfolio={portfolio}
              livePrices={livePrices}
              usdPlnRate={usdPlnRate}
            />
          </section>

          {/* Charts Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Market Charts</h2>
              <div className="text-sm text-gray-400">
                1-minute intervals + Live prices
              </div>
            </div>
            <ChartGrid
              chartData={chartData}
              currentPrices={currentPrices}
              livePrices={livePrices}
            />
          </section>
        </div>
      </div>
    </div>
  );
}