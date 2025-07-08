
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { useTrendChartData } from './hooks/useTrendChartData';
import { TrendChartSelectors } from './components/TrendChartSelectors';
import { TrendChartDisplay } from './components/TrendChartDisplay';
import { TrendChartEmptyState } from './components/TrendChartEmptyState';

interface TrendChartProps {
  data: BudgetAnalysisData;
}

export function TrendChart({ data }: TrendChartProps) {
  const {
    selectedGroup1,
    selectedGroup2,
    setSelectedGroup1,
    setSelectedGroup2,
    availableOptions,
    trendChartData,
    getLineColor,
    getLineLabel
  } = useTrendChartData(data);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  if (availableOptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Temporal - Comparação de Grupos</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChartEmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evolução Temporal - Comparação de Grupos</CardTitle>
          <TrendChartSelectors
            selectedGroup1={selectedGroup1}
            selectedGroup2={selectedGroup2}
            onGroup1Change={setSelectedGroup1}
            onGroup2Change={setSelectedGroup2}
            availableOptions={availableOptions}
          />
        </div>
      </CardHeader>
      <CardContent>
        <TrendChartDisplay
          chartData={trendChartData}
          getLineColor={getLineColor}
          getLineLabel={getLineLabel}
          selectedGroup1={selectedGroup1}
          selectedGroup2={selectedGroup2}
          formatCurrency={formatCurrency}
        />
      </CardContent>
    </Card>
  );
}
