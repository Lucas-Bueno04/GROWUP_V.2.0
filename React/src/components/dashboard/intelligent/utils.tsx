
import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getInsightIcon = (tipo: string) => {
  switch (tipo) {
    case 'oportunidade':
      return <Lightbulb className="h-4 w-4" />;
    case 'alerta':
      return <AlertTriangle className="h-4 w-4" />;
    case 'tendencia':
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

export const getInsightColor = (tipo: string) => {
  switch (tipo) {
    case 'oportunidade':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'alerta':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    case 'tendencia':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  }
};

export const getPrioridadeBadge = (prioridade: string | number) => {
  const prioridadeStr = String(prioridade).toLowerCase();
  if (prioridadeStr === 'alta' || prioridadeStr === '1') return <Badge variant="destructive">Alta</Badge>;
  if (prioridadeStr === 'media' || prioridadeStr === '2') return <Badge variant="default">Média</Badge>;
  return <Badge variant="secondary">Baixa</Badge>;
};
