
import React from 'react';
import { OrcamentoBudgetCard } from './OrcamentoBudgetCard';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoBudgetGridProps {
  orcamentos: OrcamentoEmpresa[];
  onSelectOrcamento: (id: string) => void;
}

export function OrcamentoBudgetGrid({ orcamentos, onSelectOrcamento }: OrcamentoBudgetGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {orcamentos.map((orcamento) => (
        <OrcamentoBudgetCard 
          key={orcamento.id}
          orcamento={orcamento}
          onSelect={onSelectOrcamento}
        />
      ))}
    </div>
  );
}
