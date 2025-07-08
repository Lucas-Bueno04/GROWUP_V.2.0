
import type { IndicadorCalculado, ResumoPerformance, ContextoFormula } from './types';
import { avaliarFormula } from './formulaEvaluator';

export async function calculateIndicadorValue(
  indicador: any,
  orcamentoData: any,
  empresaId: string,
  ano: number
): Promise<IndicadorCalculado | null> {
  console.log(`=== CALCULANDO INDICADOR ${indicador.codigo} ===`);
  console.log('Fórmula:', indicador.formula);
  console.log('Orçamento disponível:', !!orcamentoData);

  try {
    // Preparar contexto para avaliação de fórmula
    const contexto: ContextoFormula = {
      empresa_id: empresaId,
      ano: ano,
      valores_orcamentarios: {},
      indicadores_anteriores: {}
    };

    // Se há dados de orçamento, extrair valores
    if (orcamentoData && orcamentoData.valores) {
      orcamentoData.valores.forEach((valor: any) => {
        if (valor.conta && valor.conta.codigo) {
          const valorFinal = valor.valor_realizado || valor.valor_orcado || 0;
          contexto.valores_orcamentarios[valor.conta.codigo] = valorFinal;
        }
      });
    }

    // Tentar calcular usando o avaliador de fórmulas
    const resultadoFormula = await avaliarFormula(indicador.formula, contexto);
    
    let valorEmpresa: number;
    
    if (resultadoFormula.sucesso) {
      valorEmpresa = resultadoFormula.valor;
      console.log(`Fórmula avaliada com sucesso: ${valorEmpresa}`);
    } else {
      console.warn(`Erro na fórmula: ${resultadoFormula.erro}. Usando valor simulado.`);
      valorEmpresa = calculateSimulatedValue(indicador);
    }

    // Calcular valores comparativos (simulados com variação baseada no valor da empresa)
    const grupoVariation = -0.2 + Math.random() * 0.4; // -20% a +20%
    const geralVariation = -0.3 + Math.random() * 0.6; // -30% a +30%
    
    const valorGrupo = valorEmpresa * (1 + grupoVariation);
    const valorGeral = valorEmpresa * (1 + geralVariation);
    
    const performanceVsGrupo = ((valorEmpresa - valorGrupo) / Math.abs(valorGrupo)) * 100;
    const performanceVsGeral = ((valorEmpresa - valorGeral) / Math.abs(valorGeral)) * 100;

    const resultado: IndicadorCalculado = {
      codigo: indicador.codigo,
      nome: indicador.nome,
      unidade: indicador.unidade || '%',
      melhorQuando: indicador.melhor_quando || 'maior',
      formula: indicador.formula || '',
      valorEmpresa,
      valorGrupo,
      valorGeral,
      performanceVsGrupo,
      performanceVsGeral
    };

    console.log(`Indicador ${indicador.codigo} calculado:`, resultado);
    return resultado;

  } catch (error) {
    console.error(`Erro ao calcular indicador ${indicador.codigo}:`, error);
    return null;
  }
}

function calculateSimulatedValue(indicador: any): number {
  // Gerar valores simulados baseados no tipo de indicador
  const nome = indicador.nome?.toLowerCase() || '';
  const codigo = indicador.codigo?.toLowerCase() || '';
  
  // Indicadores de margem (%)
  if (nome.includes('margem') || nome.includes('margin')) {
    return 5 + Math.random() * 25; // 5% a 30%
  }
  
  // Indicadores de liquidez
  if (nome.includes('liquidez') || nome.includes('liquid')) {
    return 1 + Math.random() * 3; // 1 a 4
  }
  
  // Indicadores de giro
  if (nome.includes('giro') || nome.includes('rotation')) {
    return 2 + Math.random() * 8; // 2 a 10
  }
  
  // Indicadores percentuais gerais
  if (indicador.unidade === '%') {
    return 10 + Math.random() * 40; // 10% a 50%
  }
  
  // Indicadores absolutos
  if (nome.includes('receita') || nome.includes('revenue')) {
    return 100000 + Math.random() * 500000; // 100k a 600k
  }
  
  // Default para outros indicadores
  return 50 + Math.random() * 100; // 50 a 150
}

export function calculateResumoPerformance(indicadores: IndicadorCalculado[]): ResumoPerformance {
  const total = indicadores.length;
  
  const acimaGrupo = indicadores.filter(ind => ind.performanceVsGrupo > 0).length;
  const abaixoGrupo = total - acimaGrupo;
  
  const acimaGeral = indicadores.filter(ind => ind.performanceVsGeral > 0).length;
  const abaixoGeral = total - acimaGeral;

  return {
    totalIndicadores: total,
    acimaGrupo,
    abaixoGrupo,
    acimaGeral,
    abaixoGeral
  };
}

export function calculatePerformanceScore(indicadores: IndicadorCalculado[]): number {
  if (indicadores.length === 0) return 0;
  
  // Calcular score baseado na performance vs grupo e geral
  const scoreGrupo = indicadores.reduce((acc, ind) => acc + ind.performanceVsGrupo, 0) / indicadores.length;
  const scoreGeral = indicadores.reduce((acc, ind) => acc + ind.performanceVsGeral, 0) / indicadores.length;
  
  // Média ponderada (60% grupo, 40% geral)
  const scoreFinal = (scoreGrupo * 0.6) + (scoreGeral * 0.4);
  
  return Math.round(scoreFinal * 10) / 10; // Arredondar para 1 casa decimal
}
