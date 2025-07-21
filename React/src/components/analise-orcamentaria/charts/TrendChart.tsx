import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChartSelector } from './components/TrendChartSelectors';
import { TrendChartDisplay } from './components/TrendChartDisplay';
import axios from 'axios';
import { Group } from '@/components/interfaces/Group';
import { JwtService } from "@/components/auth/GetAuthParams";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getAllGroupsWithAccounts = async(token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_KEY}/group`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getGroupSumByMonth = async (idBudget: number, month: string, token: string) => {
  const response = await axios.post(
    `${API_KEY}/analist/group-sum/months/${idBudget}`,
    [month], // array com 1 mês só
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  );
  return response.data;
};

const meses = [
  "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

const mesesLabel = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface TrendChartProps {
  id: number; // id do budget passado como prop
}

export function TrendChart({ id: idBudget }: TrendChartProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [options, setOptions] = useState<{ value: string; label: string; color: string }[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const token = jwtService.getToken();

  // Carregar grupos ao montar o componente
  useEffect(() => {
    if (!token) return;

    getAllGroupsWithAccounts(token)
      .then(groups => {
        const opts = groups.map((group, index) => ({
          value: group.name,
          label: group.name,
          color: index % 2 === 0 ? "#007bff" : "#28a745"
        }));

        setOptions(opts);
        if (opts.length > 0) setSelectedGroup(opts[0].value);
      })
      .catch(err => {
        console.error("Erro ao carregar grupos:", err);
      });
  }, [token]);

  // Buscar dados para o grupo selecionado e budget
  useEffect(() => {
    if (!selectedGroup || !token || !idBudget) return;

    // Função para buscar todos os meses em paralelo e montar os dados
    async function fetchData() {
      try {
        // Para cada mês, buscar dados do backend
        const promises = meses.map(mes => getGroupSumByMonth(idBudget, mes, token));
        const results = await Promise.all(promises); // results é array de arrays com dados para cada mês

        // Montar o chartData iterando pelos meses
        const data = mesesLabel.map((labelMes, index) => {
          // Para o mês atual, procurar no resultado o objeto do grupo selecionado
          // results[index] é um array dos grupos com budgeted e carried para aquele mês
          const monthData = results[index].find(
            (g: any) => g.groupName === selectedGroup
          );

          return {
            mes: labelMes,
            [`${selectedGroup} Orçado`]: monthData ? monthData.budgeted : 0,
            [`${selectedGroup} Realizado`]: monthData ? monthData.carried : 0,
          };
        });

        setChartData(data);

      } catch (error) {
        console.error("Erro ao buscar dados do grupo por mês:", error);
        setChartData([]); // limpar dados em caso de erro
      }
    }

    fetchData();

  }, [selectedGroup, token, idBudget]);

  const getLineColor = (type: "Orçado" | "Realizado") => (type === "Orçado" ? "#007bff" : "#28a745");
  const getLineLabel = (type: "Orçado" | "Realizado") => (type === "Orçado" ? "Orçado" : "Realizado");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evolução Temporal - Comparação de Grupos</CardTitle>
          <TrendChartSelector
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            availableOptions={options}
          />
        </div>
      </CardHeader>
      <CardContent>
        <TrendChartDisplay
          chartData={chartData}
          selectedGroup={selectedGroup}
          getLineColor={getLineColor}
          getLineLabel={getLineLabel}
          formatCurrency={formatCurrency}
        />
      </CardContent>
    </Card>
  );
}
