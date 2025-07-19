
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Target, Receipt, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { getVarianceInterpretation } from './utils/varianceUtils';

interface ExecutiveSummaryCardsProps {
  receitaOrcada:number,
  receitaRealizada:number, 
  ebitdaOrcado:number,
  ebidtaRealizado:number,
  mes:string
}

export function ExecutiveSummaryCards({ receitaRealizada, receitaOrcada, ebidtaRealizado, ebitdaOrcado, mes}: ExecutiveSummaryCardsProps) {
  
  const [varianciaReceita, setVarianciaReceita] = useState(0);
  const [varianciaEbidta, setVarianciaEbidta] = useState(0);
  
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

  const variancia = ((receitaRealizada-receitaOrcada)/receitaOrcada)*100

  useEffect(()=>{
    const varianciaReceita = ((receitaRealizada-receitaOrcada)/receitaOrcada)*100
    const varianciaEbidta = ((ebidtaRealizado-ebitdaOrcado)/ebitdaOrcado)*100
    setVarianciaReceita(varianciaReceita);
    setVarianciaEbidta(varianciaEbidta);
  },[mes,receitaOrcada, receitaRealizada, ebitdaOrcado, ebidtaRealizado])

  return (
    <div className="space-y-4">
        <div className="flex justify-center">
          <Badge variant="outline" className="text-sm">
            📊 Análise Cumulativa até {mes}
          </Badge>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Líquida Orçada 
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
                  Receita Líquida Realizada 
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
                  Variação Receita Líquida 
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(receitaRealizada-receitaOrcada)}</h3>
                <p className={`text-sm ${
                  receitaRealizada-receitaOrcada>0 ? 'text-green-600' : 
                  receitaRealizada-receitaOrcada<0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatPercentage(varianciaReceita)}
                </p>
              </div>
              {varianciaReceita>0?(
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : varianciaReceita<0 ? (
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
                  EBITDA Realizado 
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(ebidtaRealizado)}</h3>
                <p className="text-sm text-muted-foreground">
                  Orçado: {formatCurrency(ebitdaOrcado)}
                </p>
                <p className={`text-xs ${
                  ebidtaRealizado-ebitdaOrcado>0? 'text-green-600' : 
                  ebidtaRealizado-ebitdaOrcado<0? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatPercentage(varianciaEbidta)}
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
