
import React from 'react';
import { OrcamentoBudgetGrid } from './OrcamentoBudgetGrid';
import { OrcamentoEmptyState } from './OrcamentoEmptyState';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoStudentViewProps {
  orcamentos?: OrcamentoEmpresa[];
  onSelectOrcamento: (id: string) => void;
}

export function OrcamentoStudentView({ orcamentos, onSelectOrcamento }: OrcamentoStudentViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meus Orçamentos</h2>
      
      {orcamentos && orcamentos.length > 0 ? (
        <OrcamentoBudgetGrid 
          orcamentos={orcamentos}
          onSelectOrcamento={onSelectOrcamento}
        />
      ) : (
        <OrcamentoEmptyState
          isMentor={false}
          title="Nenhum orçamento disponível"
          description="Você ainda não tem acesso a orçamentos. Entre em contato com seu mentor."
        />
      )}
    </div>
  );
}
