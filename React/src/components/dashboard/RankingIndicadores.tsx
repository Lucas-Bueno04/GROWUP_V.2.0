
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';
import { useIndicadoresMedios } from '@/hooks/indicadores-medios';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';

interface RankingIndicadoresProps {
  empresaId?: string;
  compact?: boolean;
}

export function RankingIndicadores({ empresaId, compact = false }: RankingIndicadoresProps) {
  const { data: orcamentos } = useOrcamentoEmpresasPorUsuario();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const targetEmpresaId = empresaId || orcamentos?.[0]?.empresa_id;
  
  const { data: indicadoresMedios, isLoading } = useIndicadoresMedios(selectedYear);

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="h-5 w-5 flex items-center justify-center text-sm font-medium">{position}</span>;
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-yellow-600';
    if (position <= 10) return 'text-green-600';
    if (position <= 25) return 'text-blue-600';
    return 'text-muted-foreground';
  };

  // Simular ranking - na implementação real, viria da API
  const simulateRanking = (indicador: any) => {
    const totalEmpresas = indicador.total_empresas;
    const myPosition = Math.floor(Math.random() * totalEmpresas) + 1;
    const percentile = ((totalEmpresas - myPosition + 1) / totalEmpresas) * 100;
    
    return {
      position: myPosition,
      totalEmpresas,
      percentile: percentile.toFixed(0)
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking de Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="h-6 w-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!indicadoresMedios || indicadoresMedios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking de Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Ranking em preparação</p>
            <p className="text-sm mt-1">
              O ranking será disponibilizado conforme mais empresas participam.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayIndicadores = compact ? indicadoresMedios.slice(0, 3) : indicadoresMedios.slice(0, 8);
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking de Indicadores
          </CardTitle>
          {!compact && (
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Sua posição no ranking dos indicadores de mercado
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayIndicadores.map((indicador, index) => {
            const ranking = simulateRanking(indicador);
            
            return (
              <div key={indicador.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankingIcon(ranking.position)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{indicador.indicador_nome}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Top {ranking.percentile}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      entre {indicador.total_empresas} empresas
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-semibold ${getPositionColor(ranking.position)}`}>
                    #{ranking.position}
                  </p>
                  <p className="text-xs text-muted-foreground">posição</p>
                </div>
              </div>
            );
          })}
          
          {!compact && indicadoresMedios.length > 8 && (
            <div className="text-center pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                +{indicadoresMedios.length - 8} indicadores adicionais no ranking
              </p>
            </div>
          )}

          {compact && indicadoresMedios.length > 3 && (
            <Button variant="outline" className="w-full mt-2">
              Ver Ranking Completo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
