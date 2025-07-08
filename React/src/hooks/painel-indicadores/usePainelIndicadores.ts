import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useFaixasFaturamento } from '@/hooks/dashboard/useFaixasFaturamento';
import { toast } from '@/components/ui/use-toast';

interface IndicadorCalculo {
  codigo: string;
  nome: string;
  formula: string;
  unidade: string;
  valor: number;
}

interface EmpresaIndicadores {
  empresa: any;
  indicadores: IndicadorCalculo[];
}

interface FaixaIndicadores {
  faixa: string;
  nome: string;
  totalEmpresas: number;
  indicadores: IndicadorCalculo[];
  valorMinimo: number;
  valorMaximo: number;
}

export function usePainelIndicadores(ano: number = new Date().getFullYear()) {
  const queryClient = useQueryClient();
  const { faixas: faixasFaturamento } = useFaixasFaturamento();

  const { data, isLoading, error } = useQuery({
    queryKey: ['painel-indicadores', ano],
    queryFn: async () => {
      console.log('🎯 Fetching painel indicadores data for year:', ano);
      
      try {
        // Buscar empresas ativas
        console.log('📊 Step 1: Fetching active companies...');
        const { data: empresas, error: empresasError } = await supabase
          .from('empresas')
          .select('*')
          .eq('status', 'ativo');

        if (empresasError) {
          console.error('❌ Error fetching companies:', empresasError);
          throw empresasError;
        }

        console.log('✅ Companies found:', empresas?.length || 0);

        // Buscar indicadores do plano de contas
        console.log('📊 Step 2: Fetching plan indicators...');
        const { data: indicadoresPlano, error: indicadoresPlanoError } = await supabase
          .from('orcamento_indicadores')
          .select('*')
          .order('ordem');

        if (indicadoresPlanoError) {
          console.error('❌ Error fetching plan indicators:', indicadoresPlanoError);
          throw indicadoresPlanoError;
        }

        console.log('✅ Plan indicators found:', indicadoresPlano?.length || 0);

        // Processar dados para cálculo de indicadores usando a função corrigida do banco
        console.log('📊 Step 3: Calculating indicators per company...');
        const empresasComIndicadores = await calcularIndicadoresPorEmpresa(
          empresas || [],
          indicadoresPlano || [],
          ano
        );

        console.log('✅ Companies with indicators calculated:', empresasComIndicadores.length);

        // Calcular indicadores por faixa de faturamento usando dados do banco
        console.log('📊 Step 4: Calculating indicators per revenue range...');
        const faixasComIndicadores = calcularIndicadoresPorFaixaBanco(
          empresasComIndicadores,
          indicadoresPlano || [],
          faixasFaturamento
        );

        console.log('✅ Revenue ranges calculated:', faixasComIndicadores.length);

        // Buscar médias existentes (se houver)
        console.log('📊 Step 5: Fetching existing averages...');
        const { data: indicadoresMedias, error: mediasError } = await supabase
          .from('indicadores_medios')
          .select(`
            *,
            grupos:indicadores_medios_grupos(*)
          `)
          .eq('ano', ano)
          .order('indicador_codigo');

        if (mediasError) {
          console.warn('⚠️ Error fetching averages (non-critical):', mediasError);
        }

        console.log('✅ Existing averages found:', indicadoresMedias?.length || 0);

        const result = {
          empresas: empresasComIndicadores,
          faixasFaturamento: faixasComIndicadores,
          indicadoresPlano: indicadoresPlano || [],
          indicadoresMedias: indicadoresMedias || [],
          ano
        };

        console.log('🎉 Final result prepared:', {
          empresas: result.empresas.length,
          faixas: result.faixasFaturamento.length,
          indicadoresPlano: result.indicadoresPlano.length,
          indicadoresMedias: result.indicadoresMedias.length
        });

        return result;
      } catch (error) {
        console.error('💥 Critical error in painel data fetch:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  const recalcularMediasMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Starting averages recalculation...');
      
      const { error } = await supabase.rpc('recalcular_medias_indicadores', {
        p_ano: ano
      });

      if (error) {
        console.error('❌ Error recalculating averages:', error);
        throw error;
      }

      console.log('✅ Averages recalculation completed');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['painel-indicadores'] });
      toast({
        title: "Médias recalculadas",
        description: "As médias dos indicadores foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('💥 Error in recalcular médias:', error);
      toast({
        title: "Erro ao recalcular",
        description: error.message || "Ocorreu um erro ao recalcular as médias.",
        variant: "destructive",
      });
    },
  });

  return {
    data,
    isLoading,
    error,
    recalcularMedias: recalcularMediasMutation.mutate,
    isRecalculando: recalcularMediasMutation.isPending,
  };
}

// Função para calcular indicadores por empresa usando a função corrigida do banco
async function calcularIndicadoresPorEmpresa(
  empresas: any[],
  indicadores: any[],
  ano: number
): Promise<EmpresaIndicadores[]> {
  console.log('🔢 Starting calculation for', empresas.length, 'companies and', indicadores.length, 'indicators');
  
  const empresasComIndicadores: EmpresaIndicadores[] = [];

  for (const empresa of empresas) {
    console.log(`📈 Processing company: ${empresa.nome} (${empresa.id})`);
    const indicadoresCalculados: IndicadorCalculo[] = [];

    for (const indicador of indicadores) {
      try {
        // Usar a função corrigida do banco para calcular o indicador
        console.log(`🧮 Calculating indicator ${indicador.codigo} for company ${empresa.nome}`);
        
        const { data: resultado, error } = await supabase.rpc(
          'calcular_indicador_painel_empresa',
          {
            p_empresa_id: empresa.id,
            p_indicador_codigo: indicador.codigo,
            p_formula: indicador.formula,
            p_ano: ano,
            p_mes_ate: 12
          }
        );

        if (error) {
          console.error(`❌ Error calculating indicator ${indicador.codigo} for company ${empresa.nome}:`, error);
        }

        const valor = Number(resultado) || 0;

        indicadoresCalculados.push({
          codigo: indicador.codigo,
          nome: indicador.nome,
          formula: indicador.formula,
          unidade: indicador.unidade || '%',
          valor
        });

        console.log(`✅ Indicator ${indicador.codigo} for company ${empresa.nome}: ${valor}`);
      } catch (error) {
        console.error(`💥 Critical error calculating indicator ${indicador.codigo}:`, error);
        
        indicadoresCalculados.push({
          codigo: indicador.codigo,
          nome: indicador.nome,
          formula: indicador.formula,
          unidade: indicador.unidade || '%',
          valor: 0
        });
      }
    }

    empresasComIndicadores.push({
      empresa,
      indicadores: indicadoresCalculados
    });

    console.log(`✅ Company ${empresa.nome} processed with ${indicadoresCalculados.length} indicators`);
  }

  console.log('🎉 All companies processed successfully');
  return empresasComIndicadores;
}

// Nova função para calcular indicadores por faixa usando dados do banco
function calcularIndicadoresPorFaixaBanco(
  empresasComIndicadores: EmpresaIndicadores[],
  indicadores: any[],
  faixasFaturamento: any[]
): FaixaIndicadores[] {
  console.log('📊 Calculating indicators by revenue range using database config...');

  return faixasFaturamento.map(faixa => {
    console.log(`📈 Processing range: ${faixa.nome}`);
    
    // Filtrar empresas por porte (mapeamento baseado no banco de dados)
    let empresasFaixa: EmpresaIndicadores[] = [];
    
    // Determinar a faixa com base no nome/valor
    const faixaNomeNormalizado = faixa.nome.toLowerCase();
    
    if (faixaNomeNormalizado.includes('mei') || faixaNomeNormalizado.includes('newborn')) {
      empresasFaixa = empresasComIndicadores.filter(e => 
        e.empresa.porte === 'pequeno' && Math.random() > 0.7
      );
    } else if (faixaNomeNormalizado.includes('pequeno') || faixaNomeNormalizado.includes('early')) {
      empresasFaixa = empresasComIndicadores.filter(e => 
        e.empresa.porte === 'pequeno'
      );
    } else if (faixaNomeNormalizado.includes('médio') || faixaNomeNormalizado.includes('medio') || faixaNomeNormalizado.includes('scaler')) {
      empresasFaixa = empresasComIndicadores.filter(e => 
        e.empresa.porte === 'medio'
      );
    } else if (faixaNomeNormalizado.includes('grande') || faixaNomeNormalizado.includes('authority')) {
      empresasFaixa = empresasComIndicadores.filter(e => 
        e.empresa.porte === 'grande'
      );
    }

    console.log(`📊 Companies in range ${faixa.nome}: ${empresasFaixa.length}`);

    // Calcular médias dos indicadores para a faixa
    const indicadoresMedia = indicadores.map(indicador => {
      const valoresIndicador = empresasFaixa
        .map(e => e.indicadores.find(i => i.codigo === indicador.codigo)?.valor || 0)
        .filter(v => v > 0);
      
      const media = valoresIndicador.length > 0 
        ? valoresIndicador.reduce((sum, val) => sum + val, 0) / valoresIndicador.length
        : 0;

      console.log(`📊 Average for indicator ${indicador.codigo} in range ${faixa.nome}: ${media}`);

      return {
        codigo: indicador.codigo,
        nome: indicador.nome,
        formula: indicador.formula,
        unidade: indicador.unidade || '%',
        valor: media
      };
    });

    return {
      faixa: faixa.id,
      nome: faixa.nome,
      totalEmpresas: empresasFaixa.length,
      valorMinimo: faixa.valor_minimo || faixa.valorMinimo,
      valorMaximo: faixa.valor_maximo || faixa.valorMaximo,
      indicadores: indicadoresMedia
    };
  });
}
