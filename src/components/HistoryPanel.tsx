import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Trash2 } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onSelectEntry: (result: string) => void;
  isDark: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onSelectEntry,
  isDark
}) => {
  if (history.length === 0) {
    return (
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Histórico
          </h2>
        </div>
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Nenhum cálculo realizado ainda
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Histórico
        </h2>
        <button
          onClick={onClearHistory}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'hover:bg-red-600/20 text-red-400' 
              : 'hover:bg-red-100 text-red-600'
          }`}
          title="Limpar histórico"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {[...history].reverse().map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry.result)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isDark
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {entry.expression}
              </div>
              <div className="text-xl">
                = {entry.result}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                {entry.timestamp.toLocaleTimeString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
