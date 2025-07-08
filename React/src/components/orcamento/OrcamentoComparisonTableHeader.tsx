
import React from 'react';

interface MesInfo {
  nome: string;
  numero: number;
}

interface OrcamentoComparisonTableHeaderProps {
  meses: MesInfo[];
  colWidthStyle: { width: string };
}

export function OrcamentoComparisonTableHeader({ 
  meses, 
  colWidthStyle 
}: OrcamentoComparisonTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-gray-700 bg-gray-800">
        <th className="sticky left-0 z-30 bg-gray-800 text-gray-200 font-semibold h-20 px-6 border-r border-gray-700 text-left" style={{ width: '360px' }}>
          <div className="text-base font-bold">Conta</div>
        </th>
        {meses.map((mes) => (
          <th key={mes.numero} className="text-center border-r border-gray-700 px-2" style={colWidthStyle}>
            <div className="py-3">
              <div className="font-bold text-gray-200 text-base mb-3">{mes.nome}</div>
              <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
                <div className="text-blue-300 px-2 py-1 bg-blue-900/30 rounded">Orçado</div>
                <div className="text-green-300 px-2 py-1 bg-green-900/30 rounded">Realizado</div>
                <div className="text-purple-300 px-2 py-1 bg-purple-900/30 rounded">Variação</div>
              </div>
            </div>
          </th>
        ))}
        <th className="sticky right-0 z-30 bg-gray-800 border-l border-gray-700 text-center px-2" style={colWidthStyle}>
          <div className="py-3">
            <div className="font-bold text-gray-200 text-base mb-3">
              {meses.length === 1 ? 'Total Mês' : 'Total Ano'}
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
              <div className="text-blue-300 px-2 py-1 bg-blue-900/30 rounded">Orçado</div>
              <div className="text-green-300 px-2 py-1 bg-green-900/30 rounded">Realizado</div>
              <div className="text-purple-300 px-2 py-1 bg-purple-900/30 rounded">Variação</div>
            </div>
          </div>
        </th>
      </tr>
    </thead>
  );
}
