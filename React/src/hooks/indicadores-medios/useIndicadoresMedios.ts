
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { IndicadorMedio, IndicadorMedioCompleto } from '@/types/indicadores-medios.types';

export function useIndicadoresMedios(ano: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['indicadores-medios', ano],
    queryFn: async (): Promise<IndicadorMedioCompleto[]> => {
      console.log('Buscando indicadores médios para o ano:', ano);
      
      // Buscar indicadores médios
      const { data: indicadores, error: indicadoresError } = await supabase
        .from('indicadores_medios')
        .select(`
          *,
          grupos:indicadores_medios_grupos(*)
        `)
        .eq('ano', ano)
        .order('indicador_codigo');

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores médios:', indicadoresError);
        throw indicadoresError;
      }

      console.log('Indicadores médios encontrados:', indicadores?.length || 0);
      return indicadores || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
