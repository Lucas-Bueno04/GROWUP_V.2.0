
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useRecalcularMediasIndicadores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ano: number = new Date().getFullYear()) => {
      console.log('=== RECALCULANDO MÉDIAS DE INDICADORES ===');
      console.log('Ano:', ano);

      const { error } = await supabase.rpc('recalcular_medias_indicadores', {
        p_ano: ano
      });

      if (error) {
        console.error('Erro ao recalcular médias:', error);
        throw error;
      }

      console.log('Médias recalculadas com sucesso');
    },
    onSuccess: () => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries({ 
        queryKey: ['indicadores-realtime-empresa'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['dashboard-financeiro-realtime'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['ai-insights'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['medias-comparativas'] 
      });

      toast.success('Médias de indicadores recalculadas com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao recalcular médias:', error);
      toast.error('Erro ao recalcular médias de indicadores');
    }
  });
}
