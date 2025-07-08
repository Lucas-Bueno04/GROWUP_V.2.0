
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  IndicadorEmpresa,
  NovoIndicadorEmpresa
} from '@/types/metas.types';

export function useIndicadoresProprios(empresaId?: string | null) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  console.log('=== useIndicadoresProprios HOOK ===');
  console.log('Called with empresaId:', empresaId);
  console.log('User:', user?.id, user?.role);

  // Query para buscar indicadores próprios - filtrar por empresa quando fornecida
  const indicadoresProprios = useQuery({
    queryKey: ['indicadores-proprios', user?.id, empresaId],
    queryFn: async (): Promise<IndicadorEmpresa[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty array');
        return [];
      }
      
      console.log('Fetching indicadores proprios with filters:', {
        userId: user.id,
        empresaId,
        userRole: user.role
      });

      let query = supabase
        .from('indicadores_empresa')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      // Para mentores: ver todos os indicadores se empresaId não especificada
      // Para alunos/dependentes: filtrar por empresa sempre
      if (user.role !== 'mentor' || empresaId) {
        if (empresaId) {
          query = query.eq('empresa_id', empresaId);
          console.log('Filtering by empresa_id:', empresaId);
        } else if (user.role !== 'mentor') {
          // Para não-mentores sem empresa específica, não retornar nada
          console.log('Non-mentor user without empresa_id, returning empty');
          return [];
        }
      } else {
        console.log('Mentor without empresa filter - fetching all indicators');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching indicadores proprios:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} indicadores proprios`);
      return data || [];
    },
    enabled: !!user?.id
  });

  // Mutation para criar indicador próprio
  const criarIndicador = useMutation({
    mutationFn: async (indicador: NovoIndicadorEmpresa) => {
      console.log('Creating indicador with data:', indicador);
      
      const { data, error } = await supabase
        .from('indicadores_empresa')
        .insert({
          ...indicador,
          usuario_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating indicador:', error);
        throw error;
      }
      
      console.log('Created indicador:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-proprios'] });
      toast({
        title: "Indicador criado",
        description: "Seu indicador próprio foi criado com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erro ao criar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar indicador próprio
  const atualizarIndicador = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<IndicadorEmpresa> & { id: string }) => {
      console.log('Updating indicador:', id, updates);
      
      const { data, error } = await supabase
        .from('indicadores_empresa')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating indicador:', error);
        throw error;
      }
      
      console.log('Updated indicador:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-proprios'] });
      queryClient.invalidateQueries({ queryKey: ['cards-estrategicos'] });
      toast({
        title: "Indicador atualizado",
        description: "Seu indicador foi atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Erro ao atualizar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para excluir indicador próprio
  const excluirIndicador = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting indicador:', id);
      
      const { error } = await supabase
        .from('indicadores_empresa')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting indicador:', error);
        throw error;
      }
      
      console.log('Successfully deleted indicador:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores-proprios'] });
      queryClient.invalidateQueries({ queryKey: ['cards-estrategicos'] });
      toast({
        title: "Indicador excluído",
        description: "Seu indicador foi excluído com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Erro ao excluir indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    indicadoresProprios,
    criarIndicador: criarIndicador.mutate,
    atualizarIndicador: atualizarIndicador.mutate,
    excluirIndicador: excluirIndicador.mutate,
    isLoading: indicadoresProprios.isLoading,
    isCreating: criarIndicador.isPending,
    isUpdating: atualizarIndicador.isPending,
    isDeleting: excluirIndicador.isPending
  };
}
