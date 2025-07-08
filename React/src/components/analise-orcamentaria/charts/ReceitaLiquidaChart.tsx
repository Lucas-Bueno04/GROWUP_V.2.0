import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from "lucide-react";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';

interface ReceitaLiquidaChartProps {
  data: BudgetAnalysisData;
}

export function ReceitaLiquidaChart({ data }: ReceitaLiquidaChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const receitaLiquidaChartData = (data.dadosMensais || []).map(item => ({
    mes: item.mesNome.substring(0, 3),
    receitaLiquidaOrcada: item.receitaLiquidaOrcada,
    receitaLiquidaRealizada: item.receitaLiquidaRealizada,
    variancia: item.receitaLiquidaRealizada - item.receitaLiquidaOrcada
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Líquida - Orçado vs Realizado</CardTitle>
      </CardHeader>
      <CardContent>
        {receitaLiquidaChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={receitaLiquidaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="receitaLiquidaOrcada" fill="#3b82f6" name="Receita Líquida Orçada" />
              <Bar dataKey="receitaLiquidaRealizada" fill="#10b981" name="Receita Líquida Realizada" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado disponível para o período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
