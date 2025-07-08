
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { toast } from '@/components/ui/use-toast';

export function useMetasIndicadoresEmpresa(empresaId?: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for metas indicadores empresa
  const query = useQuery({
    queryKey: ['metas-indicadores-empresa', user?.id, empresaId],
    queryFn: async (): Promise<MetaIndicadorEmpresaCompleta[]> => {
      if (!user?.id) return [];

      let query = supabase
        .from('metas_indicadores_empresa')
        .select(`
          *,
          indicador_empresa:indicadores_empresa(*)
        `)
        .order('ano', { ascending: false })
        .order('mes');

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching metas indicadores empresa:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  // Mutation to create meta (now supports batch creation)
  const criarMeta = useMutation({
    mutationFn: async (meta: any) => {
      console.log('Creating meta with mutation:', meta);
      
      // Garantir que o usuario_id está presente
      if (!meta.usuario_id) {
        throw new Error('usuario_id é obrigatório para criar meta');
      }

      const { data, error } = await supabase
        .from('metas_indicadores_empresa')
        .insert(meta)
        .select()
        .single();

      if (error) {
        console.error('Error creating meta:', error);
        throw error;
      }
      
      console.log('Meta created successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
      
      // Toast diferenciado se for parte de uma replicação
      const isReplication = variables.isReplication;
      if (!isReplication) {
        toast({
          title: "Meta criada",
          description: "Meta criada com sucesso."
        });
      }
    },
    onError: (error: any, variables) => {
      console.error('Create meta error:', error);
      
      // Toast diferenciado se for parte de uma replicação
      const isReplication = variables.isReplication;
      const errorMessage = isReplication 
        ? `Erro ao criar meta para o mês ${variables.mes}: ${error.message}`
        : `Erro ao criar meta: ${error.message}`;
      
      toast({
        title: "Erro ao criar meta",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  // Helper function to create multiple metas for all months
  const criarMetasParaTodosOsMeses = async (metaBase: any) => {
    console.log('Iniciando criação de metas para todos os meses:', metaBase);
    
    const promises = [];
    const errors = [];
    
    for (let mes = 1; mes <= 12; mes++) {
      const metaMensal = {
        ...metaBase,
        mes: mes,
        isReplication: true // Flag para identificar que é parte de uma replicação
      };
      
      try {
        const promise = criarMeta.mutateAsync(metaMensal);
        promises.push(promise);
        console.log(`Meta criada para mês ${mes}`);
      } catch (error) {
        console.error(`Erro ao criar meta para mês ${mes}:`, error);
        errors.push({ mes, error });
      }
    }
    
    try {
      await Promise.all(promises);
      
      if (errors.length === 0) {
        toast({
          title: "Metas criadas",
          description: `12 metas mensais criadas com sucesso para o ano ${metaBase.ano}.`
        });
      } else {
        toast({
          title: "Metas criadas parcialmente",
          description: `${12 - errors.length} metas criadas. ${errors.length} falharam.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao criar metas sequenciais:', error);
      toast({
        title: "Erro ao criar metas",
        description: "Ocorreu um erro ao criar as metas para todos os meses.",
        variant: "destructive"
      });
    }
  };

  // Mutation to update valor realizado
  const atualizarValorRealizado = useMutation({
    mutationFn: async ({ id, valor_realizado }: { id: string; valor_realizado: number }) => {
      const { data, error } = await supabase
        .from('metas_indicadores_empresa')
        .update({ valor_realizado })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
      toast({
        title: "Valor atualizado",
        description: "Valor realizado atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar valor",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation to delete meta
  const excluirMeta = useMutation({
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

  // Mutation to delete multiple metas
  const excluirMultiplasMetas = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('metas_indicadores_empresa')
        .delete()
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-indicadores-empresa'] });
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
    criarMetasParaTodosOsMeses,
    atualizarValorRealizado: atualizarValorRealizado.mutate,
    excluirMeta: excluirMeta.mutate,
    excluirMultiplasMetas: excluirMultiplasMetas.mutate,
    isCreating: criarMeta.isPending,
    isUpdating: atualizarValorRealizado.isPending,
    isDeleting: excluirMeta.isPending || excluirMultiplasMetas.isPending
  };
}
