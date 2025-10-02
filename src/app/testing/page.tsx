import { StrategyTestingClient } from './StrategyTestingClient';
import { getPortfolioSummary } from '@/lib/actions/account-data';

export default async function StrategyTestingPage() {
  try {
    // Fetch real portfolio data
    const realPortfolio = await getPortfolioSummary();

    return <StrategyTestingClient realPortfolio={realPortfolio} />;
  } catch (error) {
    console.error('Error loading strategy testing page:', error);

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Strategy Testing
          </h1>
          <p className="text-gray-400 mb-4">
            Failed to load portfolio data. Please check your API configuration.
          </p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
}
