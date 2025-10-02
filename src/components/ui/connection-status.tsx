import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate?: Date | null;
  className?: string;
}

export function ConnectionStatus({ isConnected, lastUpdate, className = '' }: ConnectionStatusProps) {
  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    } else if (diffSecs < 3600) {
      const mins = Math.floor(diffSecs / 60);
      return `${mins}m ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isConnected ? (
        <Wifi className="w-4 h-4 text-green-500" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500" />
      )}

      <div className="flex flex-col">
        <span className={`font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
        {lastUpdate && (
          <span className="text-xs text-gray-400">
            Updated {formatLastUpdate(lastUpdate)}
          </span>
        )}
      </div>
    </div>
  );
}