import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { GrupoVisualizacao } from './PlanoContasVisualizacao/GrupoVisualizacao';
import { LegendaEstruturaDRE } from './PlanoContasVisualizacao/LegendaEstruturaDRE';
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPRING_API;
const token = new JwtService().getToken();

interface Account {
  id: number;
  cod: string;
  name: string;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  accounts: Account[];
  // ordem?: number; // Descomente se estiver usando 'ordem' para ordenação
}

const getAllGroupsWithAccount = async (): Promise<Group[]> => {
  const response = await axios.get(`${API_KEY}/group`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
};

export function PlanoContasVisualizacao() {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const receivedGroups = await getAllGroupsWithAccount();
        setGroups(receivedGroups);
      } catch (error) {
        console.error("Erro ao buscar grupos: ", error);
      }
    };

    fetchData();
  }, []);

  const toggleGroup = (grupoId: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(grupoId)) {
      newExpanded.delete(grupoId);
    } else {
      newExpanded.add(grupoId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Visualização Hierárquica DRE
        </CardTitle>
        <CardDescription>
          Estrutura detalhada do Demonstrativo de Resultado para Escritórios Contábeis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {groups
            // .sort((a, b) => a.ordem - b.ordem) // Ative se 'ordem' existir
            .map((grupo) => {
              const isExpanded = expandedGroups.has(grupo.id);

              return (
                <GrupoVisualizacao
                  key={grupo.id}
                  grupo={grupo}
                  isExpanded={isExpanded}
                  onToggle={() => toggleGroup(grupo.id)}
                />
              );
            })}
        </div>

        <LegendaEstruturaDRE />
      </CardContent>
    </Card>
  );
}
