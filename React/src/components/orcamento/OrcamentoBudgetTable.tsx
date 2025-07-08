
import React from 'react';
import { OrcamentoCellEditor } from './OrcamentoCellEditor';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoBudgetTableProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  mes: number;
  ano: number;
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onTempValueChange: (key: string, value: number) => void;
  onCancelEdit?: () => void;
}

export function OrcamentoBudgetTable({
  grupos,
  contas,
  valores,
  mes,
  ano,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onCancelEdit
}: OrcamentoBudgetTableProps) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getValorForConta = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {meses[mes - 1]} {ano}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 p-2 text-left">Conta</th>
              <th className="border border-gray-200 p-2 text-center">Orçado</th>
              <th className="border border-gray-200 p-2 text-center">Realizado</th>
              <th className="border border-gray-200 p-2 text-center">Variação</th>
            </tr>
          </thead>
          <tbody>
            {grupos?.map((grupo) => (
              <React.Fragment key={grupo.id}>
                <tr className="bg-blue-50">
                  <td colSpan={4} className="border border-gray-200 p-2 font-semibold">
                    {grupo.codigo} - {grupo.nome}
                  </td>
                </tr>
                {contas?.filter(conta => conta.grupo_id === grupo.id).map((conta) => {
                  const valorOrcado = getValorForConta(conta.id, mes, 'orcado');
                  const valorRealizado = getValorForConta(conta.id, mes, 'realizado');
                  const variacao = valorOrcado > 0 ? ((valorRealizado - valorOrcado) / valorOrcado) * 100 : 0;
                  
                  return (
                    <tr key={conta.id}>
                      <td className="border border-gray-200 p-2">
                        {conta.codigo} - {conta.nome}
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        {editingCell === `${conta.id}-${mes}-orcado` ? (
                          <OrcamentoCellEditor
                            value={tempValues[`${conta.id}-${mes}-orcado`] || 0}
                            onChange={(value) => onTempValueChange(`${conta.id}-${mes}-orcado`, value)}
                            onSave={() => onSaveValue(conta.id, mes, 'orcado')}
                            onCancel={onCancelEdit}
                            isLoading={isUpdating}
                          />
                        ) : (
                          <span
                            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${podeEditar ? '' : 'cursor-not-allowed'}`}
                            onClick={() => podeEditar && onCellEdit(conta.id, mes, 'orcado')}
                          >
                            {formatCurrency(valorOrcado)}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        {editingCell === `${conta.id}-${mes}-realizado` ? (
                          <OrcamentoCellEditor
                            value={tempValues[`${conta.id}-${mes}-realizado`] || 0}
                            onChange={(value) => onTempValueChange(`${conta.id}-${mes}-realizado`, value)}
                            onSave={() => onSaveValue(conta.id, mes, 'realizado')}
                            onCancel={onCancelEdit}
                            isLoading={isUpdating}
                          />
                        ) : (
                          <span
                            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${podeEditar ? '' : 'cursor-not-allowed'}`}
                            onClick={() => podeEditar && onCellEdit(conta.id, mes, 'realizado')}
                          >
                            {formatCurrency(valorRealizado)}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        <span className={`font-medium ${
                          variacao > 5 ? 'text-green-600' : 
                          variacao < -5 ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {variacao.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
