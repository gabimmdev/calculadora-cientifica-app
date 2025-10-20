import React from 'react';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  className?: string;
  variant?: 'number' | 'operator' | 'function' | 'equals' | 'clear' | 'delete';
  isDark?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  className = '',
  variant = 'number',
  isDark = true
}) => {
  // Define estilos base para cada variante de botão
  const baseStyles = 'h-16 rounded-lg transition-all duration-200 active:scale-95 hover:opacity-90 flex items-center justify-center';
  
  // Estilos para modo escuro
  const darkVariantStyles = {
    number: 'bg-gray-700 text-white',
    operator: 'bg-orange-500 text-white',
    function: 'bg-gray-600 text-white',
    equals: 'bg-green-600 text-white',
    clear: 'bg-red-600 text-white',
    delete: 'bg-yellow-600 text-white'
  };

  // Estilos para modo claro
  const lightVariantStyles = {
    number: 'bg-white text-gray-900 border-2 border-gray-200',
    operator: 'bg-orange-400 text-white',
    function: 'bg-blue-500 text-white',
    equals: 'bg-green-500 text-white',
    clear: 'bg-red-500 text-white',
    delete: 'bg-yellow-500 text-white'
  };

  const variantStyles = isDark ? darkVariantStyles : lightVariantStyles;

  return (
    <button
      onClick={() => onClick(value)}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {value}
    </button>
  );
};
