// HierarchicalAnalysisTable.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from "axios";
import {GroupRow} from "./components/GroupRow";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

interface Account {
  id: number;
  cod: string;
  name: string;
  budgeted: number;
  carried: number;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  budgeted: number;
  carried: number;
  accounts: Account[];
}

interface HierarchicalProps {
  budgetId: number;
  months: string[];
}

export  function HierarchicalAnalysisTable({ budgetId, months }: HierarchicalProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getGroupSumByMonth(idBudget: number, months: string[], token: string): Promise<any[]> {
    const response = await axios.post(
      `${API_KEY}/analist/group-sum/months/${idBudget}`,
      months,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async function getAccountSumByMonth(idBudget: number, months: string[], token: string): Promise<any[]> {
    const response = await axios.post(
      `${API_KEY}/analist/account-sum/months/${idBudget}`,
      months,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = jwtService.getToken();

        // Buscar dados
        const [groupData, accountData] = await Promise.all([
          getGroupSumByMonth(budgetId, months, token),
          getAccountSumByMonth(budgetId, months, token),
        ]);

        // Mapear grupos
        const groupsMapped: Group[] = groupData.map(g => ({
          id: g.groupId,
          cod: g.groupCod.trim(),
          name: g.groupName.trim(),
          budgeted: g.budgeted,
          carried: g.carried,
          accounts: []
        }));

        // Mapear contas e associar ao grupo correspondente
        accountData.forEach(acc => {
          const group = groupsMapped.find(g => g.id === acc.groupId);
          if (group) {
            group.accounts.push({
              id: acc.accountId,
              cod: acc.accountCod.trim(),
              name: acc.accountName.trim(),
              budgeted: acc.budgeted,
              carried: acc.carried,
            });
          }
        });

        setGroups(groupsMapped);
      } catch (err) {
        setError("Erro ao buscar dados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [budgetId, months]);

  function toggleGroupExpanded(id: number) {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Calculator className="inline-block mr-2" /> Análise Hierárquica
        </CardTitle>
        <CardDescription>
          Visualize os grupos e contas com seus valores orçados e realizados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {groups.length === 0 && <div>Nenhum dado disponível.</div>}

        {groups.map(group => (
          <GroupRow
            key={group.id}
            grupo={group}
            isExpanded={expandedGroups.has(group.id)}
            onToggle={() => toggleGroupExpanded(group.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
