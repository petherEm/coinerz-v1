# 🪙 Coinerz

A real-time cryptocurrency portfolio dashboard and trading strategy simulator powered by Binance API.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)

## ✨ Features

### 📊 **Real-time Portfolio Dashboard**
- Live cryptocurrency price tracking via Binance WebSocket
- Real-time portfolio value calculation (USD/PLN)
- Interactive candlestick charts with 1-minute intervals
- 14 supported cryptocurrencies:
  - Bitcoin (BTC), Ethereum (ETH), Solana (SOL), BNB
  - Ripple (XRP), Cardano (ADA), Dogecoin (DOGE)
  - Polygon (MATIC), Polkadot (DOT), Litecoin (LTC)
  - Avalanche (AVAX), Chainlink (LINK), Cosmos (ATOM), Uniswap (UNI)

### 🧪 **Strategy Testing Simulator**
Test trading strategies with **live prices** but **simulated execution** (paper trading):

#### **Mean Reversion Strategy**
- Statistical arbitrage using pair trading
- Z-score based entry/exit signals
- Hedged positions (long/short pairs)
- Configurable correlation pairs

#### **Momentum/Trend Following Strategy**
- Trend detection using EMA, SMA, or RSI
- Quick profit-taking and stop-loss management
- Configurable risk parameters (stop-loss: 2%, take-profit: 5%)
- Automatic trend reversal detection

### 🖥️ **Bash-like Terminal Interface**
- Real-time trade execution logs
- Color-coded actions (BUY, SELL, HEDGE, CLOSE)
- Timestamped entries with detailed information
- Auto-scrolling for latest updates

### 📈 **Performance Tracking**
- Real vs Simulated portfolio comparison
- P&L calculations (realized + unrealized)
- Win rate, total trades, largest win/loss
- Position-level detail with entry prices

### 🎛️ **Interactive Controls**
- Start/Pause/Stop/Reset strategy execution
- Real-time strategy configuration
- Switch between strategies on-the-fly
- Persistent state during simulation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Binance API credentials ([Get them here](https://www.binance.com/en/my/settings/api-management))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd coinerz
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main dashboard page
│   ├── testing/                  # Strategy testing pages
│   │   ├── page.tsx
│   │   └── StrategyTestingClient.tsx
│   └── layout.tsx
├── components/
│   ├── charts/                   # Chart components
│   │   ├── CandlestickChart.tsx
│   │   └── ChartGrid.tsx
│   ├── dashboard/                # Dashboard components
│   │   └── Dashboard.tsx
│   ├── portfolio/                # Portfolio display
│   │   └── PortfolioSummary.tsx
│   ├── strategy/                 # Strategy testing UI
│   │   ├── StrategyTerminal.tsx
│   │   ├── StrategyControls.tsx
│   │   ├── PositionComparison.tsx
│   │   ├── MeanReversionConfig.tsx
│   │   └── MomentumTrendConfig.tsx
│   └── ui/                       # Shared UI components
├── lib/
│   ├── binance/                  # Binance API integration
│   │   ├── client.ts
│   │   ├── websocket.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── strategy/                 # Trading strategies
│   │   ├── meanReversion.ts
│   │   ├── momentumTrend.ts
│   │   ├── portfolioSimulator.ts
│   │   └── types.ts
│   └── actions/                  # Server actions
│       ├── account-data.ts
│       └── market-data.ts
└── hooks/
    ├── useBinanceWebSocket.ts    # WebSocket connection
    └── useStrategyExecution.ts   # Strategy execution logic
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router & Turbopack
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Charts**: [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📊 Trading Strategies

### Mean Reversion (Statistical Arbitrage)

**How it works:**
1. Monitors correlated cryptocurrency pairs (e.g., BTC/ETH)
2. Calculates the price spread between pairs
3. Enters hedged positions when spread deviates significantly (z-score > 2.0)
4. Exits when spread reverts to mean (z-score ≈ 0)

**Key Parameters:**
- Entry Z-Score: ±2.0 (how many standard deviations)
- Exit Z-Score: 0.0 (return to mean)
- Lookback Period: 50 data points
- Position Size: 10% of capital per trade
- Max Pairs: 4 concurrent positions

**Risk Profile:** Medium - Relies on correlations holding

### Momentum/Trend Following

**How it works:**
1. Monitors all cryptocurrencies using trend indicators
2. Detects strong bullish momentum (EMA/SMA/RSI)
3. Enters long positions on strong trends
4. Exits quickly on stop-loss (-2%), take-profit (+5%), or trend reversal

**Key Parameters:**
- Trend Indicator: EMA/SMA/RSI
- Trend Period: 20 (for EMA/SMA)
- Stop Loss: 2% (quick exit)
- Take Profit: 5% (quick gains)
- Position Size: 10% of capital per trade
- Max Positions: 3 concurrent

**Risk Profile:** Medium - Strict stop-losses limit downside

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:
- `BINANCE_API_KEY` (Secret)
- `BINANCE_API_SECRET` (Secret)

### Performance Considerations

- WebSocket connections run **client-side** (no server-side WebSocket needed)
- Binance API rate limit: 1200 requests/minute
- Recommended: Add Redis caching for high-traffic scenarios
- Vercel Pro plan recommended for production use

## 🔒 Security

- API keys stored in environment variables
- Client-side WebSocket connections (no server exposure)
- Read-only API permissions recommended
- No actual trading execution (simulation only)

## 📝 Development Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

**This application is for educational and testing purposes only.**

- Strategies are executed in **simulation mode** (paper trading)
- No real trades are placed on Binance
- Past performance does not guarantee future results
- Cryptocurrency trading carries significant risk
- Use at your own risk

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [Binance API](https://binance-docs.github.io/apidocs/)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [shadcn/ui](https://ui.shadcn.com/)
- Built with [Claude Code](https://claude.ai/code)

---

**Built with ❤️ using Next.js 15 and TypeScript**
