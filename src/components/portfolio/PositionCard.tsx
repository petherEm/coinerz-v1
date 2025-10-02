import { Card } from '@/components/ui/card';
import { Position } from '@/lib/binance/types';

interface PositionCardProps {
  position: Position;
  showPLN?: boolean;
  isLive?: boolean;
}

export function PositionCard({ position, showPLN = false, isLive = false }: PositionCardProps) {
  const displayValue = showPLN ? position.valuePLN : position.valueUSD;
  const currency = showPLN ? 'PLN' : 'USD';
  const pnlColor = position.pnl >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-gray-900 border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white text-lg">{position.asset}</h4>
            {isLive && (
              <span className="text-xs font-medium text-green-500 bg-green-500/20 px-1.5 py-0.5 rounded">
                LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {position.quantity.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })} {position.asset}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-white">
            {displayValue.toLocaleString('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Current Price</span>
          <span className="text-white">
            ${position.currentPrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}
          </span>
        </div>

        {position.pnl !== 0 && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-700">
            <span className="text-gray-400">P&L</span>
            <div className="text-right">
              <p className={`font-medium ${pnlColor}`}>
                {position.pnl >= 0 ? '+' : ''}
                ${position.pnl.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className={`text-xs ${pnlColor}`}>
                {position.pnlPercentage >= 0 ? '+' : ''}
                {position.pnlPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}