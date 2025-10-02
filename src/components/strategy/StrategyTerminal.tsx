'use client';

import { useEffect, useRef } from 'react';
import { TradeLog } from '@/lib/strategy/types';
import { Terminal } from 'lucide-react';

interface StrategyTerminalProps {
  logs: TradeLog[];
  isRunning: boolean;
}

export function StrategyTerminal({ logs, isRunning }: StrategyTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (logType: TradeLog['logType']): string => {
    switch (logType) {
      case 'BUY':
        return 'text-green-400';
      case 'SELL':
        return 'text-red-400';
      case 'HEDGE':
        return 'text-yellow-400';
      case 'CLOSE':
        return 'text-cyan-400';
      case 'ERROR':
        return 'text-red-500';
      case 'INFO':
      default:
        return 'text-blue-400';
    }
  };

  const getLogSymbol = (logType: TradeLog['logType']): string => {
    switch (logType) {
      case 'BUY':
        return '↑';
      case 'SELL':
        return '↓';
      case 'HEDGE':
        return '⇄';
      case 'CLOSE':
        return '✓';
      case 'ERROR':
        return '✗';
      case 'INFO':
      default:
        return 'ℹ';
    }
  };

  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-gray-950 rounded-lg border border-gray-800 h-full flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-gray-900">
        <Terminal size={16} className="text-green-500" />
        <span className="text-sm font-mono text-gray-400">strategy-executor</span>
        <div className="ml-auto flex items-center gap-2">
          {isRunning && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-500">RUNNING</span>
            </div>
          )}
          {!isRunning && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-xs font-mono text-gray-500">IDLE</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-950"
        style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '400px' }}
      >
        {logs.length === 0 ? (
          <div className="text-gray-600">
            <p>$ Waiting for strategy execution...</p>
            <p className="mt-2 text-gray-700">─ Configure parameters and click START to begin</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 hover:bg-gray-900 px-2 py-1 rounded">
                <span className="text-gray-600 select-none min-w-[70px]">
                  [{formatTimestamp(log.timestamp)}]
                </span>
                <span className={`${getLogColor(log.logType)} font-bold min-w-[20px]`}>
                  {getLogSymbol(log.logType)}
                </span>
                <span className={`${getLogColor(log.logType)} min-w-[50px]`}>
                  {log.logType}
                </span>
                <span className="text-gray-300 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 border-t border-gray-800 bg-gray-900 text-xs font-mono text-gray-600">
        <span>{logs.length} log entries</span>
        {logs.length > 0 && (
          <span className="ml-4">
            Last update: {formatTimestamp(logs[logs.length - 1].timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}
