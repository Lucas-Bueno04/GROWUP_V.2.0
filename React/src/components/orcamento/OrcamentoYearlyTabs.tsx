
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrcamentoYearlyGrid } from './OrcamentoYearlyGrid';
import { OrcamentoComparisonGrid } from './OrcamentoComparisonGrid';
import type { OrcamentoEmpresa, OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoYearlyTabsProps {
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

export function OrcamentoYearlyTabs({
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
}: OrcamentoYearlyTabsProps) {
  return (
    <Tabs defaultValue="orcado" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
        <TabsTrigger 
          value="orcado" 
          className="data-[state=active]:bg-blue-700 data-[state=active]:text-blue-100 text-gray-400"
        >
          Orçado
        </TabsTrigger>
        <TabsTrigger 
          value="realizado" 
          className="data-[state=active]:bg-green-700 data-[state=active]:text-green-100 text-gray-400"
        >
          Realizado
        </TabsTrigger>
        <TabsTrigger 
          value="comparativo" 
          className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100 text-gray-400"
        >
          Comparativo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orcado" className="mt-6">
        <OrcamentoYearlyGrid
          grupos={grupos}
          contas={contas}
          valores={valores}
          orcamentoEmpresaId={orcamento.id}
          ano={orcamento.ano}
          tipo="orcado"
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
      </TabsContent>

      <TabsContent value="realizado" className="mt-6">
        <OrcamentoYearlyGrid
          grupos={grupos}
          contas={contas}
          valores={valores}
          orcamentoEmpresaId={orcamento.id}
          ano={orcamento.ano}
          tipo="realizado"
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
      </TabsContent>

      <TabsContent value="comparativo" className="mt-6">
        <OrcamentoComparisonGrid
          grupos={grupos}
          contas={contas}
          valores={valores}
          ano={orcamento.ano}
        />
      </TabsContent>
    </Tabs>
  );
}
