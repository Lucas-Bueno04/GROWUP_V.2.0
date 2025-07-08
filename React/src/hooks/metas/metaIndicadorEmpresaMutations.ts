
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { NovaMetaIndicadorEmpresa } from '@/types/metas.types';

export function useCreateMetaIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meta: NovaMetaIndicadorEmpresa) => {
      // Garantir que empresa_id está definido
      if (!meta.empresa_id) {
        throw new Error('empresa_id é obrigatório para criar meta de indicador empresa');
      }

      const { data, error } = await supabase
        .from('metas_indicadores_empresa')
        .insert(meta)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
      toast({
        title: "Meta criada",
        description: "Meta do indicador próprio criada com sucesso."
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

export function useUpdateMetaIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...updates } = data;
      const { data: result, error } = await supabase
        .from('metas_indicadores_empresa')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
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

export function useDeleteMetaIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('metas_indicadores_empresa')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
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
