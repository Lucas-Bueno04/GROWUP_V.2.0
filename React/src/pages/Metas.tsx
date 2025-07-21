
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




  return (
    <div className="container mx-auto py-6">
      <MetasPageHeader
        hasErrors={false}
      />
      
      <div className="space-y-6">
       
        <MetasMainContent
        />
      </div>
    </div>
  );
};

export default Metas;
