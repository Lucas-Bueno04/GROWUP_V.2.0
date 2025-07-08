
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { BadgeProgressIndicator } from '@/components/analise-orcamentaria/BadgeProgressIndicator';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { useAuth } from '@/hooks/useAuth';
import type { CardsEstrategicosFilters } from '@/hooks/cards-estrategicos';

interface CardsEstrategicosEmpresaHeaderProps {
  empresaId: string | null;
  filters: CardsEstrategicosFilters;
  onFiltersChange: (filters: CardsEstrategicosFilters) => void;
}

export function CardsEstrategicosEmpresaHeader({
  empresaId,
  filters,
  onFiltersChange
}: CardsEstrategicosEmpresaHeaderProps) {
  const { user } = useAuth();
  const { data: empresasOrcamento = [] } = useEmpresasOrcamento();
  const { data: orcamentosUsuario = [] } = useOrcamentoEmpresasPorUsuario();
  const { data: badgeData } = useCompanyBadge(empresaId);

  if (!empresaId) return null;

  // Get company name based on user role using correct property names
  const getCompanyName = () => {
    if (user?.role === 'mentor') {
      const empresa = empresasOrcamento.find(e => e.id === empresaId);
      return empresa ? `${empresa.nomeFantasia || empresa.nome} (${empresa.ano})` : 'Empresa não encontrada';
    } else {
      const orcamento = orcamentosUsuario.find(o => o.empresa_id === empresaId);
      return orcamento?.empresa ? `${orcamento.empresa.nome_fantasia || orcamento.empresa.nome} (${orcamento.ano})` : 'Empresa não encontrada';
    }
  };

  const updateFilter = (key: keyof CardsEstrategicosFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Company Info with Badge - Unified Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Company Badge */}
            {badgeData?.classification && (
              <div className="flex justify-center lg:justify-start">
                <CompanyMedal 
                  classification={badgeData.classification} 
                  currentRevenue={badgeData.currentRevenue}
                  size="sm" 
                  showProgress={false}
                />
              </div>
            )}
            
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-semibold">{getCompanyName()}</h2>
              <p className="text-sm text-muted-foreground">Indicadores estratégicos da empresa</p>
            </div>
          </div>

          {/* Badge Progress Indicator */}
          {badgeData && (
            <div className="min-w-[300px]">
              <BadgeProgressIndicator
                currentRevenue={badgeData.currentRevenue}
                nextThreshold={badgeData.nextThreshold}
                nextLevel={badgeData.nextLevel}
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Integrated Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Período</label>
            <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
            <Select value={filters.tipoIndicador} onValueChange={(value) => updateFilter('tipoIndicador', value)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="plano-contas">Plano de Contas</SelectItem>
                <SelectItem value="empresa">Próprios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="acima">Acima da Meta</SelectItem>
                <SelectItem value="dentro">Na Meta</SelectItem>
                <SelectItem value="abaixo">Abaixo da Meta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Visualização</label>
            <Select value={filters.tipoVisualizacao} onValueChange={(value) => updateFilter('tipoVisualizacao', value)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="card">Cards</SelectItem>
                <SelectItem value="chart">Gráficos</SelectItem>
                <SelectItem value="list">Tabelas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
