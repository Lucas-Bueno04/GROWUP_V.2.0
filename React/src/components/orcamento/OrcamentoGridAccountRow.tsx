
import React from 'react';
import { OrcamentoGridCell } from './OrcamentoGridCell';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoGridAccountRowProps {
  conta: any;
  valores: OrcamentoEmpresaValor[];
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
}

export function OrcamentoGridAccountRow({
  conta,
  valores,
  tipo,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onCancelEdit,
  onReplicateValue
}: OrcamentoGridAccountRowProps) {
  const getValorForConta = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRowTotal = (contaId: string) => {
    let total = 0;
    for (let mes = 1; mes <= 12; mes++) {
      total += getValorForConta(contaId, mes, tipo);
    }
    return total;
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <td className="sticky left-0 z-20 bg-gray-800 hover:bg-gray-750 border-r border-gray-700 p-4 transition-colors min-w-[320px] max-w-[320px] w-[320px]">
        <div className="font-medium text-gray-200">
          {conta.codigo} - {conta.nome}
        </div>
      </td>
      {[...Array(12)].map((_, mesIndex) => {
        const mes = mesIndex + 1;
        const valor = getValorForConta(conta.id, mes, tipo);
        
        return (
          <OrcamentoGridCell
            key={mes}
            valor={valor}
            contaId={conta.id}
            mes={mes}
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
          />
        );
      })}
      <td className="sticky right-0 z-20 bg-gray-800 hover:bg-gray-750 border-l border-gray-700 text-center font-semibold text-gray-100 p-2 transition-colors min-w-[140px] w-[140px]">
        {formatCurrency(getRowTotal(conta.id))}
      </td>
    </tr>
  );
}
