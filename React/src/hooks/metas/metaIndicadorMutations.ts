
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { NovaMetaIndicador } from '@/types/metas.types';

export function useCreateMetaIndicador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meta: NovaMetaIndicador) => {
      const { data, error } = await supabase
        .from('metas_indicadores')
        .insert(meta)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores'] });
      toast({
        title: "Meta criada",
        description: "Meta do indicador criada com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useUpdateMetaIndicador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...updates } = data;
      const { data: result, error } = await supabase
        .from('metas_indicadores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores'] });
      toast({
        title: "Meta atualizada",
        description: "Meta atualizada com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useDeleteMetaIndicador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('metas_indicadores')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores'] });
      toast({
        title: "Meta excluída",
        description: "Meta excluída com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir meta",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}
