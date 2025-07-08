
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateVariance, getRowTotals } from './utils/comparisonCalculations';
import { formatCurrency, formatCurrencyCompact, getVarianceColor } from './utils/comparisonFormatters';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface MesInfo {
  nome: string;
  numero: number;
}

interface OrcamentoComparisonAccountRowProps {
  conta: any;
  valores: OrcamentoEmpresaValor[];
  getValorForConta: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => number;
  mesesParaExibir: MesInfo[];
  colWidthStyle: { width: string };
}

export function OrcamentoComparisonAccountRow({ 
  conta, 
  valores, 
  getValorForConta,
  mesesParaExibir,
  colWidthStyle
}: OrcamentoComparisonAccountRowProps) {
  // Calcular totais baseado nos meses a exibir
  const totals = mesesParaExibir.reduce(
    (acc, mes) => {
      const valorOrcado = getValorForConta(conta.id, mes.numero, 'orcado');
      const valorRealizado = getValorForConta(conta.id, mes.numero, 'realizado');
      return {
        totalOrcado: acc.totalOrcado + valorOrcado,
        totalRealizado: acc.totalRealizado + valorRealizado
      };
    },
    { totalOrcado: 0, totalRealizado: 0 }
  );

  const totalVariance = calculateVariance(totals.totalOrcado, totals.totalRealizado);

  const getVarianceIcon = (variance: number) => {
    if (variance > 5) return <TrendingUp className="h-4 w-4" />;
    if (variance < -5) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <td className="sticky left-0 z-20 bg-gray-800 hover:bg-gray-750 border-r border-gray-700 p-4 transition-colors" style={{ width: '360px' }}>
        <div className="text-sm text-gray-200 font-medium">
          <div className="truncate">
            {conta.codigo} - {conta.nome}
          </div>
        </div>
      </td>
      {mesesParaExibir.map((mes) => {
        const valorOrcado = getValorForConta(conta.id, mes.numero, 'orcado');
        const valorRealizado = getValorForConta(conta.id, mes.numero, 'realizado');
        const variance = calculateVariance(valorOrcado, valorRealizado);
        
        return (
          <td key={mes.numero} className="p-2 border-r border-gray-700" style={colWidthStyle}>
            <div className="grid grid-cols-3 gap-2 h-10">
              <div className="text-center bg-blue-900/40 px-2 py-1 rounded text-blue-300 text-sm font-medium flex items-center justify-center">
                <span className="truncate">{formatCurrency(valorOrcado)}</span>
              </div>
              <div className="text-center bg-green-900/40 px-2 py-1 rounded text-green-300 text-sm font-medium flex items-center justify-center">
                <span className="truncate">{formatCurrency(valorRealizado)}</span>
              </div>
              <div className={`text-center px-1 py-1 rounded flex items-center justify-center gap-1 ${getVarianceColor(variance)} bg-gray-600/40 text-sm font-medium`}>
                {getVarianceIcon(variance)}
                <span className="truncate">{variance.toFixed(1)}%</span>
              </div>
            </div>
          </td>
        );
      })}
      <td className="sticky right-0 z-20 bg-gray-800 hover:bg-gray-750 border-l border-gray-700 p-2 transition-colors" style={colWidthStyle}>
        <div className="grid grid-cols-3 gap-2 h-10">
          <div className="text-center bg-blue-900/50 px-2 py-1 rounded text-blue-300 text-sm font-semibold flex items-center justify-center">
            <span className="truncate">{formatCurrency(totals.totalOrcado)}</span>
          </div>
          <div className="text-center bg-green-900/50 px-2 py-1 rounded text-green-300 text-sm font-semibold flex items-center justify-center">
            <span className="truncate">{formatCurrency(totals.totalRealizado)}</span>
          </div>
          <div className={`text-center px-1 py-1 rounded flex items-center justify-center gap-1 ${getVarianceColor(totalVariance)} bg-gray-600/50 text-sm font-semibold`}>
            {getVarianceIcon(totalVariance)}
            <span className="truncate">{totalVariance.toFixed(1)}%</span>
          </div>
        </div>
      </td>
    </tr>
  );
}
