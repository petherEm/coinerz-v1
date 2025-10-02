export const BINANCE_BASE_URL = 'https://api.binance.com';

export const ENDPOINTS = {
  KLINES: '/api/v3/klines',
  TICKER_PRICE: '/api/v3/ticker/price',
  ACCOUNT: '/api/v3/account',
  EXCHANGE_INFO: '/api/v3/exchangeInfo',
} as const;

export const buildKlinesUrl = (symbol: string, interval: string, limit = 100) => {
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: limit.toString(),
  });
  return `${BINANCE_BASE_URL}${ENDPOINTS.KLINES}?${params}`;
};

export const buildTickerPriceUrl = (symbol?: string) => {
  const params = new URLSearchParams();
  if (symbol) {
    params.set('symbol', symbol);
  }
  return `${BINANCE_BASE_URL}${ENDPOINTS.TICKER_PRICE}?${params}`;
};

export const buildAccountUrl = () => {
  return `${BINANCE_BASE_URL}${ENDPOINTS.ACCOUNT}`;
};