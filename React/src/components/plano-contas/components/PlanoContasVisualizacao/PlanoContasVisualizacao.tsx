
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { GrupoVisualizacao } from './GrupoVisualizacao';
import { LegendaEstruturaDRE } from './LegendaEstruturaDRE';

interface PlanoContasVisualizacaoProps {
  grupos: OrcamentoGrupo[];
  contas: OrcamentoConta[];
}

export function PlanoContasVisualizacao({ grupos, contas }: PlanoContasVisualizacaoProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (grupoId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(grupoId)) {
      newExpanded.delete(grupoId);
    } else {
      newExpanded.add(grupoId);
    }
    setExpandedGroups(newExpanded);
  };

  const getContasByGrupo = (grupoId: string) => {
    return contas.filter(conta => conta.grupo_id === grupoId);
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
          {grupos
            .sort((a, b) => a.ordem - b.ordem)
            .map((grupo) => {
              const grupoContas = getContasByGrupo(grupo.id);
              const isExpanded = expandedGroups.has(grupo.id);
              
              return (
                <GrupoVisualizacao
                  key={grupo.id}
                  grupo={grupo}
                  contas={grupoContas}
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
