import { Dashboard } from "@/components/dashboard/Dashboard";
import { getAllKlineData, getAllCurrentPrices } from "@/lib/actions/market-data";
import { getPortfolioSummary } from "@/lib/actions/account-data";

export default async function Home() {
  try {
    // Fetch all data in parallel
    const [chartData, currentPrices, portfolio] = await Promise.all([
      getAllKlineData('1m', 100),
      getAllCurrentPrices(),
      getPortfolioSummary()
    ]);

    return (
      <Dashboard
        chartData={chartData}
        currentPrices={currentPrices}
        portfolio={portfolio}
      />
    );
  } catch (error) {
    console.error('Error loading dashboard data:', error);

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-400 mb-4">
            Failed to load cryptocurrency data. Please check your API configuration.
          </p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
}
