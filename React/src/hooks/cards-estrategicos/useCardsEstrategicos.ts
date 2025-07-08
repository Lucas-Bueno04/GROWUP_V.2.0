
import { useQuery } from '@tanstack/react-query';
import { useCardsEstrategicosQueryConfig } from './queryConfig';
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { useOrcamentoIndicadores } from '@/hooks/plano-contas';
import { processStrategicCards } from './strategicCardsProcessor';

export function useCardsEstrategicos(ano: number = 2025, empresaId?: string | null) {
  const queryConfig = useCardsEstrategicosQueryConfig(ano, empresaId);
  
  // Buscar dados diretamente dos hooks
  const metasIndicadores = useMetasIndicadores(empresaId);
  const metasIndicadoresEmpresa = useMetasIndicadoresEmpresa(empresaId);
  const indicadoresEmpresa = useIndicadoresProprios(empresaId);
  const { data: indicadoresPlanoContas } = useOrcamentoIndicadores();

  console.log('=== CARDS ESTRATÉGICOS HOOK (SIMPLIFIED) ===');
  console.log('Hook called with:', { ano, empresaId });
  console.log('Data status:', {
    metasIndicadores: metasIndicadores.data?.length || 0,
    metasIndicadoresEmpresa: metasIndicadoresEmpresa.data?.length || 0,
    indicadoresEmpresa: indicadoresEmpresa.indicadoresProprios.data?.length || 0,
    indicadoresPlanoContas: indicadoresPlanoContas?.length || 0
  });

  return useQuery({
    queryKey: queryConfig.queryKey,
    queryFn: async () => {
      if (!queryConfig.user?.id) {
        console.log('No user ID, returning empty array');
        return [];
      }

      return await processStrategicCards(
        ano,
        empresaId,
        queryConfig.user,
        metasIndicadores,
        metasIndicadoresEmpresa,
        indicadoresEmpresa,
        indicadoresPlanoContas
      );
    },
    enabled: queryConfig.isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}
