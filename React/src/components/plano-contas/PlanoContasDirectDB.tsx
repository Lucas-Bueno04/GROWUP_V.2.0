
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, BarChart3 } from "lucide-react";
import { PlanoContasVisualizacao } from './components/PlanoContasVisualizacao';
import { PlanoContasIndicadores } from './PlanoContasIndicadores';
import { GruposContasUnificado } from './components/GruposContasUnificado';
import { useOrcamentoGrupos, useOrcamentoContas, useOrcamentoIndicadores } from '@/hooks/plano-contas';



export function PlanoContasDirectDB() {
  const { data: grupos = [], isLoading: loadingGrupos, refetch: refetchGrupos } = useOrcamentoGrupos();
  const { data: contas = [], isLoading: loadingContas, refetch: refetchContas } = useOrcamentoContas();
  const { data: indicadores = [], isLoading: loadingIndicadores, refetch: refetchIndicadores } = useOrcamentoIndicadores();

  const isLoading = loadingGrupos || loadingContas || loadingIndicadores;

  const handleDataChange = () => {
    console.log('[PLANO CONTAS DB] Dados alterados, recarregando...');
    refetchGrupos();
    refetchContas();
    refetchIndicadores();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Carregando estrutura DRE...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="visualizacao" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualizacao" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visualização DRE
          </TabsTrigger>
          <TabsTrigger value="gestao" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Gestão Grupos & Contas
          </TabsTrigger>
          <TabsTrigger value="indicadores" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicadores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualizacao" className="mt-6">
          <PlanoContasVisualizacao />
        </TabsContent>

        <TabsContent value="gestao" className="mt-6">
          <GruposContasUnificado 
          />
        </TabsContent>

        <TabsContent value="indicadores" className="mt-6">
          <PlanoContasIndicadores
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
