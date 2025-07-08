
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrcamentoGrupoValor {
  id: string;
  orcamento_empresa_id: string;
  grupo_id: string;
  mes: number;
  valor_calculado: number;
  valor_orcado: number;
  data_calculo: string;
  created_at: string;
  updated_at: string;
}

export function useOrcamentoGruposValores(
  orcamentoEmpresaId?: string,
  mes?: number
) {
  return useQuery({
    queryKey: ['orcamento-grupos-valores', orcamentoEmpresaId, mes],
    queryFn: async () => {
      if (!orcamentoEmpresaId) return [];

      let query = supabase
        .from('orcamento_empresa_grupos_valores')
        .select('*')
        .eq('orcamento_empresa_id', orcamentoEmpresaId);

      if (mes) {
        query = query.eq('mes', mes);
      }

      const { data, error } = await query.order('mes');

      if (error) {
        console.error('Error fetching grupo valores:', error);
        throw error;
      }

      return data as OrcamentoGrupoValor[];
    },
    enabled: !!orcamentoEmpresaId,
  });
}

export function useRecalcularGruposValores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orcamentoEmpresaId,
      mes
    }: {
      orcamentoEmpresaId: string;
      mes?: number;
    }) => {
      console.log('🔄 Triggering group values recalculation:', { orcamentoEmpresaId, mes });

      const { data, error } = await supabase.rpc('recalcular_grupos_valores', {
        p_orcamento_empresa_id: orcamentoEmpresaId,
        p_mes: mes || null
      });

      if (error) {
        console.error('Error recalculating grupo valores:', error);
        throw error;
      }

      console.log('✅ Group values recalculated successfully. Processed:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['orcamento-grupos-valores', variables.orcamentoEmpresaId]
      });
      queryClient.invalidateQueries({
        queryKey: ['orcamento-empresa-valores', variables.orcamentoEmpresaId]
      });
    }
  });
}

export function useInicializarGruposValoresExistentes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('🔄 Initializing existing grupo valores...');

      const { data, error } = await supabase.rpc('inicializar_grupos_valores_existentes');

      if (error) {
        console.error('Error initializing existing grupo valores:', error);
        throw error;
      }

      console.log('✅ Existing grupo valores initialized. Total:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ['orcamento-grupos-valores']
      });
    }
  });
}
