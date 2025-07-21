import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { GroupsVariationTooltip } from './GroupsVariationTooltip';
import axios from 'axios';
import { Group } from '@/components/interfaces/Group';
import { JwtService } from "@/components/auth/GetAuthParams";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getAllGroupsWithAccounts = async (token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_KEY}/group`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getGroupSumByMonth = async (budgetId: number, months: string[], token: string) => {
  const response = await axios.post(
    `${API_KEY}/analist/group-sum/months/${budgetId}`,
    months,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

interface GroupVariationData {
  groupId: number;
  groupName: string;
  codigo: string;
  variancia: number;
  absVariancia: number;
  color: string;
}

interface GroupsVariationPieChartProps {
  showPercentages: boolean;
  months: string[];
  budgetId: number;
}

const COLORS = [
  '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
  '#17a2b8', '#fd7e14', '#20c997', '#6610f2', '#e83e8c'
];

export function GroupsVariationPieChart({
  showPercentages,
  months,
  budgetId,
}: GroupsVariationPieChartProps) {
  const [data, setData] = useState<GroupVariationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = jwtService.getToken();

      try {
        const groupSums = await getGroupSumByMonth(budgetId, months, token);

        const enrichedData: GroupVariationData[] = groupSums.map((group: any, index: number) => {
          const variancia = group.carried - group.budgeted;
          const absVariancia = Math.abs(variancia);

          return {
            groupId: group.groupId,
            groupName: group.groupName,
            codigo: group.groupCod?.trim(), // trim para garantir consistência
            variancia,
            absVariancia,
            color: COLORS[index % COLORS.length],
          };
        });

        setData(enrichedData);
      } catch (error) {
        console.error('Erro ao buscar dados de variação dos grupos:', error);
      }
    };

    if (months.length > 0 && budgetId) {
      fetchData();
    }
  }, [months, budgetId]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          dataKey="absVariancia"
          nameKey="groupName"
          label={
            showPercentages
              ? ({ name, percent }: any) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
              : undefined
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value, entry: any) => (
            <span style={{ color: entry.payload.color }}>
              {entry.payload.codigo}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
