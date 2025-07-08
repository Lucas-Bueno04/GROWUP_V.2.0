
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Briefcase, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { TabContentProps } from './types';
import { formatValue, getPerformanceDifference } from './utils';

export function OverviewTab({ mediasComparativas, empresaGrupos }: TabContentProps) {
  const getPerformanceIcon = (valor?: number, media?: number) => {
    if (!valor || !media) return null;
    
    if (valor > media) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getPerformanceBadge = (valor?: number, media?: number) => {
    if (!valor || !media) return null;
    
    const diferenca = ((valor - media) / media) * 100;
    const variant = diferenca > 0 ? 'default' : 'destructive';
    
    return (
      <Badge variant={variant} className="text-xs">
        {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Minha Empresa */}
        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Minha Empresa</span>
            </div>
            {mediasComparativas.minhaEmpresa && (
              <div className="flex items-center gap-2">
                {getPerformanceIcon(mediasComparativas.minhaEmpresa, mediasComparativas.geral)}
                {getPerformanceBadge(mediasComparativas.minhaEmpresa, mediasComparativas.geral)}
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {mediasComparativas.minhaEmpresa ? formatValue(mediasComparativas.minhaEmpresa) : 'N/A'}
          </div>
        </div>

        {/* Média Geral */}
        <div className="p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Média Geral do Mercado</span>
          </div>
          <div className="text-2xl font-bold">
            {formatValue(mediasComparativas.geral)}
          </div>
        </div>
      </div>

      {/* Médias por Grupo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mediasComparativas.meuGrupoPorte && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Mesmo Porte</span>
              </div>
              {getPerformanceBadge(mediasComparativas.minhaEmpresa, mediasComparativas.meuGrupoPorte)}
            </div>
            <div className="text-lg font-semibold">
              {formatValue(mediasComparativas.meuGrupoPorte)}
            </div>
          </div>
        )}

        {mediasComparativas.meuGrupoSetor && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Mesmo Setor</span>
              </div>
              {getPerformanceBadge(mediasComparativas.minhaEmpresa, mediasComparativas.meuGrupoSetor)}
            </div>
            <div className="text-lg font-semibold">
              {formatValue(mediasComparativas.meuGrupoSetor)}
            </div>
          </div>
        )}

        {mediasComparativas.meuGrupoFaturamento && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Mesmo Faturamento</span>
              </div>
              {getPerformanceBadge(mediasComparativas.minhaEmpresa, mediasComparativas.meuGrupoFaturamento)}
            </div>
            <div className="text-lg font-semibold">
              {formatValue(mediasComparativas.meuGrupoFaturamento)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
