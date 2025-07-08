
import { useQuery } from '@tanstack/react-query';
import { useIndicadoresMedios } from './useIndicadoresMedios';
import { useEmpresaGrupos } from './useEmpresaGrupos';
import { useCardsEstrategicos } from '@/hooks/cards-estrategicos';
import { MediasComparativas } from '@/types/indicadores-medios.types';

export function useMediasComparativas(
  indicadorCodigo: string,
  empresaId?: string,
  ano: number = new Date().getFullYear()
) {
  const { data: indicadoresMedios } = useIndicadoresMedios(ano);
  const { data: empresaGrupos } = useEmpresaGrupos(empresaId);
  const { data: indicadoresEmpresa } = useCardsEstrategicos(ano, empresaId);

  return useQuery({
    queryKey: ['medias-comparativas', indicadorCodigo, empresaId, ano],
    queryFn: async (): Promise<MediasComparativas | null> => {
      console.log('Calculando médias comparativas para:', indicadorCodigo);

      // Encontrar indicador médio
      const indicadorMedio = indicadoresMedios?.find(
        ind => ind.indicador_codigo === indicadorCodigo
      );

      if (!indicadorMedio) {
        console.log('Indicador médio não encontrado');
        return null;
      }

      // Encontrar valor da empresa
      const indicadorEmpresa = indicadoresEmpresa?.find(
        ind => ind.codigo === indicadorCodigo
      );

      const medias: MediasComparativas = {
        geral: indicadorMedio.media_geral,
        minhaEmpresa: indicadorEmpresa?.valorAtual
      };

      // Encontrar médias dos grupos da empresa
      if (empresaGrupos && empresaGrupos.length > 0) {
        empresaGrupos.forEach(grupo => {
          const mediaGrupo = indicadorMedio.grupos?.find(
            g => g.grupo_tipo === grupo.grupo_tipo && g.grupo_valor === grupo.grupo_valor
          );

          if (mediaGrupo) {
            switch (grupo.grupo_tipo) {
              case 'porte':
                medias.meuGrupoPorte = mediaGrupo.media_grupo;
                break;
              case 'setor':
                medias.meuGrupoSetor = mediaGrupo.media_grupo;
                break;
              case 'faturamento':
                medias.meuGrupoFaturamento = mediaGrupo.media_grupo;
                break;
            }
          }
        });
      }

      console.log('Médias comparativas calculadas:', medias);
      return medias;
    },
    enabled: !!indicadorCodigo && !!indicadoresMedios,
    staleTime: 5 * 60 * 1000,
  });
}
