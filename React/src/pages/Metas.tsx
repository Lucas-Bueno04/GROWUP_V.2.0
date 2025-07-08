
import { useState, useEffect } from "react";
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { useOrcamentoIndicadores } from '@/hooks/plano-contas';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import { MetasPageHeader } from '@/components/metas/MetasPageHeader';
import { MetasControls } from '@/components/metas/MetasControls';
import { MetasEmpresaHeader } from '@/components/metas/MetasEmpresaHeader';
import { MetasSummaryCards } from '@/components/metas/MetasSummaryCards';
import { MetasMainContent } from '@/components/metas/MetasMainContent';
import { MetasErrorState } from '@/components/metas/MetasErrorState';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';

const Metas = () => {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  
  // Hook para buscar empresas disponíveis
  const { data: empresasDisponiveis = [], isLoading: isLoadingEmpresas, error: empresasError } = useEmpresasOrcamento();
  
  // Selecionar automaticamente a primeira empresa disponível se nenhuma estiver selecionada
  useEffect(() => {
    if (!isLoadingEmpresas && empresasDisponiveis.length > 0 && !empresaId) {
      console.log('Auto-selecionando primeira empresa:', empresasDisponiveis[0]);
      setEmpresaId(empresasDisponiveis[0].id);
    }
  }, [empresasDisponiveis, isLoadingEmpresas, empresaId]);
  
  // Use hooks only in parent component to avoid circular dependencies
  const metasIndicadores = useMetasIndicadores(empresaId);
  const metasIndicadoresEmpresa = useMetasIndicadoresEmpresa(empresaId);
  const indicadoresEmpresa = useIndicadoresProprios(empresaId);
  const { data: indicadoresPlanoContas = [], isLoading: isLoadingPlanoContas } = useOrcamentoIndicadores();

  console.log('=== METAS PAGE STATE ===');
  console.log('Empresa ID selecionada:', empresaId);
  console.log('Empresas disponíveis:', empresasDisponiveis.length);
  console.log('Loading estados:', {
    empresas: isLoadingEmpresas,
    metasIndicadores: metasIndicadores.isLoading,
    metasIndicadoresEmpresa: metasIndicadoresEmpresa.isLoading,
    indicadoresEmpresa: indicadoresEmpresa.isLoading,
    planoContas: isLoadingPlanoContas
  });

  // Calculate totals
  const totalMetas = (metasIndicadores.data?.length || 0) + (metasIndicadoresEmpresa.data?.length || 0);
  const indicadoresAtivos = indicadoresEmpresa.indicadoresProprios.data?.filter(ind => ind.ativo).length || 0;
  const indicadoresPlanoContasCount = indicadoresPlanoContas.length || 0;

  // Check for errors
  const hasErrors = metasIndicadores.isError || metasIndicadoresEmpresa.isError || indicadoresEmpresa.indicadoresProprios.isError || empresasError;

  // Calculate overall loading state
  const isMainContentLoading = metasIndicadores.isLoading || metasIndicadoresEmpresa.isLoading || indicadoresEmpresa.isLoading;

  const handleReload = () => {
    window.location.reload();
  };

  // Show error for empresas loading
  if (empresasError) {
    return (
      <div className="container mx-auto py-6">
        <MetasPageHeader
          totalMetas={totalMetas}
          indicadoresAtivos={indicadoresAtivos}
          indicadoresPlanoContasCount={indicadoresPlanoContasCount}
          hasErrors={true}
          onReload={handleReload}
        />
        <ErrorDisplay 
          error={empresasError} 
          title="Erro ao carregar empresas"
          onRetry={handleReload}
        />
      </div>
    );
  }

  // Show loading while companies are loading
  if (isLoadingEmpresas) {
    return (
      <div className="container mx-auto py-6">
        <MetasPageHeader
          totalMetas={0}
          indicadoresAtivos={0}
          indicadoresPlanoContasCount={0}
          hasErrors={false}
          onReload={handleReload}
        />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando empresas disponíveis...</p>
        </div>
      </div>
    );
  }

  // Show message if no companies available
  if (empresasDisponiveis.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <MetasPageHeader
          totalMetas={0}
          indicadoresAtivos={0}
          indicadoresPlanoContasCount={0}
          hasErrors={false}
          onReload={handleReload}
        />
        <div className="text-center py-8">
          <p>Nenhuma empresa disponível para este usuário.</p>
        </div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="container mx-auto py-6">
        <MetasPageHeader
          totalMetas={totalMetas}
          indicadoresAtivos={indicadoresAtivos}
          indicadoresPlanoContasCount={indicadoresPlanoContasCount}
          hasErrors={true}
          onReload={handleReload}
        />
        <MetasErrorState onReload={handleReload} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <MetasPageHeader
        totalMetas={totalMetas}
        indicadoresAtivos={indicadoresAtivos}
        indicadoresPlanoContasCount={indicadoresPlanoContasCount}
        hasErrors={false}
        onReload={handleReload}
      />
      
      <div className="space-y-6">
        <MetasControls
          empresaId={empresaId}
          onEmpresaChange={setEmpresaId}
          onRefresh={handleReload}
        />

        <MetasEmpresaHeader empresaId={empresaId} />

        {empresaId && (
          <MetasSummaryCards
            totalMetas={totalMetas}
            indicadoresAtivos={indicadoresAtivos}
            metasIndicadoresCount={metasIndicadores.data?.length || 0}
            indicadoresPlanoContasCount={indicadoresPlanoContasCount}
          />
        )}

        <MetasMainContent
          empresaId={empresaId}
          metasIndicadores={metasIndicadores.data || []}
          metasIndicadoresEmpresa={metasIndicadoresEmpresa.data || []}
          indicadoresEmpresa={indicadoresEmpresa.indicadoresProprios.data || []}
          isLoading={isMainContentLoading}
        />
      </div>
    </div>
  );
};

export default Metas;
