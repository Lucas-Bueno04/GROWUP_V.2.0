
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import { IndicadorEstrategico } from '@/hooks/cards-estrategicos';
import { IndicatorResponse } from '../interfaces/IndicadorResponse';
import { ResultRequest } from '../interfaces/ResultRequest';
interface StrategicCardProps {
  indicadorEstrategico: IndicatorResponse;
  status:string, 
  tipo:string,
  result?:ResultRequest
}

export function StrategicCard({ indicadorEstrategico, status, tipo,result  }: StrategicCardProps) {

  const formatValue = (value: number) => {
    if (indicadorEstrategico.unity === '%') {
      return `${value.toFixed(1)}%`;
    } else if (indicadorEstrategico.unity === 'R$') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toFixed(2);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'acima':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'abaixo':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'acima':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'abaixo':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'acima':
        return 'Acima da Meta';
      case 'abaixo':
        return 'Abaixo da Meta';
      default:
        return 'Na Meta';
    }
  };

  return (
    <Card className="h-[380px] w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 space-y-2">
        <CardTitle className="text-sm line-clamp-2 flex items-start gap-2 min-h-[2.5rem]">
          {tipo === 'empresa' && (
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" title="Indicador Próprio"></div>
          )}
          {tipo === 'plano-contas' && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" title="Plano de Contas"></div>
          )}
          <span className="line-clamp-2">{indicadorEstrategico.name}</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            tipo === 'empresa' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {tipo === 'empresa' ? 'Próprio' : 'Plano de Contas'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4 h-[calc(100%-8rem)]">
        {/* Status Principal */}
        <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{getStatusText()}</span>
            {getStatusIcon()}
          </div>
          
          <div className="space-y-2">
            {result.carriedResult>0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Realizado:</span>
                <span className="font-bold text-base">
                  {formatValue(result?.carriedResult??0)}
                </span>
              </div>
            )}
            
            
            {result.budgetedResult > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Meta:</span>
                <span className="font-medium text-sm">
                  {formatValue(result?.budgetedResult??0)}
                </span>
              </div>
            )}
          </div>
        </div>

      
        {/* Informações do Indicador */}
        <div className="space-y-1 text-xs text-muted-foreground mt-auto">
          <div className="flex justify-between">
            <span>Código:</span>
            <span className="font-mono">{indicadorEstrategico.cod}</span>
          </div>
          {indicadorEstrategico.unity && (
            <div className="flex justify-between">
              <span>Unidade:</span>
              <span>{indicadorEstrategico.unity}</span>
            </div>
          )}
          {indicadorEstrategico.betterWhen && (
            <div className="flex justify-between">
              <span>Melhor quando:</span>
              <span className="capitalize">{indicadorEstrategico.betterWhen}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
