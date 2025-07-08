
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { evaluateGroupFormula } from '@/hooks/analise-orcamentaria/formulaEvaluator';

export function useOrcamentoValoresCalculados(grupoId?: string, ano?: number) {
  return useQuery({
    queryKey: ['orcamento-valores-calculados', grupoId, ano],
    queryFn: async () => {
      if (!grupoId || !ano) {
        console.log('useOrcamentoValoresCalculados: Missing grupoId or ano, returning empty array');
        return [];
      }

      console.log('Calculating orcamento valores for calculated group:', { grupoId, ano });

      try {
        // Buscar o grupo específico
        const { data: grupo, error: grupoError } = await supabase
          .from('orcamento_grupos')
          .select('*')
          .eq('id', grupoId)
          .single();

        if (grupoError || !grupo) {
          console.error('Error fetching group:', grupoError);
          return [];
        }

        // Se não é calculado, retornar vazio (usar o hook normal)
        if (grupo.tipo_calculo !== 'calculado' || !grupo.formula) {
          return [];
        }

        // Buscar todos os grupos e valores para calcular
        const [gruposResponse, valoresResponse] = await Promise.all([
          supabase.from('orcamento_grupos').select('*').order('ordem'),
          supabase
            .from('orcamento_empresa_valores')
            .select(`
              *,
              conta:orcamento_contas(
                *,
                grupo:orcamento_grupos(*)
              ),
              orcamento_empresa:orcamento_empresas(ano)
            `)
            .eq('orcamento_empresa.ano', ano)
        ]);

        const grupos = gruposResponse.data || [];
        const valores = valoresResponse.data || [];

        // Calcular valores mensais usando a fórmula
        const valoresMensais = [];
        for (let mes = 1; mes <= 12; mes++) {
          try {
            const valorOrcado = evaluateGroupFormula(
              grupo.formula,
              grupos,
              valores,
              'orcado',
              mes
            );

            valoresMensais.push({
              mes,
              valor_orcado: valorOrcado,
              orcamento_empresa_id: null, // Valores calculados não têm ID específico
            });
          } catch (error) {
            console.error(`Error calculating group value for month ${mes}:`, error);
            valoresMensais.push({
              mes,
              valor_orcado: 0,
              orcamento_empresa_id: null,
            });
          }
        }

        console.log('Calculated valores for group:', valoresMensais.length);
        return valoresMensais;
      } catch (error) {
        console.error('Exception in useOrcamentoValoresCalculados:', error);
        return [];
      }
    },
    enabled: !!grupoId && !!ano,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
