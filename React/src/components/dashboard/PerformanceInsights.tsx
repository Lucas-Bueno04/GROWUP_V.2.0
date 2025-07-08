
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";

interface MetricasFinanceiras {
  receitaLiquida: number;
  lucroLiquido: number;
  margemLiquida: number;
  ebitda: number;
  margemEbitda: number;
  custosOperacionais: number;
  despesasOperacionais: number;
  resultadoFinanceiro: number;
}

interface PerformanceInsightsProps {
  orcado: MetricasFinanceiras;
  realizado: MetricasFinanceiras;
  variacao: MetricasFinanceiras;
}

interface Insight {
  tipo: 'positivo' | 'negativo' | 'neutro' | 'atencao';
  titulo: string;
  descricao: string;
  valor?: string;
  recomendacao?: string;
}

export function PerformanceInsights({ orcado, realizado, variacao }: PerformanceInsightsProps) {
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

  const gerarInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Análise da Receita
    if (variacao.receitaLiquida > 10) {
      insights.push({
        tipo: 'positivo',
        titulo: 'Receita Acima do Esperado',
        descricao: `A receita líquida está ${formatarPercentual(variacao.receitaLiquida)} acima do orçado`,
        valor: formatarMoeda(realizado.receitaLiquida),
        recomendacao: 'Mantenha as estratégias de vendas atuais e considere expandir.'
      });
    } else if (variacao.receitaLiquida < -10) {
      insights.push({
        tipo: 'negativo',
        titulo: 'Receita Abaixo do Orçado',
        descricao: `A receita está ${formatarPercentual(Math.abs(variacao.receitaLiquida))} abaixo do esperado`,
        valor: formatarMoeda(realizado.receitaLiquida),
        recomendacao: 'Revise estratégias de vendas e marketing para recuperar o ritmo.'
      });
    }

    // Análise da Margem
    if (realizado.margemLiquida > 15) {
      insights.push({
        tipo: 'positivo',
        titulo: 'Margem Líquida Saudável',
        descricao: `Margem líquida de ${formatarPercentual(realizado.margemLiquida)} indica boa rentabilidade`,
        recomendacao: 'Excelente controle de custos. Continue monitorando.'
      });
    } else if (realizado.margemLiquida < 5) {
      insights.push({
        tipo: 'atencao',
        titulo: 'Margem Líquida Baixa',
        descricao: `Margem de apenas ${formatarPercentual(realizado.margemLiquida)} requer atenção`,
        recomendacao: 'Analise possibilidades de redução de custos e otimização de preços.'
      });
    }

    // Análise de Custos
    if (variacao.custosOperacionais > 15) {
      insights.push({
        tipo: 'negativo',
        titulo: 'Custos Acima do Planejado',
        descricao: `Custos operacionais ${formatarPercentual(variacao.custosOperacionais)} acima do orçado`,
        valor: formatarMoeda(realizado.custosOperacionais),
        recomendacao: 'Revise fornecedores e processos para controlar custos.'
      });
    }

    // Análise do EBITDA
    if (variacao.ebitda > 0) {
      insights.push({
        tipo: 'positivo',
        titulo: 'EBITDA Positivo',
        descricao: `EBITDA de ${formatarMoeda(realizado.ebitda)} demonstra boa capacidade operacional`,
        recomendacao: 'Boa geração de caixa operacional. Considere investimentos.'
      });
    }

    // Análise do Resultado Financeiro
    if (realizado.resultadoFinanceiro < -1000) {
      insights.push({
        tipo: 'atencao',
        titulo: 'Resultado Financeiro Negativo',
        descricao: `Despesas financeiras de ${formatarMoeda(Math.abs(realizado.resultadoFinanceiro))} impactam o resultado`,
        recomendacao: 'Revise estrutura de capital e custos financeiros.'
      });
    }

    // Se não há insights específicos, adicionar um neutro
    if (insights.length === 0) {
      insights.push({
        tipo: 'neutro',
        titulo: 'Performance Estável',
        descricao: 'Os indicadores estão dentro do esperado, sem grandes variações',
        recomendacao: 'Continue monitorando e mantenha o foco na consistência.'
      });
    }

    return insights.slice(0, 4); // Limitar a 4 insights
  };

  const insights = gerarInsights();

  const obterIcone = (tipo: string) => {
    switch (tipo) {
      case 'positivo': return CheckCircle;
      case 'negativo': return AlertTriangle;
      case 'atencao': return TrendingDown;
      default: return Info;
    }
  };

  const obterCor = (tipo: string) => {
    switch (tipo) {
      case 'positivo': return 'text-green-600 bg-green-50 border-green-200';
      case 'negativo': return 'text-red-600 bg-red-50 border-red-200';
      case 'atencao': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const obterBadge = (tipo: string) => {
    switch (tipo) {
      case 'positivo': return { label: 'Positivo', variant: 'default' as const };
      case 'negativo': return { label: 'Atenção', variant: 'destructive' as const };
      case 'atencao': return { label: 'Cuidado', variant: 'secondary' as const };
      default: return { label: 'Neutro', variant: 'outline' as const };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Insights de Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise automática dos seus indicadores financeiros
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icone = obterIcone(insight.tipo);
            const badge = obterBadge(insight.tipo);
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${obterCor(insight.tipo)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icone className="h-4 w-4" />
                    <h4 className="font-medium text-sm">{insight.titulo}</h4>
                  </div>
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.label}
                  </Badge>
                </div>
                
                <p className="text-sm mb-2">{insight.descricao}</p>
                
                {insight.valor && (
                  <p className="font-semibold text-sm mb-2">{insight.valor}</p>
                )}
                
                {insight.recomendacao && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-xs opacity-90">
                      <strong>Recomendação:</strong> {insight.recomendacao}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
