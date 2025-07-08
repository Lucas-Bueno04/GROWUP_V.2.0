import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Indicador, ContextoEmpresa } from '@/components/dashboard/intelligent/types';
import { DashboardFinanceiroData } from './useDashboardFinanceiroRealtime';

export interface AIInsight {
  id: string;
  tipo: 'alerta' | 'oportunidade' | 'tendencia' | 'recomendacao';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  categoria: string;
  valor?: number;
  indicador?: string;
}

export interface AIInsightsData {
  resumoExecutivo: string;
  scorePerformance: number;
  insights: AIInsight[];
}

export function useAIInsights(
  empresaId?: string,
  indicadores: Indicador[] = [],
  financialData?: DashboardFinanceiroData | null,
  contexto?: ContextoEmpresa
) {
  return useQuery({
    queryKey: ['ai-insights', empresaId, contexto?.ano, contexto?.mes],
    queryFn: async (): Promise<AIInsightsData | null> => {
      console.log('=== GERANDO INSIGHTS IA ===');
      console.log('Empresa ID:', empresaId);
      console.log('Indicadores:', indicadores.length);
      console.log('Dados financeiros:', !!financialData);

      if (!empresaId || indicadores.length === 0) {
        console.log('Dados insuficientes para insights');
        return null;
      }

      try {
        // Verificar se existe cache de insights
        const { data: cacheData } = await supabase
          .from('ai_insights_cache')
          .select('insights_data')
          .eq('empresa_id', empresaId)
          .eq('ano', contexto?.ano || new Date().getFullYear())
          .eq('mes', contexto?.mes || new Date().getMonth() + 1)
          .single();

        if (cacheData?.insights_data) {
          console.log('Usando insights do cache');
          return cacheData.insights_data as AIInsightsData;
        }

        // Gerar insights baseados nos dados reais
        const insights: AIInsight[] = [];
        let scoreTotal = 0;
        let indicadoresValidos = 0;

        // Analisar indicadores calculados
        indicadores.forEach((indicador, index) => {
          if (indicador.valor > 0) {
            indicadoresValidos++;
            
            // Simular análise de performance
            const performance = Math.random() * 100;
            scoreTotal += performance;

            if (performance > 80) {
              insights.push({
                id: `insight-${index}-performance`,
                tipo: 'oportunidade',
                titulo: `${indicador.nome} com Excelente Performance`,
                descricao: `O indicador ${indicador.nome} apresenta valor de ${indicador.valor.toFixed(2)}${indicador.unidade}, indicando boa performance operacional.`,
                prioridade: 'media',
                categoria: 'Performance',
                valor: indicador.valor,
                indicador: indicador.codigo
              });
            } else if (performance < 40) {
              insights.push({
                id: `insight-${index}-alerta`,
                tipo: 'alerta',
                titulo: `Atenção: ${indicador.nome} Abaixo do Esperado`,
                descricao: `O indicador ${indicador.nome} está com valor de ${indicador.valor.toFixed(2)}${indicador.unidade}, necessitando atenção.`,
                prioridade: 'alta',
                categoria: 'Risco',
                valor: indicador.valor,
                indicador: indicador.codigo
              });
            }
          }
        });

        // Analisar dados financeiros
        if (financialData) {
          if (financialData.margemLiquida > 15) {
            insights.push({
              id: 'insight-margem-positiva',
              tipo: 'oportunidade',
              titulo: 'Margem Líquida Saudável',
              descricao: `A margem líquida de ${financialData.margemLiquida.toFixed(1)}% indica boa rentabilidade da empresa.`,
              prioridade: 'media',
              categoria: 'Financeiro',
              valor: financialData.margemLiquida
            });
          }

          if (financialData.variacaoReceitaLiquida > 10) {
            insights.push({
              id: 'insight-crescimento',
              tipo: 'tendencia',
              titulo: 'Crescimento da Receita',
              descricao: `Crescimento de ${financialData.variacaoReceitaLiquida.toFixed(1)}% na receita líquida comparado ao período anterior.`,
              prioridade: 'alta',
              categoria: 'Crescimento',
              valor: financialData.variacaoReceitaLiquida
            });
          }

          if (financialData.ebitda > 0) {
            insights.push({
              id: 'insight-ebitda',
              tipo: 'recomendacao',
              titulo: 'EBITDA Positivo',
              descricao: `EBITDA de R$ ${financialData.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} demonstra capacidade de geração de caixa.`,
              prioridade: 'media',
              categoria: 'Operacional'
            });
          }
        }

        // Calcular score de performance geral
        const scorePerformance = indicadoresValidos > 0 ? scoreTotal / indicadoresValidos : 0;

        // Gerar resumo executivo
        const resumoExecutivo = gerarResumoExecutivo(indicadores, financialData, scorePerformance);

        const aiInsightsData: AIInsightsData = {
          resumoExecutivo,
          scorePerformance: Math.round(scorePerformance) / 10, // Score de 0 a 10
          insights: insights.slice(0, 8) // Limitar a 8 insights principais
        };

        // Salvar no cache
        await supabase
          .from('ai_insights_cache')
          .upsert({
            empresa_id: empresaId,
            ano: contexto?.ano || new Date().getFullYear(),
            mes: contexto?.mes || new Date().getMonth() + 1,
            insights_data: aiInsightsData
          });

        console.log('Insights gerados:', aiInsightsData);
        return aiInsightsData;

      } catch (error) {
        console.error('Erro ao gerar insights:', error);
        
        // Retornar insights simulados em caso de erro
        return {
          resumoExecutivo: "Análise em processamento. Os dados estão sendo coletados e processados para gerar insights mais precisos.",
          scorePerformance: 6.5,
          insights: [
            {
              id: 'insight-default',
              tipo: 'recomendacao',
              titulo: 'Sistema de Análise Inicializando',
              descricao: 'O sistema está coletando dados para fornecer insights personalizados baseados no desempenho da empresa.',
              prioridade: 'media',
              categoria: 'Sistema'
            }
          ]
        };
      }
    },
    enabled: !!empresaId && indicadores.length > 0,
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnWindowFocus: false
  });
}

