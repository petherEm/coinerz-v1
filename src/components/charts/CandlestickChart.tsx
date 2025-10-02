'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { CandlestickData, SupportedSymbol, COIN_NAMES } from '@/lib/binance/types';
import { PriceUpdate } from '@/lib/binance/websocket';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CandlestickChartProps {
  symbol: SupportedSymbol;
  data: CandlestickData[];
  currentPrice?: number;
  livePrice?: PriceUpdate;
  className?: string;
}

export function CandlestickChart({ symbol, data, currentPrice, livePrice }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Create chart once on mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#4b5563',
        textColor: '#d1d5db',
      },
      timeScale: {
        borderColor: '#4b5563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update chart data when data changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Convert data format for lightweight-charts
      const chartData = data.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      seriesRef.current.setData(chartData);

      // Fit content to show all data
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

  const coinName = COIN_NAMES[symbol];
  const baseSymbol = symbol.replace('USDT', '');

  // Use live price if available, fallback to currentPrice
  const displayPrice = livePrice?.price ?? currentPrice;
  const priceChange = livePrice?.change;
  const priceChangePercent = livePrice?.changePercent;

  // Price change color
  const priceChangeColor = priceChange && priceChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{coinName}</h3>
            <p className="text-sm text-gray-400">{baseSymbol}/USDT</p>
          </div>
          <div className="flex items-center gap-4">
            {displayPrice && (
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  ${displayPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </p>
                {priceChange !== undefined && priceChangePercent !== undefined && (
                  <p className={`text-sm font-medium ${priceChangeColor}`}>
                    {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {livePrice ? 'LIVE' : 'USDT'}
                </p>
              </div>
            )}
            <button
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isExpanded ? '300px' : '0px',
          borderTop: isExpanded ? '1px solid rgb(55, 65, 81)' : 'none'
        }}
      >
        <div ref={chartContainerRef} className="w-full h-[300px]" />
      </div>
    </div>
  );
}