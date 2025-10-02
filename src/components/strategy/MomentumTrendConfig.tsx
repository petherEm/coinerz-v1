'use client';

import { MomentumTrendConfig } from '@/lib/strategy/types';

interface MomentumTrendConfigPanelProps {
  config: MomentumTrendConfig;
  onChange: (config: MomentumTrendConfig) => void;
}

export function MomentumTrendConfigPanel({ config, onChange }: MomentumTrendConfigPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Trend Indicator
        </label>
        <select
          value={config.trendIndicator}
          onChange={(e) => onChange({
            ...config,
            trendIndicator: e.target.value as 'EMA' | 'SMA' | 'RSI'
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        >
          <option value="EMA">EMA (Exponential Moving Average)</option>
          <option value="SMA">SMA (Simple Moving Average)</option>
          <option value="RSI">RSI (Relative Strength Index)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Trend detection method (default: EMA)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Trend Period
        </label>
        <input
          type="number"
          step="5"
          min="5"
          max="100"
          value={config.trendPeriod}
          onChange={(e) => onChange({
            ...config,
            trendPeriod: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">EMA/SMA period (default: 20)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Momentum Period
        </label>
        <input
          type="number"
          step="1"
          min="5"
          max="30"
          value={config.momentumPeriod}
          onChange={(e) => onChange({
            ...config,
            momentumPeriod: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">RSI period (default: 14)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Stop Loss %
        </label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          max="10"
          value={config.stopLossPercent}
          onChange={(e) => onChange({
            ...config,
            stopLossPercent: parseFloat(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Quick exit on losses (default: 2%)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Take Profit %
        </label>
        <input
          type="number"
          step="0.5"
          min="1"
          max="20"
          value={config.takeProfitPercent}
          onChange={(e) => onChange({
            ...config,
            takeProfitPercent: parseFloat(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Quick profit taking (default: 5%)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Position Size (% of capital)
        </label>
        <input
          type="number"
          step="5"
          min="5"
          max="50"
          value={config.positionSize * 100}
          onChange={(e) => onChange({
            ...config,
            positionSize: parseFloat(e.target.value) / 100
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Per trade allocation (default: 10%)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Max Positions
        </label>
        <input
          type="number"
          step="1"
          min="1"
          max="10"
          value={config.maxPositions}
          onChange={(e) => onChange({
            ...config,
            maxPositions: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Maximum concurrent positions (default: 3)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          RSI Overbought
        </label>
        <input
          type="number"
          step="5"
          min="60"
          max="90"
          value={config.rsiOverbought}
          onChange={(e) => onChange({
            ...config,
            rsiOverbought: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">RSI overbought threshold (default: 70)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          RSI Oversold
        </label>
        <input
          type="number"
          step="5"
          min="10"
          max="40"
          value={config.rsiOversold}
          onChange={(e) => onChange({
            ...config,
            rsiOversold: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">RSI oversold threshold (default: 30)</p>
      </div>
    </div>
  );
}
