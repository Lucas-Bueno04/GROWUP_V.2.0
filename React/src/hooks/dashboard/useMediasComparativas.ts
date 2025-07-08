
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { IndicadorMedioCompleto, MediasComparativas } from '@/types/indicadores-medios.types';

export function useMediasComparativas(indicadorCodigo?: string, ano: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['medias-comparativas', indicadorCodigo, ano],
    queryFn: async (): Promise<IndicadorMedioCompleto[]> => {
      console.log('=== BUSCANDO MÉDIAS COMPARATIVAS ===');
      console.log('Indicador:', indicadorCodigo);
      console.log('Ano:', ano);

      let query = supabase
        .from('indicadores_medios')
        .select(`
          *,
          grupos:indicadores_medios_grupos(*)
        `)
        .eq('ano', ano)
        .order('indicador_codigo');

      if (indicadorCodigo) {
        query = query.eq('indicador_codigo', indicadorCodigo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar médias comparativas:', error);
        throw error;
      }

      console.log('Médias encontradas:', data?.length || 0);
      return data || [];
    },
    enabled: !!ano,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 1
  });
}

export function useMediasComparativasEmpresa(
  empresaId?: string, 
  indicadorCodigo?: string, 
  ano: number = new Date().getFullYear()
) {
  return useQuery({
    queryKey: ['medias-comparativas-empresa', empresaId, indicadorCodigo, ano],
    queryFn: async (): Promise<MediasComparativas | null> => {
      if (!empresaId || !indicadorCodigo) {
        return null;
      }

      console.log('=== CALCULANDO MÉDIAS PARA EMPRESA ===');
      console.log('Empresa:', empresaId);
      console.log('Indicador:', indicadorCodigo);

      // Buscar grupos da empresa
      const { data: gruposEmpresa, error: gruposError } = await supabase
        .from('empresa_grupos')
        .select('grupo_tipo, grupo_valor')
        .eq('empresa_id', empresaId);

      if (gruposError) {
        console.error('Erro ao buscar grupos da empresa:', gruposError);
        throw gruposError;
      }

      // Buscar médias do indicador
      const { data: mediasData, error: mediasError } = await supabase
        .from('indicadores_medios')
        .select(`
          *,
          grupos:indicadores_medios_grupos(*)
        `)
        .eq('ano', ano)
        .eq('indicador_codigo', indicadorCodigo)
        .single();

      if (mediasError || !mediasData) {
        console.log('Médias não encontradas para o indicador');
        return {
          geral: 0
        };
      }

      const medias: MediasComparativas = {
        geral: mediasData.media_geral
      };

      // Buscar médias específicas dos grupos da empresa
      gruposEmpresa?.forEach(grupo => {
        const grupoMedia = mediasData.grupos?.find(g => 
          g.grupo_tipo === grupo.grupo_tipo && 
          g.grupo_valor === grupo.grupo_valor
        );

        if (grupoMedia) {
          if (grupo.grupo_tipo === 'porte') {
            medias.meuGrupoPorte = grupoMedia.media_grupo;
          } else if (grupo.grupo_tipo === 'setor') {
            medias.meuGrupoSetor = grupoMedia.media_grupo;
          } else if (grupo.grupo_tipo === 'faturamento') {
            medias.meuGrupoFaturamento = grupoMedia.media_grupo;
          }
        }
      });

      console.log('Médias calculadas:', medias);
      return medias;
    },
    enabled: !!empresaId && !!indicadorCodigo && !!ano,
    staleTime: 1000 * 60 * 10
  });
}
