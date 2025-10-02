'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useBinanceWebSocket } from './useBinanceWebSocket';
import { MeanReversionStrategy } from '@/lib/strategy/meanReversion';
import { MomentumTrendStrategy } from '@/lib/strategy/momentumTrend';
import { PortfolioSimulator } from '@/lib/strategy/portfolioSimulator';
import {
  StrategyType,
  StrategyStatus,
  MeanReversionConfig,
  MomentumTrendConfig,
  StrategyConfig,
  TradeLog,
  SimulatedPosition,
  PerformanceMetrics
} from '@/lib/strategy/types';
import { SupportedSymbol, SUPPORTED_SYMBOLS } from '@/lib/binance/types';

const DEFAULT_MEAN_REVERSION_CONFIG: MeanReversionConfig = {
  entryZScore: 2.0,
  exitZScore: 0.0,
  lookbackPeriod: 50,
  positionSize: 0.1,
  maxPositions: 4,
  correlationPairs: [
    { symbolA: 'BTCUSDT', symbolB: 'ETHUSDT' },
    { symbolA: 'ETHUSDT', symbolB: 'BNBUSDT' },
    { symbolA: 'SOLUSDT', symbolB: 'AVAXUSDT' },
    { symbolA: 'ADAUSDT', symbolB: 'DOTUSDT' }
  ]
};

const DEFAULT_MOMENTUM_TREND_CONFIG: MomentumTrendConfig = {
  trendPeriod: 20,
  momentumPeriod: 14,
  stopLossPercent: 2.0,
  takeProfitPercent: 5.0,
  positionSize: 0.1,
  maxPositions: 3,
  trendIndicator: 'EMA',
  rsiOverbought: 70,
  rsiOversold: 30
};

const INITIAL_CAPITAL = 10000;

