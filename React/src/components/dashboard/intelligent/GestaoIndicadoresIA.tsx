
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calculator,
  Database,
  Lightbulb
} from 'lucide-react';
import { useMediasComparativas } from '@/hooks/dashboard/useMediasComparativas';
import { useDashboardInteligente } from '@/hooks/dashboard/useDashboardInteligente';

export function GestaoIndicadoresIA() {
  const currentYear = new Date().getFullYear();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  
  const { data: medias, isLoading: loadingMedias } = useMediasComparativas(undefined, currentYear);
  const { data: dashboardData, isLoading: loadingDashboard } = useDashboardInteligente(undefined, currentYear);

  if (loadingMedias || loadingDashboard) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalIndicadores = medias?.length || 0;
  const indicadoresAtivos = totalIndicadores;
  const coberturaDados = totalIndicadores > 0 ? 85 : 0; // Simulado

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Gestão de Indicadores IA</h2>
            <p className="text-muted-foreground">Sistema centralizado de análise de indicadores</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalIndicadores} Indicadores
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Ano {currentYear}
          </Badge>
        </div>
      </div>

      {/* Cards de Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Indicadores</p>
                <p className="text-2xl font-bold">{totalIndicadores}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Indicadores Ativos</p>
                <p className="text-2xl font-bold text-green-600">{indicadoresAtivos}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cobertura de Dados</p>
                <p className="text-2xl font-bold text-purple-600">{coberturaDados}%</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Análises IA</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData?.insights?.length || 0}</p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="medias">Médias Setoriais</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {medias?.slice(0, 8).map((media, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{media.indicador_nome}</h4>
                        <Badge variant="outline" className="text-xs">
                          {media.indicador_codigo}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Média Geral</p>
                          <p className="font-bold text-lg">{media.media_geral.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Empresas</p>
                          <p className="font-bold text-lg">{media.total_empresas}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Grupos</p>
                          <p className="font-bold text-lg">{media.grupos?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant="secondary" className="text-xs">
                            Ativo
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calculator className="h-4 w-4 mr-1" />
                        Calcular
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card>
                <CardContent className="p-8 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum indicador encontrado</h3>
                  <p className="text-muted-foreground">
                    Execute o cálculo de médias para ver os indicadores disponíveis.
                  </p>
                  <Button className="mt-4">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Médias
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="medias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Médias por Grupo Setorial</CardTitle>
              <p className="text-sm text-muted-foreground">
                Análise das médias dos indicadores segmentadas por grupos
              </p>
            </CardHeader>
            <CardContent>
              {medias && medias.length > 0 ? (
                <div className="space-y-4">
                  {medias.slice(0, 5).map((media, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{media.indicador_nome}</h4>
                        <Badge variant="outline">{media.indicador_codigo}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {media.grupos?.slice(0, 3).map((grupo, gIndex) => (
                          <div key={gIndex} className="bg-muted/50 rounded p-3">
                            <p className="text-sm font-medium">{grupo.grupo_tipo}: {grupo.grupo_valor}</p>
                            <p className="text-lg font-bold">{grupo.media_grupo.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">
                              {grupo.total_empresas_grupo} empresas
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-semibold">Dados em preparação</p>
                  <p className="text-muted-foreground">As médias setoriais serão calculadas automaticamente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold">Benchmarks em desenvolvimento</p>
                <p className="text-muted-foreground">Sistema de comparação avançada será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
