
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { OrcamentoYearlyTabs } from './OrcamentoYearlyTabs';
import type { OrcamentoEmpresa, OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoEmpresaContentProps {
  orcamento: OrcamentoEmpresa;
  valores: OrcamentoEmpresaValor[];
  grupos: any[];
  contas: any[];
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => Promise<void>;
  onTempValueChange: (key: string, value: number) => void;
  onReplicateValue?: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => Promise<void>;
  onReplicateMonth?: (mes: number, tipo: 'orcado' | 'realizado') => Promise<void>;
}

export function OrcamentoEmpresaContent({
  orcamento,
  valores,
  grupos,
  contas,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onReplicateValue,
  onReplicateMonth
}: OrcamentoEmpresaContentProps) {
  console.log('OrcamentoEmpresaContent - Renderizando conteúdo principal');

  return (
    <CardContent className="p-0">
      <OrcamentoYearlyTabs
        orcamento={orcamento}
        valores={valores}
        grupos={grupos}
        contas={contas}
        podeEditar={podeEditar}
        editingCell={editingCell}
        tempValues={tempValues}
        isUpdating={isUpdating}
        onCellEdit={onCellEdit}
        onSaveValue={onSaveValue}
        onTempValueChange={onTempValueChange}
        onReplicateValue={onReplicateValue}
        onReplicateMonth={onReplicateMonth}
      />
    </CardContent>
  );
}
