
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { useDetailedAnalysisTable } from './hooks/useDetailedAnalysisTable';
import { DetailedAnalysisTableControls } from './components/DetailedAnalysisTableControls';
import { DetailedAnalysisTableContent } from './components/DetailedAnalysisTableContent';
import { exportDetailedAnalysisToCSV } from './utils/csvExportUtils';

interface DetailedAnalysisTableProps {
  data: BudgetAnalysisData;
  isLoading?: boolean;
}

export function DetailedAnalysisTable({ data, isLoading }: DetailedAnalysisTableProps) {
  const {
    searchTerm,
    setSearchTerm,
    filteredAndSortedData,
    handleSort
  } = useDetailedAnalysisTable(data);

  const handleExport = () => {
    exportDetailedAnalysisToCSV(filteredAndSortedData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Análise Detalhada por Conta</CardTitle>
          <DetailedAnalysisTableControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DetailedAnalysisTableContent
          data={filteredAndSortedData}
          searchTerm={searchTerm}
          onSort={handleSort}
        />
      </CardContent>
    </Card>
  );
}
