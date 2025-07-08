
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { MetaIndicadorCompleta } from '@/types/metas.types';
import { toast } from '@/components/ui/use-toast';

export function useMetasIndicadores(empresaId?: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for metas indicadores
  const query = useQuery({
    queryKey: ['metas-indicadores', user?.id, empresaId],
    queryFn: async (): Promise<MetaIndicadorCompleta[]> => {
      if (!user?.id) return [];

      let query = supabase
        .from('metas_indicadores')
        .select(`
          *,
          indicador:orcamento_indicadores(codigo, nome, unidade, melhor_quando),
          empresa:empresas(id, nome)
        `)
        .order('ano', { ascending: false })
        .order('mes');

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching metas indicadores:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  // Mutation to create meta
  const criarMeta = useMutation({
    mutationFn: async (meta: any) => {
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
        description: "Meta criada com sucesso."
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

  // Mutation to update meta
  const atualizarMeta = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('metas_indicadores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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

  // Mutation to delete meta
  const excluirMeta = useMutation({
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

  // Mutation to delete multiple metas
  const excluirMultiplasMetas = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('metas_indicadores')
        .delete()
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores'] });
      toast({
        title: "Metas excluídas",
        description: "Metas excluídas com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir metas",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    ...query,
    criarMeta: criarMeta.mutate,
    atualizarMeta: atualizarMeta.mutate,
    excluirMeta: excluirMeta.mutate,
    excluirMultiplasMetas: excluirMultiplasMetas.mutate,
    isCreating: criarMeta.isPending,
    isUpdating: atualizarMeta.isPending,
    isDeleting: excluirMeta.isPending || excluirMultiplasMetas.isPending
  };
}
