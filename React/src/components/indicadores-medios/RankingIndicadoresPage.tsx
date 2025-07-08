
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Award, Users } from 'lucide-react';
import { useIndicadoresMedios } from '@/hooks/indicadores-medios';
import { Header } from '@/components/layout/Header';

export function RankingIndicadoresPage() {
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const { data: indicadores, isLoading } = useIndicadoresMedios(anoSelecionado);

  const formatValue = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
  };

  const getIndicadorColor = (codigo: string) => {
    // Cores baseadas no tipo de indicador
    if (codigo.startsWith('IND001')) return 'bg-blue-500';
    if (codigo.startsWith('IND002')) return 'bg-green-500';
    if (codigo.startsWith('IND003')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header 
          title="Ranking de Indicadores de Mercado"
          description="Acompanhe as médias dos principais indicadores por setor e porte"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Ranking de Indicadores de Mercado"
        description="Acompanhe as médias dos principais indicadores por setor e porte"
      />

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Select 
              value={anoSelecionado.toString()} 
              onValueChange={(value) => setAnoSelecionado(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023].map(ano => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Total de Indicadores</span>
            </div>
            <div className="text-2xl font-bold">{indicadores?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Empresas Participantes</span>
            </div>
            <div className="text-2xl font-bold">
              {indicadores?.reduce((acc, ind) => Math.max(acc, ind.total_empresas), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Melhor Performance</span>
            </div>
            <div className="text-2xl font-bold">
              {indicadores?.length ? Math.max(...indicadores.map(i => i.media_geral)).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Menor Performance</span>
            </div>
            <div className="text-2xl font-bold">
              {indicadores?.length ? Math.min(...indicadores.map(i => i.media_geral)).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicadores?.map((indicador) => (
          <Card key={indicador.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {indicador.indicador_nome}
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {indicador.indicador_codigo}
                  </Badge>
                </div>
                <div className={`w-3 h-3 rounded-full ${getIndicadorColor(indicador.indicador_codigo)}`} />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatValue(indicador.media_geral)}
                  </div>
                  <div className="text-sm text-muted-foreground">Média Geral</div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Empresas:</span>
                  <span className="font-medium">{indicador.total_empresas}</span>
                </div>

                {/* Médias por Grupo */}
                {indicador.grupos && indicador.grupos.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-sm font-medium text-muted-foreground">
                      Médias por Segmento:
                    </div>
                    {indicador.grupos
                      .filter(g => g.grupo_tipo === 'porte')
                      .map(grupo => (
                        <div key={grupo.id} className="flex justify-between text-xs">
                          <span className="capitalize">{grupo.grupo_valor}</span>
                          <span>{formatValue(grupo.media_grupo)} ({grupo.total_empresas_grupo})</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio */}
      {!isLoading && (!indicadores || indicadores.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Indicador Encontrado</h3>
            <p className="text-muted-foreground">
              Não há dados de indicadores médios disponíveis para o ano selecionado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
