
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useOrcamentoValoresCalculados } from './useOrcamentoValoresCalculados';

export function useOrcamentoValores(itemId?: string, ano?: number, itemType: 'conta' | 'grupo' = 'conta') {
  // Para grupos, usar o hook específico de valores calculados
  const calculatedValues = useOrcamentoValoresCalculados(
    itemType === 'grupo' ? itemId : undefined, 
    ano
  );

  const directValues = useQuery({
    queryKey: ['orcamento-valores', itemId, ano, itemType],
    queryFn: async () => {
      if (!itemId || !ano) {
        console.log('useOrcamentoValores: Missing itemId or ano, returning empty array');
        return [];
      }

      console.log('Fetching orcamento valores for:', { itemId, ano, itemType });

      if (itemType === 'conta') {
        try {
          const { data, error } = await supabase
            .from('orcamento_empresa_valores')
            .select(`
              mes,
              valor_orcado,
              orcamento_empresa_id,
              orcamento_empresas!inner(ano)
            `)
            .eq('conta_id', itemId)
            .eq('orcamento_empresas.ano', ano)
            .limit(50);

          if (error) {
            console.error('Error fetching orcamento valores:', error);
            throw error;
          }

          console.log('Fetched orcamento valores:', data?.length || 0);
          return data || [];
        } catch (error) {
          console.error('Exception in useOrcamentoValores:', error);
          return [];
        }
      } else {
        // Para grupos, verificar se é calculado primeiro
        const { data: grupo } = await supabase
          .from('orcamento_grupos')
          .select('tipo_calculo, formula')
          .eq('id', itemId)
          .single();

        if (grupo?.tipo_calculo === 'calculado') {
          // Deixar o hook de valores calculados lidar com isso
          return [];
        } else {
          // Para grupos de soma, retornar vazio para evitar dependências circulares
          console.log('Sum group requested, returning empty array to avoid circular dependencies');
          return [];
        }
      }
    },
    enabled: !!itemId && !!ano && itemType === 'conta',
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Retornar os dados apropriados baseado no tipo
  if (itemType === 'grupo') {
    return calculatedValues;
  } else {
    return directValues;
  }
}
