
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calculator, Target, TrendingDown } from "lucide-react";
import { useDashboardFinanceiroRealtime } from '@/hooks/dashboard/useDashboardFinanceiroRealtime';
import { usePeriodSelector } from '@/hooks/usePeriodSelector';

interface MetricsOverviewProps {
  empresaId?: string;
}

export function MetricsOverview({ empresaId }: MetricsOverviewProps) {
  const { selectedYear, selectedMonth } = usePeriodSelector();
  const { data: financialData, isLoading } = useDashboardFinanceiroRealtime(empresaId, selectedYear, selectedMonth);

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatarPercentual = (valor: number): string => {
    return `${valor.toFixed(1)}%`;
  };

  const obterCorVariacao = (valor: number): string => {
    if (valor > 5) return 'text-green-600';
    if (valor < -5) return 'text-red-600';
    return 'text-gray-600';
  };

  const obterIconeVariacao = (valor: number) => {
    if (valor > 2) return <TrendingUp className="h-3 w-3" />;
    if (valor < -2) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!financialData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas Financeiras</CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise financeira para {selectedMonth}/{selectedYear}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Dados financeiros não disponíveis</p>
            <p className="text-sm">A empresa precisa ter um orçamento ativo com dados registrados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cards = [
    {
      title: "Receita Líquida",
      value: formatarMoeda(financialData.receitaLiquida),
      variacao: financialData.variacaoReceitaLiquida,
      icon: DollarSign,
      description: `Acumulado até ${selectedMonth}/${selectedYear}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Lucro Líquido",
      value: formatarMoeda(financialData.lucroLiquido),
      variacao: financialData.variacaoLucroLiquido,
      icon: financialData.lucroLiquido >= 0 ? TrendingUp : TrendingDown,
      description: `Margem de ${formatarPercentual(financialData.margemLiquida)}`,
      color: financialData.lucroLiquido >= 0 ? "text-green-600" : "text-red-600",
      bgColor: financialData.lucroLiquido >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "EBITDA",
      value: formatarMoeda(financialData.ebitda),
      variacao: financialData.variacaoEbitda,
      icon: Calculator,
      description: `Margem de ${formatarPercentual(financialData.margemEbitda)}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Margem Líquida",
      value: formatarPercentual(financialData.margemLiquida),
      variacao: financialData.variacaoMargemLiquida,
      icon: Target,
      description: "Eficiência operacional",
      color: financialData.margemLiquida >= 0 ? "text-emerald-600" : "text-red-600",
      bgColor: financialData.margemLiquida >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Métricas Financeiras</CardTitle>
          <p className="text-sm text-muted-foreground">
            Indicadores financeiros acumulados até {selectedMonth}/{selectedYear}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{card.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex-1">
                      {card.description}
                    </p>
                    {Math.abs(card.variacao) > 0.1 && (
                      <div className={`text-xs font-medium flex items-center gap-1 ${obterCorVariacao(card.variacao)}`}>
                        {obterIconeVariacao(card.variacao)}
                        {card.variacao > 0 ? '+' : ''}{formatarPercentual(card.variacao)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Financial Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custos Operacionais:</span>
                <span className="font-medium">{formatarMoeda(financialData.custosOperacionais)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Despesas Operacionais:</span>
                <span className="font-medium">{formatarMoeda(financialData.despesasOperacionais)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total de Custos:</span>
                  <span className="font-bold">{formatarMoeda(financialData.custosOperacionais + financialData.despesasOperacionais)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance vs Período Anterior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Receita:</span>
                <div className={`flex items-center gap-1 ${obterCorVariacao(financialData.variacaoReceitaLiquida)}`}>
                  {obterIconeVariacao(financialData.variacaoReceitaLiquida)}
                  <span className="font-medium">
                    {financialData.variacaoReceitaLiquida > 0 ? '+' : ''}{formatarPercentual(financialData.variacaoReceitaLiquida)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lucro:</span>
                <div className={`flex items-center gap-1 ${obterCorVariacao(financialData.variacaoLucroLiquido)}`}>
                  {obterIconeVariacao(financialData.variacaoLucroLiquido)}
                  <span className="font-medium">
                    {financialData.variacaoLucroLiquido > 0 ? '+' : ''}{formatarPercentual(financialData.variacaoLucroLiquido)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">EBITDA:</span>
                <div className={`flex items-center gap-1 ${obterCorVariacao(financialData.variacaoEbitda)}`}>
                  {obterIconeVariacao(financialData.variacaoEbitda)}
                  <span className="font-medium">
                    {financialData.variacaoEbitda > 0 ? '+' : ''}{formatarPercentual(financialData.variacaoEbitda)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
