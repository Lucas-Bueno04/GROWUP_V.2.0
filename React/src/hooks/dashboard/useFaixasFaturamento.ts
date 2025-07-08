
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface FaixaFaturamento {
  id: string;
  nome: string;
  valor_minimo: number;
  valor_maximo: number;
  ativa: boolean;
  ordem: number;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useFaixasFaturamento() {
  const queryClient = useQueryClient();

  const { data: faixas, isLoading, error } = useQuery({
    queryKey: ['faixas-faturamento'],
    queryFn: async (): Promise<FaixaFaturamento[]> => {
      console.log('🎯 Fetching revenue ranges from database...');
      
      const { data, error } = await supabase
        .from('faixas_faturamento')
        .select('*')
        .order('ordem');

      if (error) {
        console.error('❌ Error fetching revenue ranges:', error);
        throw error;
      }

      console.log('✅ Revenue ranges fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateFaixaMutation = useMutation({
    mutationFn: async (faixa: Partial<FaixaFaturamento> & { id: string }) => {
      const { data, error } = await supabase
        .from('faixas_faturamento')
        .update({
          nome: faixa.nome,
          valor_minimo: faixa.valor_minimo,
          valor_maximo: faixa.valor_maximo,
          ativa: faixa.ativa,
          ordem: faixa.ordem,
          imagem_url: faixa.imagem_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', faixa.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faixas-faturamento'] });
      toast({
        title: "Faixa atualizada",
        description: "A faixa de faturamento foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a faixa.",
        variant: "destructive",
      });
    },
  });

  const createFaixaMutation = useMutation({
    mutationFn: async (faixa: Omit<FaixaFaturamento, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('faixas_faturamento')
        .insert([{
          ...faixa,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faixas-faturamento'] });
      toast({
        title: "Faixa criada",
        description: "A nova faixa de faturamento foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar",
        description: error.message || "Não foi possível criar a faixa.",
        variant: "destructive",
      });
    },
  });

  const deleteFaixaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faixas_faturamento')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faixas-faturamento'] });
      toast({
        title: "Faixa removida",
        description: "A faixa de faturamento foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover a faixa.",
        variant: "destructive",
      });
    },
  });

  return {
    faixas: faixas || [],
    isLoading,
    error,
    updateFaixa: updateFaixaMutation.mutate,
    createFaixa: createFaixaMutation.mutate,
    deleteFaixa: deleteFaixaMutation.mutate,
    isUpdating: updateFaixaMutation.isPending,
    isCreating: createFaixaMutation.isPending,
    isDeleting: deleteFaixaMutation.isPending
  };
}
