'use client';

import { SUPPORTED_SYMBOLS, SupportedSymbol } from './types';

export interface TickerData {
  s: string; // symbol
  c: string; // current price
  P: string; // price change percent
  p: string; // price change
  h: string; // high price
  l: string; // low price
  v: string; // volume
  q: string; // quote volume
  o: string; // open price
  C: number; // close time
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export type PriceUpdateCallback = (update: PriceUpdate) => void;
export type ConnectionStatusCallback = (connected: boolean) => void;

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  private priceCallbacks: PriceUpdateCallback[] = [];
  private statusCallbacks: ConnectionStatusCallback[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    // Create stream URL for all supported symbols
    const streams = SUPPORTED_SYMBOLS.map(symbol =>
      `${symbol.toLowerCase()}@ticker`
    ).join('/');

    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Binance WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.notifyStatusChange(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // Handle combined stream format
          if (message.stream && message.data) {
            this.handleTickerData(message.data);
          } else {
            // Handle single stream format
            this.handleTickerData(message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('Binance WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.notifyStatusChange(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        // Only log errors if we're actively trying to connect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.warn('Binance WebSocket error (will retry):', error);
        }
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private handleTickerData(data: TickerData) {
    if (!SUPPORTED_SYMBOLS.includes(data.s as SupportedSymbol)) {
      return;
    }

    const update: PriceUpdate = {
      symbol: data.s,
      price: parseFloat(data.c),
      change: parseFloat(data.p),
      changePercent: parseFloat(data.P),
      high: parseFloat(data.h),
      low: parseFloat(data.l),
      volume: parseFloat(data.v),
    };

    this.priceCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in price callback:', error);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached. Please refresh the page.');
    }
  }

  private notifyStatusChange(connected: boolean) {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  public onPriceUpdate(callback: PriceUpdateCallback) {
    this.priceCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.priceCallbacks.indexOf(callback);
      if (index > -1) {
        this.priceCallbacks.splice(index, 1);
      }
    };
  }

  public onConnectionStatus(callback: ConnectionStatusCallback) {
    this.statusCallbacks.push(callback);

    // Call immediately with current status
    const isConnected = this.ws?.readyState === WebSocket.OPEN;
    callback(isConnected);

    // Return unsubscribe function
    return () => {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) {
        this.statusCallbacks.splice(index, 1);
      }
    };
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}