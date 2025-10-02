import crypto from 'crypto';

export function createSignature(queryString: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

export function createQueryString(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export function addTimestampAndSignature(
  params: Record<string, string | number>,
  apiSecret: string
): Record<string, string | number> {
  const timestamp = Date.now();
  const paramsWithTimestamp = { ...params, timestamp };

  const queryString = createQueryString(paramsWithTimestamp);
  const signature = createSignature(queryString, apiSecret);

  return { ...paramsWithTimestamp, signature };
}

export function formatPrice(price: string | number | undefined | null): number {
  if (price === undefined || price === null) {
    return 0;
  }
  return parseFloat(price.toString());
}

export function calculatePnL(quantity: number, avgPrice: number, currentPrice: number): {
  pnl: number;
  pnlPercentage: number;
} {
  const pnl = quantity * (currentPrice - avgPrice);
  const pnlPercentage = ((currentPrice - avgPrice) / avgPrice) * 100;

  return { pnl, pnlPercentage };
}

export function convertUSDToPLN(usdAmount: number, usdPlnRate: number): number {
  return usdAmount * usdPlnRate;
}