
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useClassificationImage(classification: string | undefined) {
  return useQuery({
    queryKey: ['classification-image', classification],
    queryFn: async () => {
      if (!classification) return null;
      
      const { data, error } = await supabase
        .from('faixas_faturamento')
        .select('imagem_url')
        .eq('nome', classification)
        .eq('ativa', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching classification image:', error);
        return null;
      }
      
      return data?.imagem_url || null;
    },
    enabled: !!classification,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useNextLevelInfo(classification: string | undefined) {
  return useQuery({
    queryKey: ['next-level-info', classification],
    queryFn: async () => {
      if (!classification) return null;

      const { data: faixas, error } = await supabase
        .from('faixas_faturamento')
        .select('*')
        .eq('ativa', true)
        .order('ordem');

      if (error) {
        console.error('Error fetching revenue ranges:', error);
        return null;
      }

      // Find current faixa and determine next level
      const currentFaixaIndex = faixas.findIndex(faixa => {
        const faixaName = faixa.nome.includes('(') ? faixa.nome.split('(')[0].trim() : faixa.nome;
        return faixaName === classification;
      });

      if (currentFaixaIndex >= 0 && currentFaixaIndex < faixas.length - 1) {
        const nextFaixa = faixas[currentFaixaIndex + 1];
        return {
          nextLevel: nextFaixa.nome.includes('(') ? nextFaixa.nome.split('(')[0].trim() : nextFaixa.nome,
          nextThreshold: nextFaixa.valor_minimo
        };
      }

      return { nextLevel: null, nextThreshold: null };
    },
    enabled: !!classification,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
