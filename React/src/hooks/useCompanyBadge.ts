
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCompanyBadge(empresaId: string | null) {
  return useQuery({
    queryKey: ['company-badge', empresaId],
    queryFn: async () => {
      if (!empresaId) return null;

      // Get classification from empresa_grupos
      const { data: classificacao, error: classificacaoError } = await supabase
        .from('empresa_grupos')
        .select('grupo_valor')
        .eq('empresa_id', empresaId)
        .eq('grupo_tipo', 'faturamento')
        .maybeSingle();

      if (classificacaoError) {
        console.error('Error fetching company classification:', classificacaoError);
        return null;
      }

      // Get current revenue from empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('faturamento_anual_anterior')
        .eq('id', empresaId)
        .maybeSingle();

      if (empresaError) {
        console.error('Error fetching company revenue:', empresaError);
      }

      // Get all active faixas ordered by ordem to determine next level
      const { data: faixas, error: faixasError } = await supabase
        .from('faixas_faturamento')
        .select('*')
        .eq('ativa', true)
        .order('ordem');

      if (faixasError) {
        console.error('Error fetching revenue ranges:', faixasError);
        return null;
      }

      let classification = classificacao?.grupo_valor;
      
      if (classification) {
        // Handle old format like "Newborn (MEI)" -> "Newborn"
        if (classification.includes('(')) {
          classification = classification.split('(')[0].trim();
        }
      }

      const currentRevenue = empresa?.faturamento_anual_anterior || 0;

      // Find current faixa and determine next level
      let nextLevel = null;
      let nextThreshold = null;

      if (faixas && faixas.length > 0) {
        // Find current faixa index
        const currentFaixaIndex = faixas.findIndex(faixa => {
          const faixaName = faixa.nome.includes('(') ? faixa.nome.split('(')[0].trim() : faixa.nome;
          return faixaName === classification;
        });

        // If we found the current faixa and there's a next one
        if (currentFaixaIndex >= 0 && currentFaixaIndex < faixas.length - 1) {
          const nextFaixa = faixas[currentFaixaIndex + 1];
          nextLevel = nextFaixa.nome.includes('(') ? nextFaixa.nome.split('(')[0].trim() : nextFaixa.nome;
          nextThreshold = nextFaixa.valor_minimo;
        }
      }

      return {
        classification: classification || null,
        currentRevenue,
        nextLevel,
        nextThreshold
      };
    },
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
