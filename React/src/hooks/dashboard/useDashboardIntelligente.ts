
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface IndicadorCalculado {
  codigo: string;
  nome: string;
  valorEmpresa: number;
  valorGrupo: number;
  valorGeral: number;
  unidade: string;
  melhorQuando: 'maior' | 'menor';
}

interface DadosGrupoEmpresa {
  grupoTipo: string;
  grupoValor: string;
  empresaId: string;
}

export function useDashboardIntelligente(empresaId?: string, ano: number = 2025) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-inteligente', user?.id, empresaId, ano],
    queryFn: async (): Promise<{
      indicadores: IndicadorCalculado[];
      dadosGrupo: DadosGrupoEmpresa | null;
      insights: any[];
    }> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('=== DASHBOARD INTELIGENTE QUERY ===');
      console.log('Fetching for:', { userId: user.id, empresaId, ano });

      // 1. Buscar dados do grupo da empresa
      let dadosGrupo: DadosGrupoEmpresa | null = null;
      if (empresaId) {
        const { data: grupoData, error: grupoError } = await supabase
          .from('empresa_grupos')
          .select('grupo_tipo, grupo_valor, empresa_id')
          .eq('empresa_id', empresaId)
          .eq('grupo_tipo', 'faturamento')
          .single();

        if (!grupoError && grupoData) {
          dadosGrupo = {
            grupoTipo: grupoData.grupo_tipo,
            grupoValor: grupoData.grupo_valor,
            empresaId: grupoData.empresa_id
          };
        }
      }

      // 2. Buscar indicadores do plano de contas
      const { data: indicadoresPlano, error: indicadoresError } = await supabase
        .from('orcamento_indicadores')
        .select('*')
        .order('ordem');

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores:', indicadoresError);
        throw indicadoresError;
      }

      // 3. Calcular valores para cada indicador
      const indicadoresCalculados: IndicadorCalculado[] = [];
      
      for (const indicador of indicadoresPlano || []) {
        try {
          // Simular cálculo do indicador para a empresa
          const valorEmpresa = Math.random() * 100; // Placeholder
          
          // Calcular média do grupo
          let valorGrupo = Math.random() * 100; // Placeholder
          
          // Calcular média geral
          const valorGeral = Math.random() * 100; // Placeholder

          indicadoresCalculados.push({
            codigo: indicador.codigo,
            nome: indicador.nome,
            valorEmpresa,
            valorGrupo,
            valorGeral,
            unidade: indicador.unidade || '%',
            melhorQuando: indicador.melhor_quando === 'maior' ? 'maior' : 'menor'
          });
        } catch (error) {
          console.error(`Erro ao calcular indicador ${indicador.codigo}:`, error);
        }
      }

      // 4. Gerar insights baseados nos dados
      const insights = generateInsights(indicadoresCalculados);

      console.log('Dashboard inteligente calculado:', {
        indicadores: indicadoresCalculados.length,
        dadosGrupo,
        insights: insights.length
      });

      return {
        indicadores: indicadoresCalculados,
        dadosGrupo,
        insights
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
}

function generateInsights(indicadores: IndicadorCalculado[]) {
  const insights = [];

  // Analisar indicadores abaixo da média do grupo
  const abaixoDoGrupo = indicadores.filter(ind => {
    if (ind.melhorQuando === 'maior') {
      return ind.valorEmpresa < ind.valorGrupo;
    } else {
      return ind.valorEmpresa > ind.valorGrupo;
    }
  });

  if (abaixoDoGrupo.length > 0) {
    insights.push({
      tipo: 'alerta',
      titulo: `${abaixoDoGrupo.length} indicador(es) abaixo da média do grupo`,
      descricao: `Os indicadores ${abaixoDoGrupo.map(i => i.nome).join(', ')} estão performando abaixo da média do seu grupo.`,
      prioridade: 'alta'
    });
  }

  // Analisar indicadores acima da média geral
  const acimaGeral = indicadores.filter(ind => {
    if (ind.melhorQuando === 'maior') {
      return ind.valorEmpresa > ind.valorGeral;
    } else {
      return ind.valorEmpresa < ind.valorGeral;
    }
  });

  if (acimaGeral.length > 0) {
    insights.push({
      tipo: 'oportunidade',
      titulo: `Performance superior em ${acimaGeral.length} indicador(es)`,
      descricao: `Excelente performance nos indicadores: ${acimaGeral.map(i => i.nome).join(', ')}.`,
      prioridade: 'media'
    });
  }

  return insights;
}
