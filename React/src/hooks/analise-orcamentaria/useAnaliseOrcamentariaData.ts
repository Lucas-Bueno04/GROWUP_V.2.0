
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/auth/AuthContext';
import { BudgetAnalysisData } from './types';
import { 
  calculateReceitaLiquida, 
  calculateCustosOperacionais,
  calculateEbitda
} from './calculationUtils';
import { processMonthlyData } from './monthlyDataProcessor';
import { processHierarchicalData } from './hierarchicalDataProcessor';
import { processDetailedIndicators } from './detailedIndicatorsProcessor';
import { 
  fetchOrcamentoData, 
  fetchGruposAndContas, 
  fetchBudgetValues 
} from './dataFetcher';
import { getVarianceInterpretation } from '@/components/analise-orcamentaria/utils/varianceUtils';

const createEmptyBudgetData = (): BudgetAnalysisData => ({
  totalOrcado: 0,
  totalRealizado: 0,
  varianciaAbsoluta: 0,
  varianciaPercentual: 0,
  status: 'neutral',
  indicadoresCount: 0,
  receitaLiquidaOrcada: 0,
  receitaLiquidaRealizada: 0,
  custosOperacionaisOrcado: 0,
  custosOperacionaisRealizado: 0,
  ebitdaOrcado: 0,
  ebitdaRealizado: 0,
  dadosMensais: [],
  dadosHierarquicos: { grupos: [] },
  gruposDisponiveis: [],
  indicadoresDetalhados: []
});

