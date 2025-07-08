
import React from 'react';
import { AnaliseOrcamentariaEmpresaHeader } from '@/components/analise-orcamentaria/AnaliseOrcamentariaEmpresaHeader';
import { ExecutiveSummaryCards } from '@/components/analise-orcamentaria/ExecutiveSummaryCards';
import { BudgetComparisonCharts } from '@/components/analise-orcamentaria/BudgetComparisonCharts';
import { HierarchicalAnalysisTable } from '@/components/analise-orcamentaria/HierarchicalAnalysisTable';
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria/types';

interface AnaliseOrcamentariaContentProps {
  selectedEmpresa: string;
  selectedYear: number;
  selectedMonth?: number;
  analysisData: BudgetAnalysisData;
}

export function AnaliseOrcamentariaContent({
  selectedEmpresa,
  selectedYear,
  selectedMonth,
  analysisData
}: AnaliseOrcamentariaContentProps) {
  // Determinar se está usando dados cumulativos
  const isCumulative = selectedMonth !== undefined;
  const hasCumulativeData = analysisData?.receitaLiquidaOrcadaCumulativa !== undefined;

  return (
    <>
      <AnaliseOrcamentariaEmpresaHeader
        empresaId={selectedEmpresa}
        selectedYear={selectedYear}
      />
      
      <ExecutiveSummaryCards 
        data={analysisData} 
        isCumulative={isCumulative && hasCumulativeData}
        selectedMonth={selectedMonth}
      />
      
      <BudgetComparisonCharts data={analysisData} />
      
      <HierarchicalAnalysisTable data={analysisData} />
    </>
  );
}
