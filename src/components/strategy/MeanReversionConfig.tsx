'use client';

import { MeanReversionConfig } from '@/lib/strategy/types';

interface MeanReversionConfigPanelProps {
  config: MeanReversionConfig;
  onChange: (config: MeanReversionConfig) => void;
}

export function MeanReversionConfigPanel({ config, onChange }: MeanReversionConfigPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Entry Z-Score Threshold
        </label>
        <input
          type="number"
          step="0.1"
          min="1.0"
          max="5.0"
          value={config.entryZScore}
          onChange={(e) => onChange({
            ...config,
            entryZScore: parseFloat(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Higher = more conservative (default: 2.0)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Exit Z-Score Threshold
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="2.0"
          value={config.exitZScore}
          onChange={(e) => onChange({
            ...config,
            exitZScore: parseFloat(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Exit when spread reverts (default: 0.0)</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Lookback Period
        </label>
        <input
          type="number"
          step="10"
          min="20"
          max="200"
          value={config.lookbackPeriod}
          onChange={(e) => onChange({
            ...config,
            lookbackPeriod: parseInt(e.target.value)
          })}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Data points for mean/std (default: 50)</p>
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
          Max Concurrent Pairs
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
        <p className="text-xs text-gray-500 mt-1">Maximum open pairs (default: 4)</p>
      </div>
    </div>
  );
}
