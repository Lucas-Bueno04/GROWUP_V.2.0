
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { 
  MetaIndicadorCompleta, 
  IndicadorEmpresa, 
  MetaIndicadorEmpresaCompleta 
} from './types';

export function useMetasIndicadoresQuery(empresaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['metas-indicadores', user?.id, empresaId],
    queryFn: async (): Promise<MetaIndicadorCompleta[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty array for metas-indicadores');
        return [];
      }

      console.log('Fetching metas-indicadores for user:', user.id, 'empresa:', empresaId);

      try {
        let query = supabase
          .from('metas_indicadores')
          .select(`
            *,
            orcamento_indicadores!inner(
              codigo,
              nome,
              unidade,
              melhor_quando
            ),
            empresas!inner(
              id,
              nome
            )
          `)
          .order('ano', { ascending: false })
          .order('mes', { ascending: true });

        // Filtrar por empresa APENAS na tabela metas_indicadores
        if (empresaId) {
          query = query.eq('empresa_id', empresaId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching metas indicadores:', error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} metas indicadores`);
        
        // Transformar dados para o formato esperado
        const transformedData = data?.map(meta => ({
          ...meta,
          indicador: {
            codigo: meta.orcamento_indicadores?.codigo || '',
            nome: meta.orcamento_indicadores?.nome || '',
            unidade: meta.orcamento_indicadores?.unidade,
            melhor_quando: meta.orcamento_indicadores?.melhor_quando
          },
          empresa: {
            id: meta.empresas?.id || '',
            nome: meta.empresas?.nome || ''
          },
          conta_orcamento: meta.conta_orcamento_id ? {
            codigo: 'N/A',
            nome: 'N/A'
          } : undefined
        })) || [];

        console.log('Transformed metas indicadores:', transformedData);
        return transformedData;
      } catch (error) {
        console.error('Query failed for metas-indicadores:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useIndicadoresEmpresaQuery(empresaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['indicadores-empresa', user?.id, empresaId],
    queryFn: async (): Promise<IndicadorEmpresa[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty array for indicadores-empresa');
        return [];
      }

      console.log('Fetching indicadores-empresa for user:', user.id, 'empresa:', empresaId);

      try {
        let query = supabase
          .from('indicadores_empresa')
          .select('*')
          .eq('ativo', true)
          .order('ordem');

        // Filtrar por empresa se especificado
        if (empresaId) {
          query = query.eq('empresa_id', empresaId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching indicadores empresa:', error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} indicadores empresa`);
        return data || [];
      } catch (error) {
        console.error('Query failed for indicadores-empresa:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useMetasIndicadoresEmpresaQuery(empresaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['metas-indicadores-empresa', user?.id, empresaId],
    queryFn: async (): Promise<MetaIndicadorEmpresaCompleta[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty array for metas-indicadores-empresa');
        return [];
      }

      console.log('Fetching metas-indicadores-empresa for user:', user.id, 'empresa:', empresaId);

      try {
        let query = supabase
          .from('metas_indicadores_empresa')
          .select(`
            *,
            indicadores_empresa!inner(*)
          `)
          .order('ano', { ascending: false })
          .order('mes', { ascending: true });

        // Filtrar por empresa se especificado
        if (empresaId) {
          query = query.eq('empresa_id', empresaId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching metas indicadores empresa:', error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} metas indicadores empresa`);
        
        // Transformar dados para o formato esperado
        const transformedData = data?.map(meta => ({
          ...meta,
          indicador_empresa: meta.indicadores_empresa,
          conta_orcamento: meta.conta_orcamento_id ? {
            codigo: 'N/A',
            nome: 'N/A'
          } : undefined
        })) || [];

        return transformedData;
      } catch (error) {
        console.error('Query failed for metas-indicadores-empresa:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
