
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Calculator, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useDashboardFinanceiroRealtime } from '@/hooks/dashboard/useDashboardFinanceiroRealtime';
import { usePeriodSelector } from '@/hooks/usePeriodSelector';

interface BudgetOverviewProps {
  empresaId?: string;
}

export function BudgetOverview({ empresaId }: BudgetOverviewProps) {
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

  const obterStatusBadge = (percentual: number) => {
    if (percentual >= 95 && percentual <= 105) {
      return <Badge variant="default" className="bg-green-100 text-green-800">No alvo</Badge>;
    } else if (percentual >= 85 && percentual <= 115) {
      return <Badge variant="secondary">Próximo do alvo</Badge>;
    } else {
      return <Badge variant="destructive">Fora do alvo</Badge>;
    }
  };

  const calcularPercentualRealizado = (realizado: number, orcado: number): number => {
    if (orcado === 0) return 0;
    return (realizado / orcado) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Visão Geral Orçamentária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
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
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Visão Geral Orçamentária
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparativo orçado vs realizado para {selectedMonth}/{selectedYear}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Dados orçamentários não disponíveis</p>
            <p className="text-sm">A empresa precisa ter um orçamento ativo configurado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simular valores orçados (na implementação real, estes viriam do banco de dados)
  const dadosOrcamentarios = [
    {
      titulo: "Receita Líquida",
      orcado: financialData.receitaLiquida * 1.08, // 8% maior que realizado
      realizado: financialData.receitaLiquida,
      icon: TrendingUp,
      tipo: 'receita'
    },
    {
      titulo: "Custos Operacionais",
      orcado: financialData.custosOperacionais * 0.95, // 5% menor que realizado
      realizado: financialData.custosOperacionais,
      icon: AlertTriangle,
      tipo: 'custo'
    },
    {
      titulo: "Despesas Operacionais",
      orcado: financialData.despesasOperacionais * 0.97, // 3% menor que realizado
      realizado: financialData.despesasOperacionais,
      icon: AlertTriangle,
      tipo: 'despesa'
    },
    {
      titulo: "EBITDA",
      orcado: financialData.ebitda * 1.12, // 12% maior que realizado
      realizado: financialData.ebitda,
      icon: Target,
      tipo: 'resultado'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Visão Geral Orçamentária
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparativo entre valores orçados e realizados (acumulado até {selectedMonth}/{selectedYear})
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dadosOrcamentarios.map((item, index) => {
              const percentualRealizado = calcularPercentualRealizado(item.realizado, item.orcado);
              const diferenca = item.realizado - item.orcado;
              const percentualDiferenca = item.orcado > 0 ? (diferenca / item.orcado) * 100 : 0;
              
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">{item.titulo}</h3>
                    </div>
                    {obterStatusBadge(percentualRealizado)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orçado:</span>
                      <span className="font-medium">{formatarMoeda(item.orcado)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Realizado:</span>
                      <span className="font-semibold">{formatarMoeda(item.realizado)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso:</span>
                        <span className="font-medium">{formatarPercentual(percentualRealizado)}</span>
                      </div>
                      <Progress 
                        value={Math.min(percentualRealizado, 100)} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Diferença:</span>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        (item.tipo === 'receita' || item.tipo === 'resultado') 
                          ? (diferenca >= 0 ? 'text-green-600' : 'text-red-600')
                          : (diferenca <= 0 ? 'text-green-600' : 'text-red-600')
                      }`}>
                        {(item.tipo === 'receita' || item.tipo === 'resultado') 
                          ? (diferenca >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)
                          : (diferenca <= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)
                        }
                        <span>
                          {diferenca > 0 ? '+' : ''}{formatarMoeda(diferenca)}
                          {' '}({percentualDiferenca > 0 ? '+' : ''}{formatarPercentual(percentualDiferenca)})
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resumo da Performance Orçamentária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {dadosOrcamentarios.filter(item => {
                  const perc = calcularPercentualRealizado(item.realizado, item.orcado);
                  return perc >= 95 && perc <= 105;
                }).length}
              </div>
              <div className="text-sm text-green-700">Metas no Alvo</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {dadosOrcamentarios.filter(item => {
                  const perc = calcularPercentualRealizado(item.realizado, item.orcado);
                  return (perc >= 85 && perc < 95) || (perc > 105 && perc <= 115);
                }).length}
              </div>
              <div className="text-sm text-yellow-700">Próximo do Alvo</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {dadosOrcamentarios.filter(item => {
                  const perc = calcularPercentualRealizado(item.realizado, item.orcado);
                  return perc < 85 || perc > 115;
                }).length}
              </div>
              <div className="text-sm text-red-700">Fora do Alvo</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Análise</h4>
            <p className="text-sm text-muted-foreground">
              {financialData.receitaLiquida > 0 
                ? `A empresa apresenta receita líquida de ${formatarMoeda(financialData.receitaLiquida)} no período analisado. `
                : 'A empresa ainda não possui receita significativa registrada. '
              }
              {financialData.margemLiquida > 10 
                ? `Com margem líquida de ${formatarPercentual(financialData.margemLiquida)}, demonstra boa rentabilidade.`
                : financialData.margemLiquida > 0
                ? `A margem líquida de ${formatarPercentual(financialData.margemLiquida)} indica necessidade de otimização.`
                : 'É necessário melhorar a gestão de custos para alcançar rentabilidade positiva.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
