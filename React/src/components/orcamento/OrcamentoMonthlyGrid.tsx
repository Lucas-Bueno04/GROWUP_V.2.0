
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrcamentoBudgetTable } from './OrcamentoBudgetTable';
import type { OrcamentoEmpresa, OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoMonthlyGridProps {
  orcamento: OrcamentoEmpresa;
  valores: OrcamentoEmpresaValor[];
  grupos: any[];
  contas: any[];
  selectedMonth: number;
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onMonthChange: (month: number) => void;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onTempValueChange: (key: string, value: number) => void;
}

export function OrcamentoMonthlyGrid({
  orcamento,
  valores,
  grupos,
  contas,
  selectedMonth,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onMonthChange,
  onCellEdit,
  onSaveValue,
  onTempValueChange
}: OrcamentoMonthlyGridProps) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <Tabs value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
      <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full">
        {meses.map((mes, index) => (
          <TabsTrigger key={index + 1} value={(index + 1).toString()} className="text-xs">
            {mes.substring(0, 3)}
          </TabsTrigger>
        ))}
      </TabsList>

      {meses.map((_, mesIndex) => (
        <TabsContent key={mesIndex + 1} value={(mesIndex + 1).toString()}>
          <OrcamentoBudgetTable
            grupos={grupos}
            contas={contas}
            valores={valores}
            mes={mesIndex + 1}
            ano={orcamento.ano}
            podeEditar={podeEditar}
            editingCell={editingCell}
            tempValues={tempValues}
            isUpdating={isUpdating}
            onCellEdit={onCellEdit}
            onSaveValue={onSaveValue}
            onTempValueChange={onTempValueChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
