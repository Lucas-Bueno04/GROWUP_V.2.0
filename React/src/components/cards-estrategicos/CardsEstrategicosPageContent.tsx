
import React from 'react';
import { CardsEstrategicosControls } from './CardsEstrategicosControls';
import { CardsEstrategicosEmpresaHeader } from './CardsEstrategicosEmpresaHeader';
import { CardsEstrategicosStats } from './CardsEstrategicosStats';
import { CardsEstrategicosContent } from './CardsEstrategicosContent';
import { CardsEstrategicosLoadingState, CardsEstrategicosErrorState, CardsEstrategicosEmptyState } from '@/components/cards-estrategicos';
import type { CardsEstrategicosFilters as FiltersType, IndicadorEstrategico } from '@/hooks/cards-estrategicos';

interface CardsEstrategicosPageContentProps {
  empresaId: string | null;
  setEmpresaId: (empresaId: string | null) => void;
  handleRefresh: () => void;
  filters: FiltersType;
  setFilters: (filters: FiltersType) => void;
  stats: any;
  indicadoresFiltrados: IndicadorEstrategico[];
  empresasDisponiveis: any[];
  isLoading: boolean;
  error: Error | null;
  indicadores: IndicadorEstrategico[] | undefined;
}

export function CardsEstrategicosPageContent({
  empresaId,
  setEmpresaId,
  handleRefresh,
  filters,
  setFilters,
  stats,
  indicadoresFiltrados,
  empresasDisponiveis,
  isLoading,
  error,
  indicadores
}: CardsEstrategicosPageContentProps) {
  return (
    <div className="space-y-6">
      {/* Company Selector - Always visible */}
      <CardsEstrategicosControls
        empresaId={empresaId}
        onEmpresaChange={setEmpresaId}
        onRefresh={handleRefresh}
      />
      
      {/* Company Header with Badge and Filters - Only when company is selected */}
      {empresaId && (
        <CardsEstrategicosEmpresaHeader
          empresaId={empresaId}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}
      
      {/* Loading state for indicators */}
      {empresaId && isLoading && <CardsEstrategicosLoadingState />}
      
      {/* Error state for indicators */}
      {empresaId && error && (
        <CardsEstrategicosErrorState error={error} onRefresh={handleRefresh} />
      )}
      
      {/* Empty state when no indicators */}
      {empresaId && !isLoading && !error && (!indicadores || indicadores.length === 0) && (
        <CardsEstrategicosEmptyState
          empresaId={empresaId}
          onEmpresaChange={setEmpresaId}
          onRefresh={handleRefresh}
          metasIndicadoresCount={0}
          metasIndicadoresEmpresaCount={0}
          indicadoresEmpresaCount={0}
          showDebugInfo={false}
          ano={new Date().getFullYear()}
        />
      )}
      
      {/* Stats Summary - Only when company is selected and has data */}
      {empresaId && stats && indicadores && indicadores.length > 0 && (
        <CardsEstrategicosStats stats={stats} />
      )}
      
      {/* Main Content - Only when company is selected and has data */}
      {empresaId && !isLoading && !error && indicadores && indicadores.length > 0 && (
        <CardsEstrategicosContent 
          indicadoresFiltrados={indicadoresFiltrados}
        />
      )}
    </div>
  );
}
