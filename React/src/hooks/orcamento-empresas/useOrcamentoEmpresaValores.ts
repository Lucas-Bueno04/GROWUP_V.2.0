
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { OrcamentoEmpresaValor } from './types';

interface OrcamentoEmpresaValorWithConta extends OrcamentoEmpresaValor {
  conta?: {
    id: string;
    codigo: string;
    nome: string;
  };
}

export function useOrcamentoEmpresaValores(orcamentoEmpresaId?: string) {
  return useQuery({
    queryKey: ['orcamento-empresa-valores', orcamentoEmpresaId],
    queryFn: async () => {
      if (!orcamentoEmpresaId) throw new Error('ID do orçamento empresa não fornecido');

      console.log('useOrcamentoEmpresaValores: Fetching valores for:', orcamentoEmpresaId);

      // Fetch values with account information using joins
      const { data, error } = await supabase
        .from('orcamento_empresa_valores')
        .select(`
          *,
          conta:orcamento_contas(
            id,
            codigo,
            nome
          )
        `)
        .eq('orcamento_empresa_id', orcamentoEmpresaId)
        .order('mes', { ascending: true });

      if (error) {
        console.error('useOrcamentoEmpresaValores: Error:', error);
        throw error;
      }

      console.log('useOrcamentoEmpresaValores: Fetched valores:', data?.length || 0);
      return data as OrcamentoEmpresaValorWithConta[];
    },
    enabled: !!orcamentoEmpresaId
  });
}
