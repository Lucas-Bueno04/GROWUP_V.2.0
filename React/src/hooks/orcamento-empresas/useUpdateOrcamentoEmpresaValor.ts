
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/auth';

export function useUpdateOrcamentoEmpresaValor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      id?: string;
      orcamento_empresa_id: string;
      conta_id: string;
      mes: number;
      valor_orcado?: number;
      valor_realizado?: number;
      observacoes?: string;
    }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      if (data.id) {
        // Atualizar valor existente - não incluir o id no updateData
        const updateData = {
          orcamento_empresa_id: data.orcamento_empresa_id,
          conta_id: data.conta_id,
          mes: data.mes,
          valor_orcado: data.valor_orcado,
          valor_realizado: data.valor_realizado,
          observacoes: data.observacoes,
          editado_por: user.id,
          editado_em: new Date().toISOString()
        };

        const { data: valor, error } = await supabase
          .from('orcamento_empresa_valores')
          .update(updateData)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        return valor;
      } else {
        // Criar novo valor - não incluir o id no insertData
        const insertData = {
          orcamento_empresa_id: data.orcamento_empresa_id,
          conta_id: data.conta_id,
          mes: data.mes,
          valor_orcado: data.valor_orcado,
          valor_realizado: data.valor_realizado,
          observacoes: data.observacoes,
          editado_por: user.id,
          editado_em: new Date().toISOString()
        };

        const { data: valor, error } = await supabase
          .from('orcamento_empresa_valores')
          .insert([insertData])
          .select()
          .single();

        if (error) throw error;
        return valor;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['orcamento-empresa-valores', variables.orcamento_empresa_id] 
      });
    }
  });
}
