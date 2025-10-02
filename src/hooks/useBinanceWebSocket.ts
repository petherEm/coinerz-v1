'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { BinanceWebSocket, PriceUpdate } from '@/lib/binance/websocket';

interface UseBinanceWebSocketReturn {
  prices: Record<string, PriceUpdate>;
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function useBinanceWebSocket(): UseBinanceWebSocketReturn {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<BinanceWebSocket | null>(null);

  const handlePriceUpdate = useCallback((update: PriceUpdate) => {
    setPrices(prev => ({
      ...prev,
      [update.symbol]: update
    }));
    setLastUpdate(new Date());
  }, []);

  const handleConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new BinanceWebSocket();
    wsRef.current = ws;

    // Subscribe to updates
    const unsubscribePrice = ws.onPriceUpdate(handlePriceUpdate);
    const unsubscribeStatus = ws.onConnectionStatus(handleConnectionStatus);

    // Cleanup on unmount
    return () => {
      unsubscribePrice();
      unsubscribeStatus();
      ws.disconnect();
      wsRef.current = null;
    };
  }, [handlePriceUpdate, handleConnectionStatus]);

  return {
    prices,
    isConnected,
    lastUpdate
  };
}