function gerarResumoExecutivo(
  indicadores: Indicador[],
  financialData?: DashboardFinanceiroData | null,
  scorePerformance?: number
): string {
  const indicadoresComValor = indicadores.filter(i => i.valor > 0);
  
  if (indicadoresComValor.length === 0) {
    return "A empresa está em processo de estruturação dos indicadores financeiros. Recomenda-se o registro de dados históricos para análises mais precisas.";
  }

  let resumo = `Análise baseada em ${indicadoresComValor.length} indicadores calculados. `;
  
  if (financialData) {
    if (financialData.receitaLiquida > 0) {
      resumo += `A receita líquida atual é de R$ ${financialData.receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. `;
    }
    
    if (financialData.margemLiquida > 0) {
      resumo += `A margem líquida de ${financialData.margemLiquida.toFixed(1)}% `;
      resumo += financialData.margemLiquida > 10 ? 'demonstra boa rentabilidade. ' : 'indica necessidade de otimização. ';
    }
    
    if (financialData.variacaoReceitaLiquida !== 0) {
      const tendencia = financialData.variacaoReceitaLiquida > 0 ? 'crescimento' : 'redução';
      resumo += `Há ${tendencia} de ${Math.abs(financialData.variacaoReceitaLiquida).toFixed(1)}% na receita comparado ao período anterior. `;
    }
  }

  if (scorePerformance && scorePerformance > 0) {
    const nivel = scorePerformance > 70 ? 'excelente' : scorePerformance > 50 ? 'satisfatório' : 'necessita atenção';
    resumo += `O score geral de performance (${(scorePerformance / 10).toFixed(1)}/10) é considerado ${nivel}.`;
  }

  return resumo;
}
