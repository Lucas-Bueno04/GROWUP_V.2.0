
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface DeleteOrcamentoEmpresaParams {
  orcamentoEmpresaId: string;
}

interface DeleteOrcamentoEmpresaResponse {
  success: boolean;
  error?: string;
  message?: string;
  deleted_values_count?: number;
  orcamento_nome?: string;
}

export function useDeleteOrcamentoEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orcamentoEmpresaId }: DeleteOrcamentoEmpresaParams) => {
      console.log('Executando exclusão do orçamento:', orcamentoEmpresaId);

      const { data, error } = await supabase.rpc(
        'delete_orcamento_empresa_complete',
        { p_orcamento_empresa_id: orcamentoEmpresaId }
      );

      if (error) {
        console.error('Erro na função de exclusão:', error);
        throw new Error(`Erro na exclusão: ${error.message}`);
      }

      const result = data as DeleteOrcamentoEmpresaResponse;
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido na exclusão');
      }

      return result;
    },
    onSuccess: (data) => {
      console.log('Orçamento excluído com sucesso:', data);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['orcamento-empresas-mentor'] });
      queryClient.invalidateQueries({ queryKey: ['orcamento-empresas-usuario'] });
      
      toast({
        title: "Orçamento excluído",
        description: `${data.orcamento_nome} foi excluído permanentemente junto com ${data.deleted_values_count} valores.`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Erro na exclusão do orçamento:', error);
      toast({
        title: "Erro na exclusão",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
