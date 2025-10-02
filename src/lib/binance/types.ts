export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceData {
  symbol: string;
  price: string;
}

export interface AccountBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface AccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: AccountBalance[];
  permissions: string[];
}

export interface Position {
  symbol: string;
  asset: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  valueUSD: number;
  valuePLN: number;
  pnl: number;
  pnlPercentage: number;
}

export interface PortfolioSummary {
  totalUSD: number;
  totalPLN: number;
  totalPnL: number;
  totalPnLPercentage: number;
  positions: Position[];
}

export interface ExchangeRate {
  symbol: string;
  rate: number;
}

export const SUPPORTED_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'SOLUSDT',
  'BNBUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'MATICUSDT',
  'DOTUSDT',
  'LTCUSDT',
  'AVAXUSDT',
  'LINKUSDT',
  'ATOMUSDT',
  'UNIUSDT'
] as const;
export type SupportedSymbol = typeof SUPPORTED_SYMBOLS[number];

export const COIN_NAMES = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  SOLUSDT: 'Solana',
  BNBUSDT: 'BNB',
  XRPUSDT: 'Ripple',
  ADAUSDT: 'Cardano',
  DOGEUSDT: 'Dogecoin',
  MATICUSDT: 'Polygon',
  DOTUSDT: 'Polkadot',
  LTCUSDT: 'Litecoin',
  AVAXUSDT: 'Avalanche',
  LINKUSDT: 'Chainlink',
  ATOMUSDT: 'Cosmos',
  UNIUSDT: 'Uniswap'
} as const;

export const INTERVALS = {
  '1m': '1m',
  '3m': '3m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '6h': '6h',
  '8h': '8h',
  '12h': '12h',
  '1d': '1d',
  '3d': '3d',
  '1w': '1w',
  '1M': '1M'
} as const;