'use server';

import { BinanceClient } from '../binance/client';
import { CandlestickData, SUPPORTED_SYMBOLS, SupportedSymbol } from '../binance/types';

function getBinanceClient(): BinanceClient {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Binance API credentials not configured');
  }

  return new BinanceClient(apiKey, apiSecret);
}

export async function getKlineData(
  symbol: SupportedSymbol,
  interval: string = '1m',
  limit: number = 100
): Promise<CandlestickData[]> {
  try {
    const client = getBinanceClient();
    return await client.getKlines(symbol, interval, limit);
  } catch (error) {
    console.error(`Error fetching kline data for ${symbol}:`, error);
    throw new Error(`Failed to fetch chart data for ${symbol}`);
  }
}

export async function getAllKlineData(
  interval: string = '1m',
  limit: number = 100
): Promise<Record<SupportedSymbol, CandlestickData[]>> {
  try {
    const client = getBinanceClient();
    const promises = SUPPORTED_SYMBOLS.map(async (symbol) => {
      const data = await client.getKlines(symbol, interval, limit);
      return [symbol, data] as const;
    });

    const results = await Promise.all(promises);

    return Object.fromEntries(results) as Record<SupportedSymbol, CandlestickData[]>;
  } catch (error) {
    console.error('Error fetching all kline data:', error);
    throw new Error('Failed to fetch chart data');
  }
}

export async function getCurrentPrice(symbol: SupportedSymbol): Promise<number> {
  try {
    const client = getBinanceClient();
    return await client.getPrice(symbol);
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error);
    throw new Error(`Failed to fetch current price for ${symbol}`);
  }
}

export async function getAllCurrentPrices(): Promise<Record<string, number>> {
  try {
    const client = getBinanceClient();
    return await client.getAllPrices();
  } catch (error) {
    console.error('Error fetching all current prices:', error);
    throw new Error('Failed to fetch current prices');
  }
}