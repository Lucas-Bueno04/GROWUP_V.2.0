
import React, { useState } from 'react';
import { OrcamentoComparisonHeader } from './OrcamentoComparisonHeader';
import { OrcamentoComparisonTable } from './OrcamentoComparisonTable';
import { OrcamentoComparisonControls } from './OrcamentoComparisonControls';
import { useOrcamentoGruposValores } from '@/hooks/orcamento-grupos-valores';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoComparisonGridProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  ano: number;
}

export function OrcamentoComparisonGrid({
  grupos,
  contas,
  valores,
  ano
}: OrcamentoComparisonGridProps) {
  const [viewMode, setViewMode] = useState<'anual' | 'mensal'>('anual');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Buscar o ID do orçamento empresa
  const orcamentoEmpresaId = valores?.[0]?.orcamento_empresa_id;
  
  // Buscar valores dos grupos
  const { data: gruposValores } = useOrcamentoGruposValores(orcamentoEmpresaId);

  const getValorForConta = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  };

  const getValorForGrupo = (grupoId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = gruposValores?.find(v => v.grupo_id === grupoId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_calculado) : 0;
  };

  return (
    <div className="space-y-6">
      <OrcamentoComparisonHeader ano={ano} />
      
      <OrcamentoComparisonControls
        viewMode={viewMode}
        selectedMonth={selectedMonth}
        onViewModeChange={setViewMode}
        onMonthChange={setSelectedMonth}
      />

      <OrcamentoComparisonTable
        grupos={grupos}
        contas={contas}
        valores={valores}
        gruposValores={gruposValores || []}
        getValorForConta={getValorForConta}
        getValorForGrupo={getValorForGrupo}
        viewMode={viewMode}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
