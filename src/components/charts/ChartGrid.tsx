import { CandlestickChart } from './CandlestickChart';
import { CandlestickData, SUPPORTED_SYMBOLS, SupportedSymbol } from '@/lib/binance/types';
import { PriceUpdate } from '@/lib/binance/websocket';

interface ChartGridProps {
  chartData: Record<SupportedSymbol, CandlestickData[]>;
  currentPrices: Record<string, number>;
  livePrices?: Record<string, PriceUpdate>;
}

export function ChartGrid({ chartData, currentPrices, livePrices }: ChartGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {SUPPORTED_SYMBOLS.map((symbol) => (
        <CandlestickChart
          key={symbol}
          symbol={symbol}
          data={chartData[symbol] || []}
          currentPrice={currentPrices[symbol]}
          livePrice={livePrices?.[symbol]}
        />
      ))}
    </div>
  );
}