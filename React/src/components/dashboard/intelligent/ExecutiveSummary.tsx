
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, AlertCircle } from "lucide-react";

interface ExecutiveSummaryProps {
  resumoExecutivo: string;
  scorePerformance: number;
}

export function ExecutiveSummary({ resumoExecutivo, scorePerformance }: ExecutiveSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 7) return <TrendingUp className="h-5 w-5" />;
    if (score >= 5) return <Target className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 7) return 'Excelente';
    if (score >= 5) return 'Satisfatório';
    return 'Precisa Atenção';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Resumo Executivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg border flex items-center gap-2 ${getScoreColor(scorePerformance)}`}>
            {getScoreIcon(scorePerformance)}
            <div>
              <div className="font-semibold text-lg">
                {scorePerformance.toFixed(1)}/10
              </div>
              <div className="text-xs">
                {getScoreLabel(scorePerformance)}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">
              Score de Performance Geral
            </Badge>
            <p className="text-sm text-muted-foreground">
              Baseado na análise dos indicadores financeiros e operacionais da empresa
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Análise Inteligente</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {resumoExecutivo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
