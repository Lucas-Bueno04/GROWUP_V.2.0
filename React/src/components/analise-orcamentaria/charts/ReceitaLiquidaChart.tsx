import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3 } from "lucide-react";
import { FormulaRequest } from '@/components/interfaces/FormulaRequest';
import { ResultRequest } from '@/components/interfaces/ResultRequest';
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getEvaluatedData = async (
  budgetId: number,
  token: string,
  data: FormulaRequest
): Promise<ResultRequest> => {
  const response = await axios.post(
    `${API_KEY}/analist/formula/evaluate/${budgetId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export function ReceitaLiquidaChart({ budgetId }) {

  console.log(budgetId)
  const [receitaLiquidaChartData, setReceitaLiquidaChartData] = useState([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getReceitaLiquida = async (month: string) => {
    const receitaFormula = "G_1-G_2";
    const token = await jwtService.getToken();
    const receitaRequest: FormulaRequest = {
      formula: receitaFormula,
      months: [month]
    };
    const receitaResponse = await getEvaluatedData(Number(budgetId), token, receitaRequest);
    console.log('Mês:', month, 'Resposta:', receitaResponse);
    return {
      month,
      orcado: receitaResponse.budgetedResult,
      realizado: receitaResponse.carriedResult
    };
  };

  const monthLabels = [
    "JANEIRO",
    "FEVEREIRO",
    "MARCO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const results = [];
      for (let i = 0; i < 12; i++) {
        try {
          const monthName = monthLabels[i];
          const data = await getReceitaLiquida(monthName);
          results.push({
            mes: monthName,
            receitaLiquidaOrcada: data.orcado,
            receitaLiquidaRealizada: data.realizado
          });
        } catch (error) {
          console.error(`Erro ao buscar dados do mês ${monthLabels[i]}:`, error);
        }
      }
      setReceitaLiquidaChartData(results);
    };

    fetchData();
  }, [budgetId]);

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
              <XAxis dataKey="mes" angle={-45} textAnchor='end' height={60} />
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
