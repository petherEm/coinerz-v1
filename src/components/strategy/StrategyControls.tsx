'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Settings } from 'lucide-react';
import { StrategyType, StrategyStatus, StrategyConfig, MeanReversionConfig, MomentumTrendConfig } from '@/lib/strategy/types';
import { MeanReversionConfigPanel } from './MeanReversionConfig';
import { MomentumTrendConfigPanel } from './MomentumTrendConfig';

interface StrategyControlsProps {
  strategyType: StrategyType;
  status: StrategyStatus;
  config: StrategyConfig;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onConfigChange: (config: StrategyConfig) => void;
  onStrategyChange: (type: StrategyType) => void;
}

export function StrategyControls({
  strategyType,
  status,
  config,
  onStart,
  onPause,
  onStop,
  onReset,
  onConfigChange,
  onStrategyChange
}: StrategyControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  // Sync localConfig when config or strategyType changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config, strategyType]);

  const handleApplyConfig = () => {
    onConfigChange(localConfig);
    setShowSettings(false);
  };

  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  const getStrategyInfo = () => {
    if (strategyType === 'mean_reversion') {
      const mrConfig = config as MeanReversionConfig;
      return {
        name: 'Mean Reversion',
        description: 'Statistical Arbitrage - Pair trading with correlations',
        params: [
          { label: 'Entry Z-Score', value: `±${mrConfig.entryZScore.toFixed(1)}` },
          { label: 'Position Size', value: `${(mrConfig.positionSize * 100).toFixed(0)}%` },
          { label: 'Max Pairs', value: mrConfig.maxPositions.toString() }
        ]
      };
    } else {
      const mtConfig = config as MomentumTrendConfig;
      return {
        name: 'Momentum/Trend',
        description: 'Rides short-term momentum with strict risk management',
        params: [
          { label: 'Indicator', value: mtConfig.trendIndicator },
          { label: 'Stop Loss', value: `${mtConfig.stopLossPercent.toFixed(1)}%` },
          { label: 'Take Profit', value: `${mtConfig.takeProfitPercent.toFixed(1)}%` }
        ]
      };
    }
  };

  const strategyInfo = getStrategyInfo();

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      {/* Strategy Selector & Control Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Active Strategy</label>
          <select
            value={strategyType}
            onChange={(e) => onStrategyChange(e.target.value as StrategyType)}
            disabled={isRunning || isPaused}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            <option value="mean_reversion">Mean Reversion (Statistical Arbitrage)</option>
            <option value="momentum_trend">Momentum/Trend Following</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!isRunning && !isPaused && (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play size={16} />
              Start
            </button>
          )}

          {isRunning && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              <Pause size={16} />
              Pause
            </button>
          )}

          {isPaused && (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play size={16} />
              Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Square size={16} />
              Stop
            </button>
          )}

          <button
            onClick={onReset}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Strategy Info */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="text-white font-semibold mb-1">{strategyInfo.name}</h4>
        <p className="text-xs text-gray-400 mb-3">{strategyInfo.description}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {strategyInfo.params.map((param, idx) => (
            <div key={idx}>
              <div className="text-gray-400 text-xs">{param.label}</div>
              <div className="text-white font-semibold">{param.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-4">Strategy Configuration</h4>

          {strategyType === 'mean_reversion' ? (
            <MeanReversionConfigPanel
              config={localConfig as MeanReversionConfig}
              onChange={setLocalConfig}
            />
          ) : (
            <MomentumTrendConfigPanel
              config={localConfig as MomentumTrendConfig}
              onChange={setLocalConfig}
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setLocalConfig(config);
                setShowSettings(false);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyConfig}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
