
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface FinancialMetric {
  title: string;
  value: number;
  budgeted: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isPercentage?: boolean;
}

interface FinancialMetricsGridProps {
  receitaLiquidaRealizada: number;
  receitaLiquidaOrcada: number;
  custosOperacionaisRealizado: number;
  custosOperacionaisOrcado: number;
  ebitdaRealizado: number;
  ebitdaOrcado: number;
  netMargin: number;
  budgetedNetMargin: number;
}

export function FinancialMetricsGrid({
  receitaLiquidaRealizada,
  receitaLiquidaOrcada,
  custosOperacionaisRealizado,
  custosOperacionaisOrcado,
  ebitdaRealizado,
  ebitdaOrcado,
  netMargin,
  budgetedNetMargin
}: FinancialMetricsGridProps) {
  const formatCurrency = (value: number | undefined | null) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(safeValue);
  };

  const formatPercentage = (value: number | undefined | null) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return `${safeValue.toFixed(1)}%`;
  };

  const mainMetrics: FinancialMetric[] = [
    {
      title: "Receita Líquida",
      value: receitaLiquidaRealizada,
      budgeted: receitaLiquidaOrcada,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Lucro Líquido",
      value: receitaLiquidaRealizada - custosOperacionaisRealizado,
      budgeted: receitaLiquidaOrcada - custosOperacionaisOrcado,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "EBITDA",
      value: ebitdaRealizado,
      budgeted: ebitdaOrcado,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Margem Líquida",
      value: netMargin,
      budgeted: budgetedNetMargin,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mainMetrics.map((metric, index) => {
        const variance = metric.budgeted > 0 
          ? ((metric.value - metric.budgeted) / metric.budgeted) * 100 
          : 0;
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">
                    {metric.isPercentage 
                      ? formatPercentage(metric.value)
                      : formatCurrency(metric.value)
                    }
                  </p>
                  <div className="flex items-center mt-1">
                    {variance > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : variance < 0 ? (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    ) : null}
                    <span className={`text-xs ${
                      variance > 0 ? 'text-green-600' : 
                      variance < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {variance > 0 ? '+' : ''}{formatPercentage(variance)} vs orçado
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
