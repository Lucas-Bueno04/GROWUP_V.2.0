
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardDebugCardProps {
  user: any;
  metrics: any;
  selectedYear: number;
  selectedMonth: number;
  isLoading: boolean;
  showDetailedAnalysis: boolean;
}

export function DashboardDebugCard({
  user,
  metrics,
  selectedYear,
  selectedMonth,
  isLoading,
  showDetailedAnalysis
}: DashboardDebugCardProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <Card className="border-dashed border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800 dark:text-orange-400">
          Debug de Autenticação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
          <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
          <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
          <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
          <div><strong>Nome:</strong> {user?.nome || 'N/A'}</div>
          <div><strong>Empresas:</strong> {metrics.totalEmpresas}</div>
          <div><strong>Período Selecionado:</strong> {selectedMonth}/{selectedYear}</div>
          <div><strong>Metas:</strong> {metrics.totalMetas}</div>
          <div><strong>Alertas:</strong> {metrics.alertasAtivos}</div>
          <div><strong>Loading:</strong> {isLoading ? 'Sim' : 'Não'}</div>
          <div><strong>Análise Detalhada:</strong> {showDetailedAnalysis ? 'Visível' : 'Oculta'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
