
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth';
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';

export function useDashboardData() {
  const { user } = useAuth();
  
  // Fetch available budgets for the user
  const { data: orcamentoEmpresas = [], isLoading: isLoadingOrcamentos } = useOrcamentoEmpresasPorUsuario();
  
  // Use first empresa available or null
  const empresaId = orcamentoEmpresas.length > 0 ? orcamentoEmpresas[0].empresa_id : null;
  
  // Fetch metas data using individual hooks
  const metasIndicadores = useMetasIndicadores(empresaId);
  const metasIndicadoresEmpresa = useMetasIndicadoresEmpresa(empresaId);
  const indicadoresEmpresa = useIndicadoresProprios(empresaId);

  const isDashboardLoading = isLoadingOrcamentos || 
    metasIndicadores.isLoading || 
    metasIndicadoresEmpresa.isLoading || 
    indicadoresEmpresa.isLoading;

  return useQuery({
    queryKey: ['dashboard-data', user?.id, empresaId],
    queryFn: () => {
      const totalMetas = (metasIndicadores.data?.length || 0) + (metasIndicadoresEmpresa.data?.length || 0);
      const indicadoresAtivos = indicadoresEmpresa.indicadoresProprios.data?.filter(ind => ind.ativo).length || 0;
      
      return {
        totalMetas,
        indicadoresAtivos,
        empresaAtual: empresaId,
        totalEmpresas: orcamentoEmpresas.length,
        metasIndicadores: metasIndicadores.data || [],
        metasIndicadoresEmpresa: metasIndicadoresEmpresa.data || [],
        indicadoresProprios: indicadoresEmpresa.indicadoresProprios.data || [],
        // Add the properties that Dashboard expects
        empresas: { data: [] },
        orcamentos: { data: orcamentoEmpresas },
        alertas: { data: [] },
        metrics: {
          totalMetas,
          indicadoresAtivos,
          totalEmpresas: orcamentoEmpresas.length,
          alertasAtivos: 0
        }
      };
    },
    enabled: !!user?.id && !isDashboardLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
