import axios, { AxiosInstance } from 'axios';
import {
  BINANCE_BASE_URL,
  buildKlinesUrl,
  buildTickerPriceUrl,
  buildAccountUrl
} from './endpoints';
import {
  addTimestampAndSignature,
  formatPrice
} from './utils';
import {
  CandlestickData,
  PriceData,
  AccountInfo,
  SUPPORTED_SYMBOLS,
  SupportedSymbol
} from './types';

export class BinanceClient {
  private apiKey: string;
  private apiSecret: string;
  private client: AxiosInstance;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    this.client = axios.create({
      baseURL: BINANCE_BASE_URL,
      timeout: 10000,
    });

    // Add API key to all requests
    this.client.interceptors.request.use((config) => {
      config.headers['X-MBX-APIKEY'] = this.apiKey;
      return config;
    });
  }

  async getKlines(symbol: string, interval: string, limit = 100): Promise<CandlestickData[]> {
    try {
      // Use direct axios call without API key for public endpoint
      const url = buildKlinesUrl(symbol, interval, limit);
      const response = await axios.get(url);

      const klines = response.data;

      // Binance returns an array of arrays, not objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return klines.map((kline: any[]) => ({
        time: kline[0] / 1000, // Convert to seconds for lightweight-charts
        open: formatPrice(kline[1]),
        high: formatPrice(kline[2]),
        low: formatPrice(kline[3]),
        close: formatPrice(kline[4]),
        volume: formatPrice(kline[5]),
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      throw new Error(`Failed to fetch klines for ${symbol}`);
    }
  }

  async getPrice(symbol: string): Promise<number> {
    try {
      // Use direct axios call without API key for public endpoint
      const url = buildTickerPriceUrl(symbol);
      const response = await axios.get(url);

      const priceData: PriceData = response.data;
      return formatPrice(priceData.price);
    } catch (error) {
      console.error('Error fetching price:', error);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  async getAllPrices(): Promise<Record<string, number>> {
    try {
      // Use direct axios call without API key for public endpoint
      const url = buildTickerPriceUrl();
      const response = await axios.get(url);

      const prices: PriceData[] = response.data;
      const priceMap: Record<string, number> = {};

      prices.forEach((price) => {
        if (SUPPORTED_SYMBOLS.includes(price.symbol as SupportedSymbol)) {
          priceMap[price.symbol] = formatPrice(price.price);
        }
      });

      return priceMap;
    } catch (error) {
      console.error('Error fetching all prices:', error);
      throw new Error('Failed to fetch prices');
    }
  }

  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const params = addTimestampAndSignature({}, this.apiSecret);
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const url = `${buildAccountUrl()}?${queryString}`;
      const response = await this.client.get(url);

      return response.data;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  async getUSDPLNRate(): Promise<number> {
    try {
      // Try to get USDTPLN or use a fallback rate - use direct axios for public endpoint
      const response = await axios.get(buildTickerPriceUrl('USDTPLN'));
      return formatPrice(response.data.price);
    } catch {
      // Fallback to approximate rate if USDTPLN pair doesn't exist
      console.warn('USDTPLN pair not available, using fallback rate');
      return 4.0; // Approximate USD to PLN rate
    }
  }
}