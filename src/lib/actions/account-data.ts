'use server';

import { BinanceClient } from '../binance/client';
import { convertUSDToPLN, formatPrice } from '../binance/utils';
import { Position, PortfolioSummary, AccountInfo } from '../binance/types';

function getBinanceClient(): BinanceClient {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Binance API credentials not configured');
  }

  return new BinanceClient(apiKey, apiSecret);
}

export async function getAccountInfo(): Promise<AccountInfo> {
  try {
    const client = getBinanceClient();
    return await client.getAccountInfo();
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw new Error('Failed to fetch account information');
  }
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  try {
    const client = getBinanceClient();

    // Get account info and current prices
    const [accountInfo, currentPrices, usdPlnRate] = await Promise.all([
      client.getAccountInfo(),
      client.getAllPrices(),
      client.getUSDPLNRate()
    ]);

    const positions: Position[] = [];
    let totalUSD = 0;

    // Process balances to create positions
    for (const balance of accountInfo.balances) {
      const free = formatPrice(balance.free);
      const locked = formatPrice(balance.locked);
      const total = free + locked;

      if (total > 0.00001) { // Only include positions with meaningful amounts
        const asset = balance.asset;
        let currentPrice = 0;
        let valueUSD = 0;

        if (asset === 'USDT' || asset === 'USD') {
          currentPrice = 1;
          valueUSD = total;
        } else {
          // Try to find price for this asset
          const symbolVariations = [
            `${asset}USDT`,
            `${asset}USD`,
            `${asset}BUSD`
          ];

          for (const symbol of symbolVariations) {
            if (currentPrices[symbol]) {
              currentPrice = currentPrices[symbol];
              valueUSD = total * currentPrice;
              break;
            }
          }
        }

        if (valueUSD > 0) {
          const position: Position = {
            symbol: `${asset}USDT`,
            asset,
            quantity: total,
            avgPrice: currentPrice, // For spot trading, we'll use current price as avg
            currentPrice,
            value: total,
            valueUSD,
            valuePLN: convertUSDToPLN(valueUSD, usdPlnRate),
            pnl: 0, // For spot positions without historical data
            pnlPercentage: 0
          };

          positions.push(position);
          totalUSD += valueUSD;
        }
      }
    }

    const totalPLN = convertUSDToPLN(totalUSD, usdPlnRate);
    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalPnLPercentage = totalUSD > 0 ? (totalPnL / totalUSD) * 100 : 0;

    return {
      totalUSD,
      totalPLN,
      totalPnL,
      totalPnLPercentage,
      positions: positions.sort((a, b) => b.valueUSD - a.valueUSD)
    };
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    throw new Error('Failed to fetch portfolio summary');
  }
}

export async function getUSDPLNRate(): Promise<number> {
  try {
    const client = getBinanceClient();
    return await client.getUSDPLNRate();
  } catch (error) {
    console.error('Error fetching USD/PLN rate:', error);
    return 4.0; // Fallback rate
  }
}