
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Target, Receipt, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { getVarianceInterpretation } from './utils/varianceUtils';

interface ExecutiveSummaryCardsProps {
  data: BudgetAnalysisData;
  isLoading?: boolean;
  isCumulative?: boolean;
  selectedMonth?: number;
}

export function ExecutiveSummaryCards({ data, isLoading, isCumulative, selectedMonth }: ExecutiveSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Usar dados cumulativos se disponíveis e solicitados
  const receitaOrcada = isCumulative && data.receitaLiquidaOrcadaCumulativa !== undefined 
    ? data.receitaLiquidaOrcadaCumulativa 
    : data.receitaLiquidaOrcada;
    
  const receitaRealizada = isCumulative && data.receitaLiquidaRealizadaCumulativa !== undefined 
    ? data.receitaLiquidaRealizadaCumulativa 
    : data.receitaLiquidaRealizada;
    
  const ebitdaOrcado = isCumulative && data.ebitdaOrcadoCumulativo !== undefined 
    ? data.ebitdaOrcadoCumulativo 
    : data.ebitdaOrcado;
    
  const ebitdaRealizado = isCumulative && data.ebitdaRealizadoCumulativo !== undefined 
    ? data.ebitdaRealizadoCumulativo 
    : data.ebitdaRealizado;

  const varianciaPercentual = isCumulative && data.varianciaPercentualCumulativa !== undefined 
    ? data.varianciaPercentualCumulativa 
    : data.varianciaPercentual;

  const status = isCumulative && data.statusCumulativo !== undefined 
    ? data.statusCumulativo 
    : data.status;

  const receitaVariancia = receitaRealizada - receitaOrcada;
  
  // Use the correct variance interpretation for revenue (positive sign)
  const { status: receitaStatus } = getVarianceInterpretation(
    receitaVariancia, 
    receitaOrcada, 
    '+'
  );

  // Calculate EBITDA variance correctly
  const ebitdaVariancia = ebitdaRealizado - ebitdaOrcado;
  const ebitdaVarianciaPercentual = ebitdaOrcado > 0 ? (ebitdaVariancia / ebitdaOrcado)  * 100 : 0;
  const { status: ebitdaStatus } = getVarianceInterpretation(
    ebitdaVariancia,
    ebitdaOrcado,
    '+'
  );

  const periodLabel = isCumulative && selectedMonth 
    ? `até ${getMonthName(selectedMonth)}` 
    : '';

  return (
    <div className="space-y-4">
      {/* Indicador do período quando cumulativo */}
      {isCumulative && selectedMonth && (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-sm">
            📊 Análise Cumulativa até {getMonthName(selectedMonth)}
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Líquida Orçada {periodLabel}
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(receitaOrcada)}</h3>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Líquida Realizada {periodLabel}
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(receitaRealizada)}</h3>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Variação Receita Líquida {periodLabel}
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(receitaVariancia)}</h3>
                <p className={`text-sm ${
                  receitaStatus === 'positive' ? 'text-green-600' : 
                  receitaStatus === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatPercentage(varianciaPercentual)}
                </p>
              </div>
              {receitaStatus === 'positive' ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : receitaStatus === 'negative' ? (
                <TrendingDown className="h-8 w-8 text-red-600" />
              ) : (
                <BarChart3 className="h-8 w-8 text-gray-600" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  EBITDA Realizado {periodLabel}
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(ebitdaRealizado)}</h3>
                <p className="text-sm text-muted-foreground">
                  Orçado: {formatCurrency(ebitdaOrcado)}
                </p>
                <p className={`text-xs ${
                  ebitdaStatus === 'positive' ? 'text-green-600' : 
                  ebitdaStatus === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatPercentage(ebitdaVarianciaPercentual)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