export function useAnaliseOrcamentariaData(ano: number, empresaId?: string, mesAte?: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analise-orcamentaria', ano, empresaId, user?.id, mesAte],
    queryFn: async (): Promise<BudgetAnalysisData> => {
      console.log('useAnaliseOrcamentariaData - Iniciando:', { ano, empresaId, userId: user?.id, mesAte });
      
      if (!user?.id) {
        console.log('useAnaliseOrcamentariaData - Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      if (!empresaId) {
        console.log('useAnaliseOrcamentariaData - Empresa não selecionada, retornando dados vazios');
        return createEmptyBudgetData();
      }

      try {
        console.log('useAnaliseOrcamentariaData - Buscando orçamento...');
        const orcamento = await fetchOrcamentoData(ano, empresaId, user.id);
        
        if (!orcamento) {
          console.log('useAnaliseOrcamentariaData - Nenhum orçamento encontrado');
          return createEmptyBudgetData();
        }

        console.log('useAnaliseOrcamentariaData - Orçamento encontrado:', orcamento.id);

        console.log('useAnaliseOrcamentariaData - Buscando grupos e contas...');
        const gruposArray = await fetchGruposAndContas();
        
        console.log('useAnaliseOrcamentariaData - Buscando valores do orçamento...');
        const valoresArray = await fetchBudgetValues(orcamento.id);

        console.log('useAnaliseOrcamentariaData - Dados carregados:', {
          grupos: gruposArray.length,
          valores: valoresArray.length
        });

        if (gruposArray.length === 0 && valoresArray.length === 0) {
          console.log('useAnaliseOrcamentariaData - Nenhum dado encontrado');
          return createEmptyBudgetData();
        }

        // Calculate financial metrics
        console.log('useAnaliseOrcamentariaData - Calculando métricas financeiras...');
        const { receitaLiquidaOrcada, receitaLiquidaRealizada } = calculateReceitaLiquida(valoresArray);
        const { custosOperacionaisOrcado, custosOperacionaisRealizado } = calculateCustosOperacionais(valoresArray);
        const { ebitdaOrcado, ebitdaRealizado } = calculateEbitda(valoresArray);

        console.log('useAnaliseOrcamentariaData - Métricas calculadas:', {
          receitaLiquidaOrcada,
          receitaLiquidaRealizada,
          custosOperacionaisOrcado,
          custosOperacionaisRealizado
        });

        // Calculate totals
        const totalOrcado = valoresArray.reduce((sum, v) => sum + (v.valor_orcado || 0), 0);
        const totalRealizado = valoresArray.reduce((sum, v) => sum + (v.valor_realizado || 0), 0);

        // Calculate variance based on Receita Líquida
        const receitaVariancia = receitaLiquidaRealizada - receitaLiquidaOrcada;
        const receitaVarianciaPercentual = receitaLiquidaOrcada > 0 ? (receitaVariancia / receitaLiquidaOrcada) * 100 : 0;
        const { status } = getVarianceInterpretation(receitaVariancia, receitaLiquidaOrcada, '+');

        // Process data
        console.log('useAnaliseOrcamentariaData - Processando dados...');
        const dadosMensais = processMonthlyData(valoresArray);
        const dadosHierarquicos = processHierarchicalData(gruposArray, valoresArray);
        const indicadoresDetalhados = processDetailedIndicators(valoresArray);

        const gruposDisponiveis = gruposArray.map(grupo => ({
          id: grupo.id,
          codigo: grupo.codigo,
          nome: grupo.nome
        }));

        // Calculate cumulative data if needed
        let dadosCumulativos = {};
        if (mesAte) {
          console.log('useAnaliseOrcamentariaData - Calculando dados cumulativos para mês:', mesAte);
          const cumulativeTotals = calculateCumulativeBudgetTotals(valoresArray, mesAte);
          dadosCumulativos = {
            totalOrcadoCumulativo: cumulativeTotals.totalOrcadoCumulativo,
            totalRealizadoCumulativo: cumulativeTotals.totalRealizadoCumulativo,
            varianciaAbsolutaCumulativa: cumulativeTotals.varianciaAbsolutaCumulativa,
            varianciaPercentualCumulativa: cumulativeTotals.varianciaPercentualCumulativa,
            statusCumulativo: cumulativeTotals.status,
            receitaLiquidaOrcadaCumulativa: cumulativeTotals.receitaLiquidaOrcadaCumulativa,
            receitaLiquidaRealizadaCumulativa: cumulativeTotals.receitaLiquidaRealizadaCumulativa,
            custosOperacionaisOrcadoCumulativo: cumulativeTotals.custosOperacionaisOrcadoCumulativo,
            custosOperacionaisRealizadoCumulativo: cumulativeTotals.custosOperacionaisRealizadoCumulativo,
            ebitdaOrcadoCumulativo: cumulativeTotals.ebitdaOrcadoCumulativo,
            ebitdaRealizadoCumulativo: cumulativeTotals.ebitdaRealizadoCumulativo
          };
        }

        const resultado = {
          totalOrcado,
          totalRealizado,
          varianciaAbsoluta: receitaVariancia,
          varianciaPercentual: receitaVarianciaPercentual,
          status,
          indicadoresCount: indicadoresDetalhados.length,
          receitaLiquidaOrcada,
          receitaLiquidaRealizada,
          custosOperacionaisOrcado,
          custosOperacionaisRealizado,
          ebitdaOrcado,
          ebitdaRealizado,
          dadosMensais,
          dadosHierarquicos,
          gruposDisponiveis,
          indicadoresDetalhados,
          ...dadosCumulativos
        };

        console.log('useAnaliseOrcamentariaData - Análise processada com sucesso:', {
          indicadoresCount: resultado.indicadoresCount,
          dadosMensaisCount: resultado.dadosMensais.length,
          gruposHierarquicosCount: resultado.dadosHierarquicos.grupos.length
        });
        
        return resultado;
      } catch (error) {
        console.error('useAnaliseOrcamentariaData - Erro na análise:', error);
        throw error;
      }
    },
    enabled: !!user?.id && !!ano && !!empresaId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      console.log('useAnaliseOrcamentariaData - Retry:', failureCount, error?.message);
      if (error?.message?.includes('não autenticado')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Helper function for cumulative calculations
function calculateCumulativeBudgetTotals(valores: any[], mesAte: number) {
  const valoresFiltrados = valores.filter(v => v.mes <= mesAte);
  
  const totalOrcadoCumulativo = valoresFiltrados.reduce((sum, v) => sum + (v.valor_orcado || 0), 0);
  const totalRealizadoCumulativo = valoresFiltrados.reduce((sum, v) => sum + (v.valor_realizado || 0), 0);
  
  const receitasOrcadas = valoresFiltrados
    .filter(v => v.conta?.grupo?.codigo?.startsWith('3'))
    .reduce((sum, v) => {
      const valor = v.valor_orcado || 0;
      return sum + (v.conta.sinal === '+' ? valor : -valor);
    }, 0);
    
  const receitasRealizadas = valoresFiltrados
    .filter(v => v.conta?.grupo?.codigo?.startsWith('3'))
    .reduce((sum, v) => {
      const valor = v.valor_realizado || 0;
      return sum + (v.conta.sinal === '+' ? valor : -valor);
    }, 0);
  
  const custosOrcados = valoresFiltrados
    .filter(v => v.conta?.grupo?.codigo?.match(/^[45]/))
    .reduce((sum, v) => {
      const valor = v.valor_orcado || 0;
      return sum + (v.conta.sinal === '+' ? valor : -valor);
    }, 0);
    
  const custosRealizados = valoresFiltrados
    .filter(v => v.conta?.grupo?.codigo?.match(/^[45]/))
    .reduce((sum, v) => {
      const valor = v.valor_realizado || 0;
      return sum + (v.conta.sinal === '+' ? valor : -valor);
    }, 0);
  
  const ebitdaOrcadoCumulativo = receitasOrcadas - Math.abs(custosOrcados);
  const ebitdaRealizadoCumulativo = receitasRealizadas - Math.abs(custosRealizados);
  
  const varianciaAbsolutaCumulativa = receitasRealizadas - receitasOrcadas;
  const varianciaPercentualCumulativa = receitasOrcadas > 0 ? 
    (varianciaAbsolutaCumulativa / receitasOrcadas) * 100 : 0;
  
  let status: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (Math.abs(varianciaPercentualCumulativa) >= 5) {
    status = varianciaAbsolutaCumulativa > 0 ? 'positive' : 'negative';
  }
  
  return {
    totalOrcadoCumulativo,
    totalRealizadoCumulativo,
    varianciaAbsolutaCumulativa,
    varianciaPercentualCumulativa,
    status,
    receitaLiquidaOrcadaCumulativa: receitasOrcadas,
    receitaLiquidaRealizadaCumulativa: receitasRealizadas,
    custosOperacionaisOrcadoCumulativo: Math.abs(custosOrcados),
    custosOperacionaisRealizadoCumulativo: Math.abs(custosRealizados),
    ebitdaOrcadoCumulativo,
    ebitdaRealizadoCumulativo
  };
}
