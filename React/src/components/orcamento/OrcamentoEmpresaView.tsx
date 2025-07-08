
import React from 'react';
import { Card } from '@/components/ui/card';
import { OrcamentoEmpresaHeader } from './OrcamentoEmpresaHeader';
import { OrcamentoEmpresaContent } from './OrcamentoEmpresaContent';
import { OrcamentoEmpresaLoadingState } from './OrcamentoEmpresaLoadingState';
import { OrcamentoEmpresaErrorState } from './OrcamentoEmpresaErrorState';
import { useOrcamentoEmpresaData } from './hooks/useOrcamentoEmpresaData';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoEmpresaViewProps {
  orcamento: OrcamentoEmpresa;
  onOrcamentoDeleted?: () => void;
}

export function OrcamentoEmpresaView({ orcamento, onOrcamentoDeleted }: OrcamentoEmpresaViewProps) {
  const {
    grupos,
    contas,
    valores,
    podeEditar,
    isLoading,
    error,
    editingCell,
    tempValues,
    isUpdating,
    onCellEdit,
    onSaveValue,
    onTempValueChange,
    onReplicateValue,
    onReplicateMonth
  } = useOrcamentoEmpresaData({ orcamento });

  if (isLoading) {
    return <OrcamentoEmpresaLoadingState />;
  }

  if (error) {
    return <OrcamentoEmpresaErrorState error={error} />;
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <OrcamentoEmpresaHeader 
        orcamento={orcamento} 
        podeEditar={podeEditar}
        onOrcamentoDeleted={onOrcamentoDeleted}
      />
      <OrcamentoEmpresaContent
        orcamento={orcamento}
        grupos={grupos}
        contas={contas}
        valores={valores}
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
    </Card>
  );
}
