
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import type { CardsEstrategicosFilters } from '@/hooks/cards-estrategicos';

interface CardsEstrategicosFiltersComponentProps {
  filters: CardsEstrategicosFilters;
  onFiltersChange: (filters: CardsEstrategicosFilters) => void;
}

export function CardsEstrategicosFilters({
  filters,
  onFiltersChange
}: CardsEstrategicosFiltersComponentProps) {
  const updateFilter = (key: keyof CardsEstrategicosFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={filters.tipoIndicador} onValueChange={(value) => updateFilter('tipoIndicador', value)}>
              <SelectTrigger>
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
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
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
            <label className="text-sm font-medium">Visualização</label>
            <Select value={filters.tipoVisualizacao} onValueChange={(value) => updateFilter('tipoVisualizacao', value)}>
              <SelectTrigger>
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
