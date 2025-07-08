
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { NovoIndicadorEmpresa } from '@/types/metas.types';

export function useCreateIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (indicador: NovoIndicadorEmpresa) => {
      const { data, error } = await supabase
        .from('indicadores_empresa')
        .insert(indicador)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-empresa'] });
      toast({
        title: "Indicador criado",
        description: "Indicador da empresa criado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useUpdateIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const { id, ...updates } = data;
      const { data: result, error } = await supabase
        .from('indicadores_empresa')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-empresa'] });
      toast({
        title: "Indicador atualizado",
        description: "Indicador atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

export function useDeleteIndicadorEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('indicadores_empresa')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-empresa'] });
      toast({
        title: "Indicador excluído",
        description: "Indicador excluído com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}
