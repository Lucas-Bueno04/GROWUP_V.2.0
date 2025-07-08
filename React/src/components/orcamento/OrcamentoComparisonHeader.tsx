
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface OrcamentoComparisonHeaderProps {
  ano: number;
}

export function OrcamentoComparisonHeader({ ano }: OrcamentoComparisonHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-purple-600/20">
        <TrendingUp className="h-5 w-5 text-purple-400" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-100">
          Ano {ano} - Análise Comparativa
        </h3>
        <p className="text-sm text-gray-400">
          Comparação entre valores orçados e realizados
        </p>
      </div>
    </div>
  );
}
