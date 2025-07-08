
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOrcamentoContas() {
  return useQuery({
    queryKey: ['orcamento-contas'],
    queryFn: async () => {
      console.log('useOrcamentoContas: Fetching contas');
      
      const { data, error } = await supabase
        .from('orcamento_contas')
        .select('*')
        .order('ordem');

      if (error) {
        console.error('useOrcamentoContas: Error fetching contas:', error);
        throw error;
      }

      console.log('useOrcamentoContas: Fetched contas:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
