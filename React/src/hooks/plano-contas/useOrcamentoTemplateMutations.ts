
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOrcamentoTemplateMutations() {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: async (templateData: any) => {
      const { data, error } = await supabase
        .from('orcamento_grupos')
        .insert(templateData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamento-templates'] });
    },
  });

  return {
    createTemplate: createTemplate.mutate,
    isCreating: createTemplate.isPending,
  };
}
