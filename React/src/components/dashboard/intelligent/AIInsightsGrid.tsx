
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Target, Lightbulb, RefreshCw } from "lucide-react";
import { AIInsight } from '@/hooks/dashboard/useAIInsights';

interface AIInsightsGridProps {
  insights: AIInsight[];
  onRefresh?: () => void;
}

export function AIInsightsGrid({ insights, onRefresh }: AIInsightsGridProps) {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'oportunidade':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'tendencia':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'recomendacao':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'default';
      case 'baixa':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Insights da IA
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum insight disponível no momento.</p>
            <p className="text-sm mt-2">A IA está analisando os dados para gerar recomendações.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Insights da IA ({insights.length})</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(insight.tipo)}
                  <CardTitle className="text-base">{insight.titulo}</CardTitle>
                </div>
                <Badge variant={getPriorityColor(insight.prioridade)} className="text-xs">
                  {insight.prioridade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {insight.descricao}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {insight.categoria}
                </Badge>
                
                {insight.valor && (
                  <span className="text-sm font-medium">
                    {insight.indicador ? `${insight.valor.toFixed(2)}` : 
                     insight.valor > 1000 ? `R$ ${insight.valor.toLocaleString('pt-BR')}` :
                     `${insight.valor.toFixed(1)}%`}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
