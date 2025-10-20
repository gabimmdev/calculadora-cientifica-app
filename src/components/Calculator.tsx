import React, { useState } from 'react';
import { CalculatorButton } from './CalculatorButton';
import { HistoryEntry } from './HistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Calculator as CalcIcon, History, Trash2 } from 'lucide-react';

interface CalculatorProps {
  isDark: boolean;
}

export const Calculator: React.FC<CalculatorProps> = ({ isDark }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Função para adicionar número ao display
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // Função para adicionar ponto decimal
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Função para limpar tudo
  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Função para deletar último dígito
  const deleteLastDigit = () => {
    if (!waitingForOperand) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay === '' ? '0' : newDisplay);
    }
  };

  // Função para realizar operações básicas
  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const prevValue = parseFloat(previousValue);
      let newValue = prevValue;

      // Realizar cálculo baseado na operação anterior
      switch (operation) {
        case '+':
          newValue = prevValue + inputValue;
          break;
        case '-':
          newValue = prevValue - inputValue;
          break;
        case '×':
          newValue = prevValue * inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            setDisplay('Erro: Div/0');
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
            return;
          }
          newValue = prevValue / inputValue;
          break;
        default:
          return;
      }

      // Formatar resultado para evitar muitas casas decimais
      const formattedValue = Number.isInteger(newValue) 
        ? newValue.toString() 
        : newValue.toFixed(8).replace(/\.?0+$/, '');

      setDisplay(formattedValue);
      setPreviousValue(formattedValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Função para calcular resultado (botão =)
  const calculateResult = () => {
    const inputValue = parseFloat(display);

    if (operation && previousValue !== null) {
      const prevValue = parseFloat(previousValue);
      let result = prevValue;

      switch (operation) {
        case '+':
          result = prevValue + inputValue;
          break;
        case '-':
          result = prevValue - inputValue;
          break;
        case '×':
          result = prevValue * inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            setDisplay('Erro: Div/0');
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
            return;
          }
          result = prevValue / inputValue;
          break;
      }

      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : result.toFixed(8).replace(/\.?0+$/, '');

      // Adicionar ao histórico
      setHistory(prev => [...prev, {
        id: Date.now().toString(),
        expression: `${previousValue} ${operation} ${display}`,
        result: formattedResult,
        timestamp: new Date()
      }]);

      setDisplay(formattedResult);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  // Funções científicas
  const square = () => {
    const value = parseFloat(display);
    const result = value * value;
    const formattedResult = result.toString();
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `${display}²`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const squareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      setDisplay('Erro: √ negativa');
      setWaitingForOperand(true);
      return;
    }
    const result = Math.sqrt(value);
    const formattedResult = Number.isInteger(result) 
      ? result.toString() 
      : result.toFixed(8).replace(/\.?0+$/, '');
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `√${display}`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const sine = () => {
    const value = parseFloat(display);
    const result = Math.sin(value * Math.PI / 180); // Converter para radianos
    const formattedResult = result.toFixed(8).replace(/\.?0+$/, '');
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `sin(${display}°)`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const cosine = () => {
    const value = parseFloat(display);
    const result = Math.cos(value * Math.PI / 180);
    const formattedResult = result.toFixed(8).replace(/\.?0+$/, '');
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `cos(${display}°)`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const tangent = () => {
    const value = parseFloat(display);
    // Verificar se é múltiplo ímpar de 90 graus
    if (value % 180 === 90) {
      setDisplay('Erro: tan indefinida');
      setWaitingForOperand(true);
      return;
    }
    const result = Math.tan(value * Math.PI / 180);
    const formattedResult = result.toFixed(8).replace(/\.?0+$/, '');
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `tan(${display}°)`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const percentage = () => {
    const value = parseFloat(display);
    const result = value / 100;
    const formattedResult = result.toString();
    
    // Adicionar ao histórico
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      expression: `${display}%`,
      result: formattedResult,
      timestamp: new Date()
    }]);
    
    setDisplay(formattedResult);
    setWaitingForOperand(true);
  };

  const insertPi = () => {
    setDisplay(Math.PI.toString());
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay((-value).toString());
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const selectHistoryEntry = (result: string) => {
    setDisplay(result);
    setWaitingForOperand(true);
  };

  // Handler para cliques nos botões
  const handleButtonClick = (value: string) => {
    if (value >= '0' && value <= '9') {
      inputDigit(value);
    } else if (value === '.') {
      inputDot();
    } else if (value === 'AC') {
      clearAll();
    } else if (value === 'DEL') {
      deleteLastDigit();
    } else if (['+', '-', '×', '÷'].includes(value)) {
      performOperation(value);
    } else if (value === '=') {
      calculateResult();
    } else if (value === 'x²') {
      square();
    } else if (value === '√') {
      squareRoot();
    } else if (value === 'sin') {
      sine();
    } else if (value === 'cos') {
      cosine();
    } else if (value === 'tan') {
      tangent();
    } else if (value === '%') {
      percentage();
    } else if (value === 'π') {
      insertPi();
    } else if (value === '+/-') {
      toggleSign();
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-2xl shadow-2xl ${
      isDark ? 'bg-gray-900' : 'bg-white border-2 border-gray-200'
    }`}>
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 mb-4 ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <TabsTrigger value="calculator" className={
            isDark ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'
          }>
            <CalcIcon className="w-4 h-4 mr-2" />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="history" className={
            isDark ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'
          }>
            <History className="w-4 h-4 mr-2" />
            Histórico ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-0">
          {/* Display */}
          <div className={`rounded-lg p-4 mb-6 min-h-[100px] flex flex-col justify-end ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {operation && previousValue && (
              <div className={`text-right text-sm mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {previousValue} {operation}
              </div>
            )}
            <div className={`text-right text-4xl overflow-hidden text-ellipsis ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {display}
            </div>
          </div>

          {/* Botões Científicos */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <CalculatorButton value="sin" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="cos" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="tan" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="x²" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="√" onClick={handleButtonClick} variant="function" isDark={isDark} />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            <CalculatorButton value="π" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="%" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="+/-" onClick={handleButtonClick} variant="function" isDark={isDark} />
            <CalculatorButton value="AC" onClick={handleButtonClick} variant="clear" isDark={isDark} />
            <CalculatorButton value="DEL" onClick={handleButtonClick} variant="delete" isDark={isDark} />
          </div>

          {/* Botões Principais */}
          <div className="grid grid-cols-4 gap-2">
            <CalculatorButton value="7" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="8" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="9" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="÷" onClick={handleButtonClick} variant="operator" isDark={isDark} />

            <CalculatorButton value="4" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="5" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="6" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="×" onClick={handleButtonClick} variant="operator" isDark={isDark} />

            <CalculatorButton value="1" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="2" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="3" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="-" onClick={handleButtonClick} variant="operator" isDark={isDark} />

            <CalculatorButton value="0" onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="." onClick={handleButtonClick} variant="number" isDark={isDark} />
            <CalculatorButton value="=" onClick={handleButtonClick} variant="equals" isDark={isDark} />
            <CalculatorButton value="+" onClick={handleButtonClick} variant="operator" isDark={isDark} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {history.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <History className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Nenhum cálculo realizado ainda
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {history.length} {history.length === 1 ? 'cálculo' : 'cálculos'}
                </h3>
                <button
                  onClick={clearHistory}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isDark 
                      ? 'hover:bg-red-600/20 text-red-400' 
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                >
                  <Trash2 size={16} />
                  Limpar
                </button>
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {[...history].reverse().map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => selectHistoryEntry(entry.result)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        isDark
                          ? 'bg-gray-800 hover:bg-gray-700 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {entry.expression}
                      </div>
                      <div className="text-2xl">
                        = {entry.result}
                      </div>
                      <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {entry.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
