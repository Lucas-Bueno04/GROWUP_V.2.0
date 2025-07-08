
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface IndicadorCalculado {
  codigo: string;
  nome: string;
  valor: number;
  unidade: string;
  melhorQuando: 'maior' | 'menor';
  mediaGeral?: number;
  mediaGrupo?: number;
  performanceVsGeral: number;
  performanceVsGrupo: number;
}

export function useIndicadoresRealtimeEmpresa(
  empresaId?: string, 
  ano: number = new Date().getFullYear(),
  mes: number = new Date().getMonth() + 1
) {
  return useQuery({
    queryKey: ['indicadores-realtime-empresa', empresaId, ano, mes],
    queryFn: async (): Promise<IndicadorCalculado[]> => {
      console.log('=== CALCULANDO INDICADORES REALTIME EMPRESA ===');
      console.log('Empresa ID:', empresaId);
      console.log('Ano:', ano);
      console.log('Mês:', mes);

      if (!empresaId) {
        return [];
      }

      try {
        // Buscar grupos da empresa para comparações
        const { data: gruposEmpresa } = await supabase
          .from('empresa_grupos')
          .select('grupo_tipo, grupo_valor')
          .eq('empresa_id', empresaId);

        // Buscar indicadores do plano de contas
        const { data: indicadores } = await supabase
          .from('orcamento_indicadores')
          .select('codigo, nome, formula, unidade, melhor_quando')
          .order('ordem');

        if (!indicadores || indicadores.length === 0) {
          console.log('Nenhum indicador encontrado');
          return [];
        }

        // Buscar médias comparativas para o ano
        const { data: mediasGerais } = await supabase
          .from('indicadores_medios')
          .select(`
            indicador_codigo,
            media_geral,
            grupos:indicadores_medios_grupos(
              grupo_tipo,
              grupo_valor,
              media_grupo
            )
          `)
          .eq('ano', ano);

        const indicadoresCalculados: IndicadorCalculado[] = [];

        // Processar primeiros 8 indicadores para performance
        const indicadoresParaProcessar = indicadores.slice(0, 8);

        for (const indicador of indicadoresParaProcessar) {
          try {
            // Usar a função do banco para calcular o valor do indicador
            const { data: valorCalculado, error } = await supabase
              .rpc('calcular_indicador_empresa', {
                p_empresa_id: empresaId,
                p_indicador_codigo: indicador.codigo,
                p_formula: indicador.formula,
                p_ano: ano,
                p_mes_ate: mes
              });

            if (error) {
              console.error(`Erro ao calcular indicador ${indicador.codigo}:`, error);
              continue;
            }

            const valor = valorCalculado || 0;

            // Buscar médias comparativas
            const mediaGeral = mediasGerais?.find(m => m.indicador_codigo === indicador.codigo);
            let mediaGrupo: number | undefined;

            // Encontrar média do grupo da empresa
            if (mediaGeral?.grupos && gruposEmpresa) {
              for (const grupo of gruposEmpresa) {
                const grupoMedia = mediaGeral.grupos.find(g => 
                  g.grupo_tipo === grupo.grupo_tipo && 
                  g.grupo_valor === grupo.grupo_valor
                );
                if (grupoMedia) {
                  mediaGrupo = grupoMedia.media_grupo;
                  break;
                }
              }
            }

            // Calcular performance
            const performanceVsGeral = mediaGeral?.media_geral ? 
              ((valor - mediaGeral.media_geral) / mediaGeral.media_geral) * 100 : 0;
            
            const performanceVsGrupo = mediaGrupo ? 
              ((valor - mediaGrupo) / mediaGrupo) * 100 : 0;

            indicadoresCalculados.push({
              codigo: indicador.codigo,
              nome: indicador.nome,
              valor,
              unidade: indicador.unidade || '%',
              melhorQuando: (indicador.melhor_quando as 'maior' | 'menor') || 'maior',
              mediaGeral: mediaGeral?.media_geral,
              mediaGrupo,
              performanceVsGeral,
              performanceVsGrupo
            });

            console.log(`Indicador ${indicador.codigo} calculado:`, {
              valor,
              mediaGeral: mediaGeral?.media_geral,
              mediaGrupo,
              performanceVsGeral,
              performanceVsGrupo
            });

          } catch (error) {
            console.error(`Erro ao processar indicador ${indicador.codigo}:`, error);
          }
        }

        console.log(`Total de indicadores calculados: ${indicadoresCalculados.length}`);
        return indicadoresCalculados;

      } catch (error) {
        console.error('Erro ao calcular indicadores da empresa:', error);
        return [];
      }
    },
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false
  });
}
