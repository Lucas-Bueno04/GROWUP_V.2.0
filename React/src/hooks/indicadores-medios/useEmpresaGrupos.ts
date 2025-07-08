
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EmpresaGrupo } from '@/types/indicadores-medios.types';

export function useEmpresaGrupos(empresaId?: string) {
  return useQuery({
    queryKey: ['empresa-grupos', empresaId],
    queryFn: async (): Promise<EmpresaGrupo[]> => {
      if (!empresaId) {
        return [];
      }

      console.log('Buscando grupos da empresa:', empresaId);
      
      const { data, error } = await supabase
        .from('empresa_grupos')
        .select('*')
        .eq('empresa_id', empresaId);

      if (error) {
        console.error('Erro ao buscar grupos da empresa:', error);
        throw error;
      }

      console.log('Grupos encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!empresaId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
