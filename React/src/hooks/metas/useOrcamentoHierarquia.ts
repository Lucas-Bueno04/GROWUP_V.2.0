
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';

export interface OrcamentoGrupoHierarquico extends OrcamentoGrupo {
  contas: OrcamentoConta[];
}

export function useOrcamentoHierarquia() {
  return useQuery({
    queryKey: ['orcamento-hierarquia'],
    queryFn: async (): Promise<OrcamentoGrupoHierarquico[]> => {
      // Fetch groups
      const { data: grupos, error: gruposError } = await supabase
        .from('orcamento_grupos')
        .select('*')
        .order('ordem');

      if (gruposError) throw gruposError;

      // Fetch accounts
      const { data: contas, error: contasError } = await supabase
        .from('orcamento_contas')
        .select('*')
        .order('ordem');

      if (contasError) throw contasError;

      // Organize accounts under their respective groups
      const gruposHierarquicos: OrcamentoGrupoHierarquico[] = (grupos || []).map(grupo => ({
        ...grupo,
        contas: (contas || []).filter(conta => conta.grupo_id === grupo.id)
      }));

      return gruposHierarquicos;
    },
  });
}
