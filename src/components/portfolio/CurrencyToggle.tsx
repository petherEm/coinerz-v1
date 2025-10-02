'use client';

import { Button } from '@/components/ui/button';

interface CurrencyToggleProps {
  showPLN: boolean;
  onToggle: (showPLN: boolean) => void;
}

export function CurrencyToggle({ showPLN, onToggle }: CurrencyToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
      <Button
        variant={!showPLN ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          !showPLN
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`}
      >
        USD
      </Button>
      <Button
        variant={showPLN ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          showPLN
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`}
      >
        PLN
      </Button>
    </div>
  );
}