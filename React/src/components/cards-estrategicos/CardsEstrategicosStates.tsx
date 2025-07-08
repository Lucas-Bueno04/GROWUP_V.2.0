
import React from 'react';
import { 
  CardsEstrategicosHeader,
  CardsEstrategicosEmptyState,
  CardsEstrategicosErrorState,
  CardsEstrategicosLoadingState
} from '@/components/cards-estrategicos';
import { AuthDebugInfo } from '@/components/shared/AuthDebugInfo';
import { RLSTestComponent } from '@/components/shared/RLSTestComponent';
import { EmpresaOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';

interface CardsEstrategicosStatesProps {
  ano: number;
  empresaId: string | null;
  setEmpresaId: (id: string | null) => void;
  handleRefresh: () => void;
  empresasDisponiveis: EmpresaOrcamento[];
  isLoadingEmpresas: boolean;
  empresasError: Error | null;
  isLoading: boolean;
  error: Error | null;
  indicadores: any[] | undefined;
}

export function CardsEstrategicosStates({
  ano,
  empresaId,
  setEmpresaId,
  handleRefresh,
  empresasDisponiveis,
  isLoadingEmpresas,
  empresasError,
  isLoading,
  error,
  indicadores
}: CardsEstrategicosStatesProps) {
  // Show error for empresas loading
  if (empresasError) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
          <div className="text-red-600 p-4 border border-red-200 rounded">
            <h3 className="font-semibold">Erro ao carregar empresas:</h3>
            <p>{empresasError.message}</p>
          </div>
        </div>
        <CardsEstrategicosErrorState error={empresasError} onRefresh={handleRefresh} />
      </div>
    );
  }

  // Show loading while companies are loading
  if (isLoadingEmpresas) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
          <div className="text-center py-8">
            <p>Carregando empresas disponíveis...</p>
          </div>
        </div>
        <CardsEstrategicosLoadingState />
      </div>
    );
  }

  // Show message if no companies available
  if (empresasDisponiveis.length === 0) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
          <div className="text-center py-8">
            <p>Nenhuma empresa disponível para este usuário.</p>
          </div>
        </div>
        <CardsEstrategicosEmptyState
          empresaId={empresaId}
          onEmpresaChange={setEmpresaId}
          onRefresh={handleRefresh}
          metasIndicadoresCount={0}
          metasIndicadoresEmpresaCount={0}
          indicadoresEmpresaCount={0}
          showDebugInfo={import.meta.env.DEV}
          ano={ano}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
        </div>
        <CardsEstrategicosLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
          <div className="text-red-600 p-4 border border-red-200 rounded">
            <h3 className="font-semibold">Error Details:</h3>
            <p>{error.message}</p>
          </div>
        </div>
        <CardsEstrategicosErrorState error={error} onRefresh={handleRefresh} />
      </div>
    );
  }

  if (!indicadores || indicadores.length === 0) {
    return (
      <div className="h-full">
        <CardsEstrategicosHeader
          totalIndicadores={0}
          ano={ano}
          stats={null}
        />
        <div className="p-4 lg:p-6 space-y-4">
          <AuthDebugInfo />
          <RLSTestComponent />
          <div className="text-center py-8 bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Nenhum indicador encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não foram encontrados indicadores estratégicos para a empresa selecionada: 
              <strong>{empresasDisponiveis.find(e => e.id === empresaId)?.nome || 'Empresa não encontrada'}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique se existem indicadores e metas configurados para esta empresa.
            </p>
          </div>
        </div>
        <CardsEstrategicosEmptyState
          empresaId={empresaId}
          onEmpresaChange={setEmpresaId}
          onRefresh={handleRefresh}
          metasIndicadoresCount={0}
          metasIndicadoresEmpresaCount={0}
          indicadoresEmpresaCount={0}
          showDebugInfo={import.meta.env.DEV}
          ano={ano}
        />
      </div>
    );
  }

  return null;
}
