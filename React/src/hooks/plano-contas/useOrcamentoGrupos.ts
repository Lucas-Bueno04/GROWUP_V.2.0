
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOrcamentoGrupos() {
  return useQuery({
    queryKey: ['orcamento-grupos'],
    queryFn: async () => {
      console.log('useOrcamentoGrupos: Fetching grupos');
      
      const { data, error } = await supabase
        .from('orcamento_grupos')
        .select('*')
        .order('ordem');

      if (error) {
        console.error('useOrcamentoGrupos: Error fetching grupos:', error);
        throw error;
      }

      console.log('useOrcamentoGrupos: Fetched grupos:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
