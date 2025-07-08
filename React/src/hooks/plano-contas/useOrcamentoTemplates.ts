
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOrcamentoTemplates() {
  return useQuery({
    queryKey: ['orcamento-templates'],
    queryFn: async () => {
      console.log('useOrcamentoTemplates: Fetching templates');
      
      const { data, error } = await supabase
        .from('orcamento_grupos')
        .select(`
          *,
          orcamento_contas(*)
        `)
        .order('ordem');

      if (error) {
        console.error('useOrcamentoTemplates: Error fetching templates:', error);
        throw error;
      }

      console.log('useOrcamentoTemplates: Fetched templates:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
