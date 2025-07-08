
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { MediasComparativasWidget } from './MediasComparativasWidget';

interface Indicador {
  nome: string;
  realizado: number;
  orcado: number;
}

interface MainIndicatorsSectionProps {
  topIndicators: Indicador[];
  empresaId?: string;
}

export function MainIndicatorsSection({ topIndicators, empresaId }: MainIndicatorsSectionProps) {
  const formatCurrency = (value: number | undefined | null) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(safeValue);
  };

  const formatPercentage = (value: number | undefined | null) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return `${safeValue.toFixed(1)}%`;
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (variance < -5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-green-600 bg-green-50 border-green-200';
    if (variance < -5) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Indicadores Principais */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Principais Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIndicators.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Nenhum indicador encontrado</h3>
                <p className="text-sm max-w-sm mx-auto">
                  Configure seu orçamento e indicadores para ver análises detalhadas aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topIndicators.map((indicador, index) => {
                  const variance = indicador.orcado > 0 
                    ? ((indicador.realizado - indicador.orcado) / indicador.orcado) * 100 
                    : 0;
                  
                  const isMonetary = !indicador.nome.includes('%') && 
                                   !indicador.nome.includes('Margem') && 
                                   !indicador.nome.includes('Índice');
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${getVarianceColor(variance)}`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm leading-tight pr-2">
                            {indicador.nome}
                          </h4>
                          <div className="flex items-center gap-1">
                            {getVarianceIcon(variance)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Realizado:</span>
                            <span className="font-bold text-lg">
                              {isMonetary 
                                ? formatCurrency(indicador.realizado)
                                : formatPercentage(indicador.realizado)
                              }
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Orçado:</span>
                            <span className="text-sm opacity-75">
                              {isMonetary 
                                ? formatCurrency(indicador.orcado)
                                : formatPercentage(indicador.orcado)
                              }
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-current/20">
                            <span className="text-xs font-medium">Variação:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold">
                                {variance > 0 ? '+' : ''}{formatPercentage(variance)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Widget de Médias Comparativas */}
      <div>
        <MediasComparativasWidget empresaId={empresaId} />
      </div>
    </div>
  );
}
