import { Card } from '@/components/ui/card';

interface PortfolioCardProps {
  totalUSD: number;
  totalPLN: number;
  totalPnL: number;
  totalPnLPercentage: number;
  showPLN?: boolean;
  isLive?: boolean;
  lastUpdate?: Date;
}

export function PortfolioCard({
  totalUSD,
  totalPLN,
  totalPnL,
  totalPnLPercentage,
  showPLN = false,
  isLive = false,
  lastUpdate
}: PortfolioCardProps) {
  const displayValue = showPLN ? totalPLN : totalUSD;
  const currency = showPLN ? 'PLN' : 'USD';
  const pnlColor = totalPnL >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-gray-900 border-gray-700 p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium text-gray-400">
              Total Portfolio Value
            </h3>
            {isLive && (
              <span className="text-xs font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded">
                LIVE
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-white">
            {displayValue.toLocaleString('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          {isLive && lastUpdate && (
            <p className="text-xs text-gray-500 mt-1">
              Updated {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {totalPnL !== 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <span className="text-gray-400">Total P&L</span>
            <div className="text-right">
              <p className={`font-semibold ${pnlColor}`}>
                {totalPnL >= 0 ? '+' : ''}
                {totalPnL.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className={`text-sm ${pnlColor}`}>
                {totalPnLPercentage >= 0 ? '+' : ''}
                {totalPnLPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}