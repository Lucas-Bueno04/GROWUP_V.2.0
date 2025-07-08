
import React from 'react';
import { OrcamentoGridHeader } from './OrcamentoGridHeader';
import { OrcamentoGridTableOptimized } from './OrcamentoGridTableOptimized';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoYearlyGridProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  orcamentoEmpresaId: string;
  ano: number;
  tipo: 'orcado' | 'realizado';
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onTempValueChange: (key: string, value: number) => void;
  onCancelEdit?: () => void;
  onReplicateValue?: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onReplicateMonth?: (mes: number, tipo: 'orcado' | 'realizado') => void;
}

export function OrcamentoYearlyGrid({
  grupos,
  contas,
  valores,
  orcamentoEmpresaId,
  ano,
  tipo,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onCancelEdit,
  onReplicateValue,
  onReplicateMonth
}: OrcamentoYearlyGridProps) {
  return (
    <div className="space-y-6">
      <OrcamentoGridHeader ano={ano} tipo={tipo} />
      
      <OrcamentoGridTableOptimized
        grupos={grupos}
        contas={contas}
        valores={valores}
        orcamentoEmpresaId={orcamentoEmpresaId}
        tipo={tipo}
        podeEditar={podeEditar}
        editingCell={editingCell}
        tempValues={tempValues}
        isUpdating={isUpdating}
        onCellEdit={onCellEdit}
        onSaveValue={onSaveValue}
        onTempValueChange={onTempValueChange}
        onCancelEdit={onCancelEdit}
        onReplicateValue={onReplicateValue}
        onReplicateMonth={onReplicateMonth}
      />
    </div>
  );
}
