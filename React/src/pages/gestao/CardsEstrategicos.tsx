
import React from 'react';
import { useCardsEstrategicosPage } from '@/hooks/cards-estrategicos/useCardsEstrategicosPage';
import { CardsEstrategicosHeader } from '@/components/cards-estrategicos';
import { CardsEstrategicosPageContent } from '@/components/cards-estrategicos/CardsEstrategicosPageContent';
import { CardsEstrategicosLoadingState, CardsEstrategicosErrorState } from '@/components/cards-estrategicos';

export default function CardsEstrategicos() {
  const {
    ano,
    empresaId,
    setEmpresaId,
    filters,
    setFilters,
    empresasDisponiveis,
    isLoadingEmpresas,
    empresasError,
    indicadores,
    indicadoresFiltrados,
    isLoading,
    error,
    stats,
    handleRefresh
  } = useCardsEstrategicosPage();

  // Show loading state only for companies loading
  if (isLoadingEmpresas) {
    return <CardsEstrategicosLoadingState />;
  }

  // Show error state only for companies error
  if (empresasError) {
    return <CardsEstrategicosErrorState error={empresasError} onRefresh={handleRefresh} />;
  }

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        {/* Header com informações gerais - agora dentro do container com padding */}
        <CardsEstrategicosHeader
          totalIndicadores={indicadores?.length || 0}
          ano={ano}
          stats={stats}
        />
        
        {/* Conteúdo principal com estrutura linear */}
        <CardsEstrategicosPageContent
          empresaId={empresaId}
          setEmpresaId={setEmpresaId}
          handleRefresh={handleRefresh}
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          indicadoresFiltrados={indicadoresFiltrados}
          empresasDisponiveis={empresasDisponiveis}
          isLoading={isLoading}
          error={error}
          indicadores={indicadores}
        />
      </div>
    </div>
  );
}
