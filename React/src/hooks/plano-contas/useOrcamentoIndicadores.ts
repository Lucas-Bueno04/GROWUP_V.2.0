
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { OrcamentoIndicador } from '@/types/plano-contas.types';

export function useOrcamentoIndicadores() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['orcamento-indicadores'],
    queryFn: async (): Promise<OrcamentoIndicador[]> => {
      console.log('Buscando indicadores do orçamento...');
      
      const { data, error } = await supabase
        .from('orcamento_indicadores')
        .select('*')
        .order('ordem');

      if (error) {
        console.error('Erro ao buscar indicadores:', error);
        throw error;
      }
      
      console.log('Indicadores encontrados:', data?.length || 0);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const invalidateAllCaches = () => {
    console.log('Invalidando cache de indicadores...');
    queryClient.invalidateQueries({ queryKey: ['orcamento-indicadores'] });
    queryClient.invalidateQueries({ queryKey: ['orcamento-grupos'] });
    queryClient.invalidateQueries({ queryKey: ['orcamento-contas'] });
  };

  return {
    ...query,
    invalidateAllCaches,
  };
}
