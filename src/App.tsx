import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { Switch } from './components/ui/switch';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900' 
        : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
    } flex items-center justify-center p-4`}>
      <div className="w-full max-w-2xl">
        {/* Header com título e toggle de tema */}
        <div className="relative mb-8">
          <h1 className={`text-4xl text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Calculadora Científica
          </h1>
          
          {/* Toggle de tema - posicionado à direita */}
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 px-4 py-2 rounded-lg ${
            isDark ? 'bg-white/10' : 'bg-white/50'
          } backdrop-blur-sm`}>
            <Sun className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              className="data-[state=checked]:bg-blue-600"
            />
            <Moon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Calculadora com histórico integrado */}
        <Calculator isDark={isDark} />
      </div>
    </div>
  );
}
