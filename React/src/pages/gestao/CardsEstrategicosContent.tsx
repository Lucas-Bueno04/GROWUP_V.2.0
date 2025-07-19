

import React, { useEffect } from 'react';
import { useCardsEstrategicosPage } from '@/hooks/cards-estrategicos/useCardsEstrategicosPage';
import { CardsEstrategicosHeader } from '@/components/cards-estrategicos';
import { CardsEstrategicosPageContent } from '@/components/cards-estrategicos/CardsEstrategicosPageContent';
import { CardsEstrategicosLoadingState, CardsEstrategicosErrorState } from '@/components/cards-estrategicos';

const anoAtual = new Date().getFullYear();

export default function CardsEstrategicos() {

  

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        {/* Header com informações gerais - agora dentro do container com padding */}
        <CardsEstrategicosHeader
          ano={anoAtual}
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
