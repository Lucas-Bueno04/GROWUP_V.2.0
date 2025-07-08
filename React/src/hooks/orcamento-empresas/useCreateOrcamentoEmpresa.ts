
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/auth';

export function useCreateOrcamentoEmpresa() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      nome: string;
      descricao?: string;
      ano: number;
      empresa_id: string;
      permite_edicao_aluno?: boolean;
      data_limite_edicao?: string;
    }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data: orcamento, error } = await supabase
        .from('orcamento_empresas')
        .insert([{
          ...data,
          mentor_responsavel: user.id,
          criado_por: user.id,
          status: 'ativo',
          permite_edicao_aluno: data.permite_edicao_aluno ?? true
        }])
        .select()
        .single();

      if (error) throw error;
      return orcamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamento-empresas'] });
    }
  });
}