export function useStrategyExecution() {
  const { prices: livePrices, isConnected } = useBinanceWebSocket();

  const [strategyType, setStrategyType] = useState<StrategyType>('mean_reversion');
  const [status, setStatus] = useState<StrategyStatus>('idle');
  const [config, setConfig] = useState<StrategyConfig>(DEFAULT_MEAN_REVERSION_CONFIG);
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [positions, setPositions] = useState<SimulatedPosition[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalValue: INITIAL_CAPITAL,
    initialCapital: INITIAL_CAPITAL,
    realizedPnL: 0,
    unrealizedPnL: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    largestWin: 0,
    largestLoss: 0
  });
  const [cash, setCash] = useState<number>(INITIAL_CAPITAL);

  const meanReversionRef = useRef<MeanReversionStrategy | null>(null);
  const momentumTrendRef = useRef<MomentumTrendStrategy | null>(null);
  const portfolioRef = useRef<PortfolioSimulator | null>(null);

  const addLog = useCallback((log: TradeLog) => {
    setLogs(prev => [...prev, log]);
  }, []);

  const addInfoLog = useCallback((message: string) => {
    const log: TradeLog = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date(),
      logType: 'INFO',
      symbol: 'BTCUSDT',
      action: 'INFO',
      quantity: 0,
      price: 0,
      valueUSD: 0,
      message
    };
    addLog(log);
  }, [addLog]);

  const initialize = useCallback(() => {
    if (strategyType === 'mean_reversion') {
      meanReversionRef.current = new MeanReversionStrategy(config as MeanReversionConfig);
      momentumTrendRef.current = null;
    } else {
      momentumTrendRef.current = new MomentumTrendStrategy(config as MomentumTrendConfig);
      meanReversionRef.current = null;
    }

    portfolioRef.current = new PortfolioSimulator(INITIAL_CAPITAL);
    setLogs([]);
    setPositions([]);
    setCash(INITIAL_CAPITAL);
    setMetrics({
      totalValue: INITIAL_CAPITAL,
      initialCapital: INITIAL_CAPITAL,
      realizedPnL: 0,
      unrealizedPnL: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      largestWin: 0,
      largestLoss: 0
    });
  }, [config, strategyType]);

  const start = useCallback(() => {
    if (!isConnected) {
      addInfoLog('ERROR: WebSocket not connected. Please wait for connection.');
      return;
    }

    if (status === 'idle') {
      initialize();
    }

    setStatus('running');
    const strategyName = strategyType === 'mean_reversion' ? 'Mean Reversion' : 'Momentum/Trend';
    addInfoLog(`${strategyName} strategy started - Monitoring market for opportunities...`);
  }, [status, isConnected, initialize, addInfoLog, strategyType]);

  const pause = useCallback(() => {
    setStatus('paused');
    addInfoLog('Strategy paused');
  }, [addInfoLog]);

  const stop = useCallback(() => {
    setStatus('stopped');
    addInfoLog('Strategy stopped');

    if (portfolioRef.current) {
      const currentPositions = portfolioRef.current.getPositions();
      currentPositions.forEach(position => {
        const currentPrice = livePrices[position.symbol]?.price || position.currentPrice;
        const log = portfolioRef.current!.closePosition(position.symbol, position.side, currentPrice);
        if (log) addLog(log);
      });

      setPositions([]);
      setCash(portfolioRef.current.getCash());
      setMetrics(portfolioRef.current.getMetrics());
    }
  }, [livePrices, addLog, addInfoLog]);

  const reset = useCallback(() => {
    setStatus('idle');
    initialize();
    addInfoLog('Strategy reset to initial state');
  }, [initialize, addInfoLog]);

  const updateConfig = useCallback((newConfig: StrategyConfig) => {
    setConfig(newConfig);
    if (strategyType === 'mean_reversion' && meanReversionRef.current) {
      meanReversionRef.current = new MeanReversionStrategy(newConfig as MeanReversionConfig);
    } else if (strategyType === 'momentum_trend' && momentumTrendRef.current) {
      momentumTrendRef.current = new MomentumTrendStrategy(newConfig as MomentumTrendConfig);
    }
    addInfoLog('Configuration updated');
  }, [addInfoLog, strategyType]);

  const changeStrategy = useCallback((newType: StrategyType) => {
    if (status === 'running') {
      addInfoLog('Cannot change strategy while running. Please stop first.');
      return;
    }

    setStrategyType(newType);
    const newConfig = newType === 'mean_reversion'
      ? DEFAULT_MEAN_REVERSION_CONFIG
      : DEFAULT_MOMENTUM_TREND_CONFIG;
    setConfig(newConfig);
    setStatus('idle');
    setLogs([]);
    setPositions([]);
    setCash(INITIAL_CAPITAL);

    const strategyName = newType === 'mean_reversion' ? 'Mean Reversion' : 'Momentum/Trend';
    addInfoLog(`Switched to ${strategyName} strategy`);
  }, [status, addInfoLog]);

  // Mean Reversion execution logic
  useEffect(() => {
    if (status !== 'running' || strategyType !== 'mean_reversion' || !meanReversionRef.current || !portfolioRef.current) {
      return;
    }

    Object.entries(livePrices).forEach(([symbol, priceData]) => {
      meanReversionRef.current!.updatePrice(symbol as SupportedSymbol, priceData.price);
    });

    const currentPrices = Object.entries(livePrices).reduce((acc, [symbol, data]) => {
      acc[symbol as SupportedSymbol] = data.price;
      return acc;
    }, {} as Record<SupportedSymbol, number>);

    portfolioRef.current.updatePrices(currentPrices);

    const mrConfig = config as MeanReversionConfig;
    mrConfig.correlationPairs.forEach(pair => {
      const priceA = livePrices[pair.symbolA]?.price;
      const priceB = livePrices[pair.symbolB]?.price;

      if (!priceA || !priceB) return;

      const signal = meanReversionRef.current!.generateSignal(pair.symbolA, pair.symbolB, priceA, priceB);
      if (!signal || signal.action === 'HOLD') return;

      const positionValue = INITIAL_CAPITAL * mrConfig.positionSize;

      if (signal.action === 'OPEN_LONG_A_SHORT_B') {
        const quantityA = positionValue / priceA;
        const quantityB = positionValue / priceB;

        const logA = portfolioRef.current!.executeTrade(pair.symbolA, 'LONG', quantityA, priceA);
        const logB = portfolioRef.current!.executeTrade(pair.symbolB, 'SHORT', quantityB, priceB);

        if (logA) addLog(logA);
        if (logB) addLog(logB);

        if (logA?.logType !== 'ERROR' && logB?.logType !== 'ERROR') {
          meanReversionRef.current!.openPair(pair.symbolA, pair.symbolB);
          addInfoLog(`Pair opened: LONG ${pair.symbolA} / SHORT ${pair.symbolB} | Z-Score: ${signal.zScore.toFixed(2)}`);
        }
      } else if (signal.action === 'OPEN_SHORT_A_LONG_B') {
        const quantityA = positionValue / priceA;
        const quantityB = positionValue / priceB;

        const logA = portfolioRef.current!.executeTrade(pair.symbolA, 'SHORT', quantityA, priceA);
        const logB = portfolioRef.current!.executeTrade(pair.symbolB, 'LONG', quantityB, priceB);

        if (logA) addLog(logA);
        if (logB) addLog(logB);

        if (logA?.logType !== 'ERROR' && logB?.logType !== 'ERROR') {
          meanReversionRef.current!.openPair(pair.symbolA, pair.symbolB);
          addInfoLog(`Pair opened: SHORT ${pair.symbolA} / LONG ${pair.symbolB} | Z-Score: ${signal.zScore.toFixed(2)}`);
        }
      } else if (signal.action === 'CLOSE_POSITIONS') {
        const posA = portfolioRef.current!.getPosition(pair.symbolA, 'LONG') ||
                      portfolioRef.current!.getPosition(pair.symbolA, 'SHORT');
        const posB = portfolioRef.current!.getPosition(pair.symbolB, 'LONG') ||
                      portfolioRef.current!.getPosition(pair.symbolB, 'SHORT');

        if (posA) {
          const logA = portfolioRef.current!.closePosition(pair.symbolA, posA.side, priceA);
          if (logA) addLog(logA);
        }

        if (posB) {
          const logB = portfolioRef.current!.closePosition(pair.symbolB, posB.side, priceB);
          if (logB) addLog(logB);
        }

        meanReversionRef.current!.closePair(pair.symbolA, pair.symbolB);
        addInfoLog(`Pair closed: ${pair.symbolA} / ${pair.symbolB} | Z-Score: ${signal.zScore.toFixed(2)} (reverted to mean)`);
      }
    });

    setPositions(portfolioRef.current.getPositions());
    setCash(portfolioRef.current.getCash());
    setMetrics(portfolioRef.current.getMetrics());

  }, [status, strategyType, livePrices, config, addLog, addInfoLog]);

  // Momentum/Trend execution logic
  useEffect(() => {
    if (status !== 'running' || strategyType !== 'momentum_trend' || !momentumTrendRef.current || !portfolioRef.current) {
      return;
    }

    Object.entries(livePrices).forEach(([symbol, priceData]) => {
      momentumTrendRef.current!.updatePrice(symbol as SupportedSymbol, priceData.price);
    });

    const currentPrices = Object.entries(livePrices).reduce((acc, [symbol, data]) => {
      acc[symbol as SupportedSymbol] = data.price;
      return acc;
    }, {} as Record<SupportedSymbol, number>);

    portfolioRef.current.updatePrices(currentPrices);

    const mtConfig = config as MomentumTrendConfig;

    SUPPORTED_SYMBOLS.forEach(symbol => {
      const currentPrice = livePrices[symbol]?.price;
      if (!currentPrice) return;

      const signal = momentumTrendRef.current!.generateSignal(symbol, currentPrice);
      if (!signal || signal.action === 'HOLD') return;

      if (signal.action === 'BUY') {
        const positionValue = INITIAL_CAPITAL * mtConfig.positionSize;
        const quantity = positionValue / currentPrice;

        const log = portfolioRef.current!.executeTrade(symbol, 'LONG', quantity, currentPrice);
        if (log) addLog(log);

        if (log?.logType !== 'ERROR') {
          momentumTrendRef.current!.openPosition(symbol, currentPrice);
          addInfoLog(`Opened LONG ${symbol} | ${signal.indicator}: ${signal.indicatorValue.toFixed(2)} | Trend: ${signal.trend}`);
        }
      } else if (signal.action === 'CLOSE') {
        const position = portfolioRef.current!.getPosition(symbol, 'LONG');
        if (position) {
          const log = portfolioRef.current!.closePosition(symbol, 'LONG', currentPrice);
          if (log) addLog(log);

          momentumTrendRef.current!.closePosition(symbol);
          addInfoLog(`Closed ${symbol} | ${signal.indicator}: ${signal.indicatorValue.toFixed(2)}`);
        }
      }
    });

    setPositions(portfolioRef.current.getPositions());
    setCash(portfolioRef.current.getCash());
    setMetrics(portfolioRef.current.getMetrics());

  }, [status, strategyType, livePrices, config, addLog, addInfoLog]);

  return {
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
  };
}
