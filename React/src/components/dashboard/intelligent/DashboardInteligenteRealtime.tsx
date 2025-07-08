
import React from 'react';
import { useDashboardFinanceiroRealtime } from '@/hooks/dashboard/useDashboardFinanceiroRealtime';
import { useIndicadoresRealtimeEmpresa } from '@/hooks/dashboard/useIndicadoresRealtimeEmpresa';
import { useRecalcularMediasIndicadores } from '@/hooks/dashboard/useRecalcularMediasIndicadores';
import { usePeriodSelector } from '@/hooks/usePeriodSelector';
import { useAIInsights } from '@/hooks/dashboard/useAIInsights';
import { DashboardInteligenteProps, Indicador, ContextoEmpresa } from './types';
import { DashboardInteligenteHeader } from './DashboardInteligenteHeader';
import { DashboardInteligenteEmptyState } from './DashboardInteligenteEmptyState';
import { DashboardInteligenteLoadingState } from './DashboardInteligenteLoadingState';
import { DashboardInteligenteErrorState } from './DashboardInteligenteErrorState';
import { ExecutiveSummary } from './ExecutiveSummary';
import { AIInsightsGrid } from './AIInsightsGrid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardInteligenteRealtime({ empresaId }: DashboardInteligenteProps) {
  const { selectedYear, selectedMonth } = usePeriodSelector();
  
  // Hooks para dados financeiros e indicadores em tempo real
  const { 
    data: financialData, 
    isLoading: loadingFinancial, 
    error: financialError 
  } = useDashboardFinanceiroRealtime(empresaId, selectedYear, selectedMonth);

  const { 
    data: indicadoresCalculados, 
    isLoading: loadingIndicadores,
    error: indicadoresError 
  } = useIndicadoresRealtimeEmpresa(empresaId, selectedYear, selectedMonth);

  const recalcularMedias = useRecalcularMediasIndicadores();

  // Preparar contexto para IA baseado em dados reais
  const indicadores = React.useMemo((): Indicador[] => {
    if (!indicadoresCalculados || indicadoresCalculados.length === 0) {
      return [];
    }

    return indicadoresCalculados.map(ind => ({
      codigo: ind.codigo,
      nome: ind.nome,
      valor: ind.valor,
      unidade: ind.unidade
    }));
  }, [indicadoresCalculados]);

  const contextoEmpresa = React.useMemo((): ContextoEmpresa => ({
    empresaId: empresaId || '',
    ano: selectedYear,
    mes: selectedMonth,
    dataAnalise: new Date().toISOString()
  }), [empresaId, selectedYear, selectedMonth]);

  const { 
    data: aiInsights, 
    isLoading: loadingAI, 
    error: aiError,
    refetch: refetchInsights 
  } = useAIInsights(empresaId, indicadores, financialData, contextoEmpresa);

  // Gerenciar estados de loading
  const isLoading = loadingFinancial || loadingIndicadores;

  if (!empresaId) {
    return <DashboardInteligenteEmptyState />;
  }

  if (isLoading) {
    return (
      <DashboardInteligenteLoadingState 
        loadingFinancial={loadingFinancial}
        loadingAI={loadingAI}
      />
    );
  }

  if (financialError || indicadoresError) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Erro ao Carregar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500 opacity-50" />
            <p className="text-muted-foreground mb-4">
              {financialError ? 'Erro ao carregar dados financeiros' : 'Erro ao carregar indicadores'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => recalcularMedias.mutate(selectedYear)}
                disabled={recalcularMedias.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${recalcularMedias.isPending ? 'animate-spin' : ''}`} />
                Recalcular Médias
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!financialData || !indicadoresCalculados || indicadoresCalculados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Dashboard Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Dados Insuficientes</h3>
            <p className="text-sm max-w-md mx-auto mb-4">
              A empresa precisa ter um orçamento ativo com dados financeiros 
              registrados para gerar insights inteligentes.
            </p>
            <Button 
              variant="outline" 
              onClick={() => recalcularMedias.mutate(selectedYear)}
              disabled={recalcularMedias.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${recalcularMedias.isPending ? 'animate-spin' : ''}`} />
              Recalcular Médias
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardInteligenteHeader />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => recalcularMedias.mutate(selectedYear)}
          disabled={recalcularMedias.isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${recalcularMedias.isPending ? 'animate-spin' : ''}`} />
          Atualizar Médias
        </Button>
      </div>

      {/* Resumo dos Indicadores Calculados */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Calculados ({indicadoresCalculados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicadoresCalculados.slice(0, 6).map((indicador) => (
              <div key={indicador.codigo} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{indicador.nome}</h4>
                  <span className="text-xs text-muted-foreground">{indicador.codigo}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {indicador.valor.toFixed(2)}{indicador.unidade}
                  </div>
                  {indicador.mediaGeral && (
                    <div className="text-sm text-muted-foreground">
                      vs Média Geral: {indicador.mediaGeral.toFixed(2)}{indicador.unidade}
                      <span className={`ml-1 ${indicador.performanceVsGeral >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({indicador.performanceVsGeral > 0 ? '+' : ''}{indicador.performanceVsGeral.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {indicador.mediaGrupo && (
                    <div className="text-sm text-muted-foreground">
                      vs Grupo: {indicador.mediaGrupo.toFixed(2)}{indicador.unidade}
                      <span className={`ml-1 ${indicador.performanceVsGrupo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({indicador.performanceVsGrupo > 0 ? '+' : ''}{indicador.performanceVsGrupo.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {loadingAI && (
        <DashboardInteligenteLoadingState 
          loadingFinancial={false}
          loadingAI={true}
        />
      )}

      {aiError && (
        <DashboardInteligenteErrorState onRetry={() => refetchInsights()} />
      )}

      {aiInsights && !loadingAI && (
        <>
          {aiInsights.resumoExecutivo && (
            <ExecutiveSummary 
              resumoExecutivo={aiInsights.resumoExecutivo}
              scorePerformance={aiInsights.scorePerformance}
            />
          )}

          <AIInsightsGrid 
            insights={aiInsights.insights || []}
            onRefresh={() => refetchInsights()}
          />
        </>
      )}
    </div>
  );
}
