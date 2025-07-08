
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { HierarchicalTableHeader } from './components/HierarchicalTableHeader';
import { GroupRow } from './components/GroupRow';
import { exportHierarchicalDataToCSV } from './utils/csvExport';

interface HierarchicalAnalysisTableProps {
  data: BudgetAnalysisData;
  isLoading?: boolean;
}

export function HierarchicalAnalysisTable({ data, isLoading }: HierarchicalAnalysisTableProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getMonthlyData = (conta: any, month: number) => {
    const monthData = conta.dadosMensais?.find((m: any) => m.mes === month);
    return monthData || { orcado: 0, realizado: 0 };
  };

  const getGroupMonthlyData = (grupo: any, month: number) => {
    const monthData = grupo.dadosMensais?.find((m: any) => m.mes === month);
    return monthData || { orcado: 0, realizado: 0 };
  };

  const getGroupDisplayValues = (grupo: any) => {
    if (selectedMonth === 'all') {
      return {
        orcado: grupo.orcado,
        realizado: grupo.realizado,
        variancia: grupo.variancia
      };
    } else {
      const monthData = getGroupMonthlyData(grupo, parseInt(selectedMonth));
      return {
        orcado: monthData.orcado,
        realizado: monthData.realizado,
        variancia: monthData.realizado - monthData.orcado
      };
    }
  };

  const handleExportCSV = () => {
    exportHierarchicalDataToCSV(data, selectedMonth, getGroupDisplayValues, getMonthlyData);
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
      <HierarchicalTableHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onExportCSV={handleExportCSV}
      />
      <CardContent>
        {data.dadosHierarquicos.grupos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.dadosHierarquicos.grupos.map((grupo) => {
              const isExpanded = expandedGroups.has(grupo.id);
              const groupValues = getGroupDisplayValues(grupo);
              
              return (
                <GroupRow
                  key={grupo.id}
                  grupo={grupo}
                  isExpanded={isExpanded}
                  onToggle={() => toggleGroup(grupo.id)}
                  groupValues={groupValues}
                  selectedMonth={selectedMonth}
                  getMonthlyData={getMonthlyData}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
