
import React from 'react';
import type { GroupCalculationResult } from './utils/groupCalculations';

interface OrcamentoGridGroupRowProps {
  grupo: any;
  typeColor: 'blue' | 'green';
  calculationResult?: GroupCalculationResult;
}

export function OrcamentoGridGroupRow({ 
  grupo, 
  typeColor, 
  calculationResult 
}: OrcamentoGridGroupRowProps) {
  const colors = {
    blue: { indicator: 'bg-blue-500' },
    green: { indicator: 'bg-green-500' }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <tr className="bg-gray-700 border-b border-gray-600">
      <td className="sticky left-0 z-20 bg-gray-700 border-r border-gray-600 font-semibold text-gray-100 p-4 min-w-[320px] max-w-[320px] w-[320px]">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors[typeColor].indicator}`}></div>
          {grupo.codigo} - {grupo.nome}
          {grupo.tipo_calculo === 'calculado' && (
            <span className="text-xs text-gray-400 ml-2">
              (Fórmula: {grupo.formula})
            </span>
          )}
        </div>
      </td>
      {Array.from({ length: 12 }, (_, index) => (
        <td key={index} className="p-2 min-w-[120px] w-[120px] text-center">
          {calculationResult && (
            <span className="text-sm font-medium text-gray-200">
              {formatCurrency(calculationResult.monthlyValues[index] || 0)}
            </span>
          )}
        </td>
      ))}
      <td className="sticky right-0 z-20 bg-gray-700 border-l border-gray-600 p-2 min-w-[140px] w-[140px] text-center">
        {calculationResult && (
          <span className="font-semibold text-gray-100">
            {formatCurrency(calculationResult.total)}
          </span>
        )}
      </td>
    </tr>
  );
}
