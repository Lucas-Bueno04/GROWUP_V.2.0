
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, RefreshCw } from 'lucide-react';
import { useMediasComparativas } from '@/hooks/indicadores-medios';
import { useEmpresaGrupos } from '@/hooks/indicadores-medios';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { IndicadorSelector } from './IndicadorSelector';
import { useIndicadoresMedios } from '@/hooks/indicadores-medios';
import { OverviewTab, GruposTab, InsightsTab } from './medias-comparativas';
import type { MediasComparativasDetalhadasProps } from './medias-comparativas';

export function MediasComparativasDetalhadas({ empresaId }: MediasComparativasDetalhadasProps) {
  const { data: orcamentos } = useOrcamentoEmpresasPorUsuario();
  const currentYear = new Date().getFullYear();
  
  // Usar empresaId prop ou primeira empresa do usuário
  const targetEmpresaId = empresaId || orcamentos?.[0]?.empresa_id;
  
  const { data: empresaGrupos } = useEmpresaGrupos(targetEmpresaId);
  const { data: indicadoresMedios } = useIndicadoresMedios(currentYear);
  
  // Inicializar com o primeiro indicador disponível
  const [selectedIndicador, setSelectedIndicador] = useState(() => {
    return indicadoresMedios?.[0]?.indicador_codigo || 'ROI';
  });

  // Atualizar selectedIndicador quando indicadoresMedios carregar
  React.useEffect(() => {
    if (indicadoresMedios && indicadoresMedios.length > 0 && !indicadoresMedios.find(ind => ind.indicador_codigo === selectedIndicador)) {
      setSelectedIndicador(indicadoresMedios[0].indicador_codigo);
    }
  }, [indicadoresMedios, selectedIndicador]);

  const { data: mediasComparativas, isLoading, refetch } = useMediasComparativas(
    selectedIndicador,
    targetEmpresaId,
    currentYear
  );

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise Comparativa Detalhada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mediasComparativas || !empresaGrupos) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Análise Comparativa Detalhada
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <IndicadorSelector
              selectedIndicador={selectedIndicador}
              onIndicadorChange={setSelectedIndicador}
              ano={currentYear}
            />
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Dados insuficientes para análise</p>
              <p className="text-sm mt-1">
                Configure os grupos da empresa para visualizar comparativos detalhados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Análise Comparativa Detalhada
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Compare seu desempenho com grupos similares
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <IndicadorSelector
            selectedIndicador={selectedIndicador}
            onIndicadorChange={setSelectedIndicador}
            ano={currentYear}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="grupos">Por Grupos</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab 
              mediasComparativas={mediasComparativas} 
              empresaGrupos={empresaGrupos || []} 
            />
          </TabsContent>

          <TabsContent value="grupos" className="space-y-4">
            <GruposTab 
              mediasComparativas={mediasComparativas} 
              empresaGrupos={empresaGrupos || []} 
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <InsightsTab 
              mediasComparativas={mediasComparativas} 
              empresaGrupos={empresaGrupos || []} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
