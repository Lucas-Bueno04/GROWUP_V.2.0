
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface DashboardStatusBarProps {
  isViewingAsMentor: boolean;
}

export function DashboardStatusBar({ isViewingAsMentor }: DashboardStatusBarProps) {
  if (isViewingAsMentor) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
        <p className="font-medium">Você está visualizando como Mentor.</p>
        <p className="mt-1">Todos os recursos administrativos estão disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800">
      <p className="font-medium flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Dashboard Inteligente com Benchmarking
      </p>
      <p className="mt-1">Compare seu desempenho com o mercado e identifique oportunidades.</p>
    </div>
  );
}
