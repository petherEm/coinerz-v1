'use client';

import { useState } from 'react';
import { PortfolioCard } from './PortfolioCard';
import { PositionCard } from './PositionCard';
import { CurrencyToggle } from './CurrencyToggle';
import { PortfolioSummary as PortfolioSummaryType } from '@/lib/binance/types';
import { PriceUpdate } from '@/lib/binance/websocket';
import { usePortfolioCalculations } from '@/hooks/usePortfolioCalculations';

interface PortfolioSummaryProps {
  portfolio: PortfolioSummaryType;
  livePrices?: Record<string, PriceUpdate>;
  usdPlnRate?: number;
}

export function PortfolioSummary({ portfolio, livePrices = {}, usdPlnRate = 4.0 }: PortfolioSummaryProps) {
  const [showPLN, setShowPLN] = useState(false);

  // Calculate live portfolio values
  const livePortfolio = usePortfolioCalculations({
    originalPortfolio: portfolio,
    livePrices,
    usdPlnRate
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Portfolio</h2>
        <CurrencyToggle showPLN={showPLN} onToggle={setShowPLN} />
      </div>

      <PortfolioCard
        totalUSD={livePortfolio.totalUSD}
        totalPLN={livePortfolio.totalPLN}
        totalPnL={livePortfolio.totalPnL}
        totalPnLPercentage={livePortfolio.totalPnLPercentage}
        showPLN={showPLN}
        isLive={livePortfolio.isLive}
        lastUpdate={livePortfolio.lastUpdate}
      />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Positions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {livePortfolio.positions.map((position) => (
            <PositionCard
              key={position.asset}
              position={position}
              showPLN={showPLN}
              isLive={livePortfolio.isLive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}