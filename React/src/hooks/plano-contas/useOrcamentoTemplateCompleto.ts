
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrcamentoTemplateCompleto {
  template: any;
  grupos: any[];
  contas: any[];
}

export function useOrcamentoTemplateCompleto(templateId: string = 'default') {
  return useQuery({
    queryKey: ['orcamento-template-completo', templateId],
    queryFn: async () => {
      console.log('useOrcamentoTemplateCompleto: Fetching template data for:', templateId);

      // Fetch grupos and contas from the default template structure
      const { data: grupos, error: gruposError } = await supabase
        .from('orcamento_grupos')
        .select('*')
        .order('ordem');

      if (gruposError) {
        console.error('Error fetching grupos:', gruposError);
        throw gruposError;
      }

      const { data: contas, error: contasError } = await supabase
        .from('orcamento_contas')
        .select('*')
        .order('ordem');

      if (contasError) {
        console.error('Error fetching contas:', contasError);
        throw contasError;
      }

      console.log('useOrcamentoTemplateCompleto: Fetched data:', {
        grupos: grupos?.length || 0,
        contas: contas?.length || 0
      });

      return {
        template: { id: templateId, nome: 'Default Template' },
        grupos: grupos || [],
        contas: contas || []
      } as OrcamentoTemplateCompleto;
    },
    enabled: !!templateId
  });
}
