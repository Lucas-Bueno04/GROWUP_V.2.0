
import React from 'react';
import { Calculator } from 'lucide-react';

interface OrcamentoGridHeaderProps {
  ano: number;
  tipo: 'orcado' | 'realizado';
}

export function OrcamentoGridHeader({ ano, tipo }: OrcamentoGridHeaderProps) {
  const typeColor = tipo === 'orcado' ? 'blue' : 'green';

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-${typeColor}-600/20`}>
        <Calculator className={`h-5 w-5 text-${typeColor}-400`} />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-100">
          Ano {ano} - {tipo === 'orcado' ? 'Valores Orçados' : 'Valores Realizados'}
        </h3>
        <p className="text-sm text-gray-400">
          {tipo === 'orcado' ? 'Planejamento financeiro' : 'Valores executados'}
        </p>
      </div>
    </div>
  );
}
