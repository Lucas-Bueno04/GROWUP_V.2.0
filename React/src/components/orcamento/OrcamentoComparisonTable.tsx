
import React from 'react';
import { OrcamentoComparisonTableHeader } from './OrcamentoComparisonTableHeader';
import { OrcamentoComparisonGroupRow } from './OrcamentoComparisonGroupRow';
import { OrcamentoComparisonAccountRow } from './OrcamentoComparisonAccountRow';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoComparisonTableProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  gruposValores: any[];
  getValorForConta: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => number;
  getValorForGrupo: (grupoId: string, mes: number, tipo: 'orcado' | 'realizado') => number;
  viewMode: 'anual' | 'mensal';
  selectedMonth: number;
}

export function OrcamentoComparisonTable({
  grupos,
  contas,
  valores,
  gruposValores,
  getValorForConta,
  getValorForGrupo,
  viewMode,
  selectedMonth
}: OrcamentoComparisonTableProps) {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Determinar quais meses mostrar baseado no modo de visualização
  const mesesParaExibir = viewMode === 'anual' 
    ? meses.map((nome, index) => ({ nome, numero: index + 1 }))
    : [{ nome: meses[selectedMonth - 1], numero: selectedMonth }];

  // Calcular largura das colunas baseado no número de meses
  const colWidthStyle = viewMode === 'anual' ? { width: '360px' } : { width: '540px' };
  const tableMinWidth = viewMode === 'anual' ? '5400px' : '1440px';

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
      <div className="overflow-x-auto overflow-y-auto max-h-[700px]" style={{ scrollbarWidth: 'thin' }}>
        <table className="w-full border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
          <OrcamentoComparisonTableHeader 
            meses={mesesParaExibir} 
            colWidthStyle={colWidthStyle}
          />
          <tbody>
            {grupos?.map((grupo) => (
              <React.Fragment key={grupo.id}>
                <OrcamentoComparisonGroupRow 
                  grupo={grupo} 
                  gruposValores={gruposValores}
                  getValorForGrupo={getValorForGrupo}
                  mesesParaExibir={mesesParaExibir}
                  colWidthStyle={colWidthStyle}
                />
                {contas?.filter(conta => conta.grupo_id === grupo.id).map((conta) => (
                  <OrcamentoComparisonAccountRow
                    key={conta.id}
                    conta={conta}
                    valores={valores}
                    getValorForConta={getValorForConta}
                    mesesParaExibir={mesesParaExibir}
                    colWidthStyle={colWidthStyle}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
