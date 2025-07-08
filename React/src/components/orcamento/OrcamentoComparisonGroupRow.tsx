
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateVariance, getGroupTotals } from './utils/comparisonCalculations';
import { formatCurrency, formatCurrencyCompact, getVarianceColor } from './utils/comparisonFormatters';

interface MesInfo {
  nome: string;
  numero: number;
}

interface OrcamentoComparisonGroupRowProps {
  grupo: any;
  gruposValores: any[];
  getValorForGrupo: (grupoId: string, mes: number, tipo: 'orcado' | 'realizado') => number;
  mesesParaExibir: MesInfo[];
  colWidthStyle: { width: string };
}

export function OrcamentoComparisonGroupRow({ 
  grupo, 
  gruposValores,
  getValorForGrupo,
  mesesParaExibir,
  colWidthStyle
}: OrcamentoComparisonGroupRowProps) {
  // Calcular totais baseado nos meses a exibir
  const totals = mesesParaExibir.reduce(
    (acc, mes) => {
      const valorOrcado = getValorForGrupo(grupo.id, mes.numero, 'orcado');
      const valorRealizado = getValorForGrupo(grupo.id, mes.numero, 'realizado');
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
    <tr className="bg-gray-700 border-b border-gray-600 hover:bg-gray-650 transition-colors">
      <td className="sticky left-0 z-20 bg-gray-700 hover:bg-gray-650 border-r border-gray-600 font-semibold text-gray-100 p-4 transition-colors" style={{ width: '360px' }}>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-purple-200 truncate">
              {grupo.codigo} - {grupo.nome}
            </div>
          </div>
        </div>
      </td>
      {mesesParaExibir.map((mes) => {
        const valorOrcado = getValorForGrupo(grupo.id, mes.numero, 'orcado');
        const valorRealizado = getValorForGrupo(grupo.id, mes.numero, 'realizado');
        const variance = calculateVariance(valorOrcado, valorRealizado);
        
        return (
          <td key={mes.numero} className="p-2 border-r border-gray-600" style={colWidthStyle}>
            <div className="grid grid-cols-3 gap-2 h-12">
              <div className="text-center bg-blue-900/50 px-3 py-2 rounded text-blue-200 text-sm font-bold flex items-center justify-center">
                <span className="truncate">{formatCurrency(valorOrcado)}</span>
              </div>
              <div className="text-center bg-green-900/50 px-3 py-2 rounded text-green-200 text-sm font-bold flex items-center justify-center">
                <span className="truncate">{formatCurrency(valorRealizado)}</span>
              </div>
              <div className={`text-center px-2 py-2 rounded flex items-center justify-center gap-2 ${getVarianceColor(variance)} bg-gray-600/50 text-sm font-bold`}>
                {getVarianceIcon(variance)}
                <span className="truncate">{variance.toFixed(1)}%</span>
              </div>
            </div>
          </td>
        );
      })}
      <td className="sticky right-0 z-20 bg-gray-700 hover:bg-gray-650 border-l border-gray-600 p-2 transition-colors" style={colWidthStyle}>
        <div className="grid grid-cols-3 gap-2 h-12">
          <div className="text-center bg-blue-900/60 px-3 py-2 rounded text-blue-200 text-sm font-bold flex items-center justify-center">
            <span className="truncate">{formatCurrency(totals.totalOrcado)}</span>
          </div>
          <div className="text-center bg-green-900/60 px-3 py-2 rounded text-green-200 text-sm font-bold flex items-center justify-center">
            <span className="truncate">{formatCurrency(totals.totalRealizado)}</span>
          </div>
          <div className={`text-center px-2 py-2 rounded flex items-center justify-center gap-2 ${getVarianceColor(totalVariance)} bg-gray-600/60 text-sm font-bold`}>
            {getVarianceIcon(totalVariance)}
            <span className="truncate">{totalVariance.toFixed(1)}%</span>
          </div>
        </div>
      </td>
    </tr>
  );
}
