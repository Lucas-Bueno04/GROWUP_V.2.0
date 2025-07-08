
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart as PieChartIcon, BarChart3, Eye, Filter } from "lucide-react";

type ViewMode = 'pie' | 'bar' | 'detailed';
type FilterMode = 'all' | 'positive' | 'negative' | 'revenue' | 'costs' | 'indicators';

interface GroupsVariationControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filterMode: FilterMode;
  setFilterMode: (mode: FilterMode) => void;
  maxGroups: number;
  setMaxGroups: (count: number) => void;
  showPercentages: boolean;
  setShowPercentages: (show: boolean) => void;
}

export function GroupsVariationControls({
  viewMode,
  setViewMode,
  filterMode,
  setFilterMode,
  maxGroups,
  setMaxGroups,
  showPercentages,
  setShowPercentages
}: GroupsVariationControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'pie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('pie')}
        >
          <PieChartIcon className="h-4 w-4 mr-1" />
          Pizza
        </Button>
        <Button
          variant={viewMode === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('bar')}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Barras
        </Button>
        <Button
          variant={viewMode === 'detailed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('detailed')}
        >
          <Eye className="h-4 w-4 mr-1" />
          Detalhado
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterMode} onValueChange={(value: FilterMode) => setFilterMode(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="positive">Positivas</SelectItem>
            <SelectItem value="negative">Negativas</SelectItem>
            <SelectItem value="revenue">Receitas</SelectItem>
            <SelectItem value="costs">Custos</SelectItem>
            <SelectItem value="indicators">Indicadores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={maxGroups.toString()} onValueChange={(value) => setMaxGroups(parseInt(value))}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="15">15</SelectItem>
        </SelectContent>
      </Select>

      {viewMode === 'pie' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPercentages(!showPercentages)}
        >
          {showPercentages ? 'Ocultar %' : 'Mostrar %'}
        </Button>
      )}
    </div>
  );
}
