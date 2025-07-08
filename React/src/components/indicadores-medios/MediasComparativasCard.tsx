
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMediasComparativas } from '@/hooks/indicadores-medios';

interface MediasComparativasCardProps {
  indicadorCodigo: string;
  indicadorNome: string;
  empresaId?: string;
  ano?: number;
}

export function MediasComparativasCard({
  indicadorCodigo,
  indicadorNome,
  empresaId,
  ano
}: MediasComparativasCardProps) {
  const { data: medias, isLoading } = useMediasComparativas(indicadorCodigo, empresaId, ano);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Comparativo de Mercado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!medias) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Comparativo de Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Dados comparativos não disponíveis para este indicador.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getComparison = (meuValor?: number, mediaReferencia?: number) => {
    if (!meuValor || !mediaReferencia) return null;
    
    const diferenca = ((meuValor - mediaReferencia) / mediaReferencia) * 100;
    
    if (Math.abs(diferenca) < 5) {
      return { status: 'igual', icon: Minus, color: 'text-gray-500', diferenca };
    } else if (diferenca > 0) {
      return { status: 'melhor', icon: TrendingUp, color: 'text-green-600', diferenca };
    } else {
      return { status: 'pior', icon: TrendingDown, color: 'text-red-600', diferenca };
    }
  };

  const formatValue = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    });
  };

  const getStatusBadge = (comparison: any) => {
    if (!comparison) return null;
    
    const { status, diferenca } = comparison;
    const variant = status === 'melhor' ? 'default' : status === 'pior' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="text-xs">
        {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)}%
      </Badge>
    );
  };

  const comparisonGeral = getComparison(medias.minhaEmpresa, medias.geral);
  const comparisonPorte = getComparison(medias.minhaEmpresa, medias.meuGrupoPorte);
  const comparisonSetor = getComparison(medias.minhaEmpresa, medias.meuGrupoSetor);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Comparativo de Mercado - {indicadorNome}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Minha Empresa */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Minha Empresa</span>
          <span className="text-sm font-bold">{formatValue(medias.minhaEmpresa)}</span>
        </div>
        
        {/* Média Geral */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Média Geral do Mercado</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">{formatValue(medias.geral)}</span>
            {getStatusBadge(comparisonGeral)}
          </div>
        </div>

        {/* Média por Porte */}
        {medias.meuGrupoPorte && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Empresas do Mesmo Porte</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{formatValue(medias.meuGrupoPorte)}</span>
              {getStatusBadge(comparisonPorte)}
            </div>
          </div>
        )}

        {/* Média por Setor */}
        {medias.meuGrupoSetor && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Empresas do Mesmo Setor</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{formatValue(medias.meuGrupoSetor)}</span>
              {getStatusBadge(comparisonSetor)}
            </div>
          </div>
        )}

        {/* Média por Faturamento */}
        {medias.meuGrupoFaturamento && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Faixa de Faturamento</span>
            <span className="text-sm">{formatValue(medias.meuGrupoFaturamento)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
