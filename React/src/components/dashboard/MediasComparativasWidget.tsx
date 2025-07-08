
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { useMediasComparativas } from '@/hooks/dashboard/useMediasComparativas';

interface MediasComparativasWidgetProps {
  empresaId?: string;
  ano?: number;
}

export function MediasComparativasWidget({ empresaId, ano = new Date().getFullYear() }: MediasComparativasWidgetProps) {
  const { data: mediasComparativas, isLoading, error } = useMediasComparativas(undefined, ano);

  const formatValue = (value: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Médias Comparativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Médias Comparativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Erro ao carregar dados comparativos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mediasComparativas || mediasComparativas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Médias Comparativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado comparativo disponível</p>
            <p className="text-sm">Configure indicadores para ver comparações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar apenas os primeiros 5 indicadores
  const topIndicadores = mediasComparativas.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Médias Comparativas
          <Badge variant="secondary" className="ml-auto">
            {mediasComparativas.length} indicadores
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topIndicadores.map((indicador, index) => (
            <div key={indicador.indicador_codigo} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{indicador.indicador_nome}</h4>
                  <p className="text-xs text-muted-foreground">Código: {indicador.indicador_codigo}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {formatValue(indicador.media_geral)}
                  </div>
                  <Badge variant="secondary">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Média Geral
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total de empresas na amostra</span>
                  <span className="font-medium">
                    {indicador.total_empresas} empresas
                  </span>
                </div>
                <Progress 
                  value={Math.min((indicador.total_empresas / 100) * 100, 100)} 
                  className="h-2"
                />
              </div>

              {indicador.grupos && indicador.grupos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Médias por Grupo:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {indicador.grupos.slice(0, 3).map((grupo, gIndex) => (
                      <div key={gIndex} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                        <span>{grupo.grupo_tipo}: {grupo.grupo_valor}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatValue(grupo.media_grupo)}</span>
                          <span className="text-xs text-muted-foreground">
                            ({grupo.total_empresas_grupo} emp.)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {index < topIndicadores.length - 1 && <hr className="border-muted" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
