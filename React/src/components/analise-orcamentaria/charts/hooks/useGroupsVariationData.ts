
import React from 'react';
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { getVarianceStatusBadge, determineGroupSign, determineGroupCategory } from '../../utils/varianceUtils';

type FilterMode = 'all' | 'positive' | 'negative' | 'revenue' | 'costs' | 'indicators';

export function useGroupsVariationData(
  data: BudgetAnalysisData,
  filterMode: FilterMode,
  maxGroups: number
) {
  return React.useMemo(() => {
    let grupos = data.dadosHierarquicos.grupos.map(grupo => {
      const groupSign = determineGroupSign(grupo);
      const groupCategory = determineGroupCategory(grupo);
      const isRevenue = groupCategory === 'Receita';
      const isIndicator = groupCategory === 'Resultado/Indicador';
      const badgeInfo = getVarianceStatusBadge(grupo.variancia, grupo.orcado, groupSign);
      
      return {
        ...grupo,
        groupSign,
        groupCategory,
        isRevenue,
        isIndicator,
        absVariancia: Math.abs(grupo.variancia),
        percentualVariancia: grupo.orcado !== 0 ? (grupo.variancia / grupo.orcado) * 100 : 0,
        status: badgeInfo.text,
        statusColor: badgeInfo.variant === 'default' ? '#10b981' : 
                    badgeInfo.variant === 'destructive' ? '#ef4444' : '#6b7280'
      };
    });

    // Apply filters
    switch (filterMode) {
      case 'positive':
        grupos = grupos.filter(g => g.variancia > 0);
        break;
      case 'negative':
        grupos = grupos.filter(g => g.variancia < 0);
        break;
      case 'revenue':
        grupos = grupos.filter(g => g.isRevenue);
        break;
      case 'costs':
        grupos = grupos.filter(g => g.groupCategory === 'Custo/Despesa');
        break;
      case 'indicators':
        grupos = grupos.filter(g => g.isIndicator);
        break;
    }

    // Filter out zero variance and sort by absolute variance
    grupos = grupos
      .filter(grupo => Math.abs(grupo.variancia) > 0)
      .sort((a, b) => b.absVariancia - a.absVariancia)
      .slice(0, maxGroups);

    const totalVariancia = grupos.reduce((sum, g) => sum + g.absVariancia, 0);

    const formatPercentage = (value: number, total: number) => {
      if (total === 0) return '0%';
      return `${((Math.abs(value) / total) * 100).toFixed(1)}%`;
    };

    return grupos.map((grupo, index) => ({
      ...grupo,
      percentage: formatPercentage(grupo.variancia, totalVariancia),
      displayName: grupo.nome.length > 25 ? grupo.nome.substring(0, 25) + '...' : grupo.nome,
      color: grupo.statusColor || ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#06b6d4'][index % 8]
    }));
  }, [data.dadosHierarquicos.grupos, filterMode, maxGroups]);
}
