
import { evaluateUnifiedFormula } from '@/hooks/analise-orcamentaria/unifiedFormulaEvaluator';
import type { PerformanceMensal, PerformanceAnual, PerformanceCompleta } from '../types';

/**
 * Calcula se o indicador é baseado em percentual
 */
function isPercentageIndicator(unidade?: string, formula?: string): boolean {
  return unidade === '%' || (formula && formula.includes('/') && formula.includes('*100'));
}

/**
 * Calcula se o indicador é uma divisão entre grupos (ex: G10/G3)
 */
function isGroupDivisionIndicator(formula?: string): boolean {
  if (!formula) return false;
  
  // Verificar se a fórmula contém divisão entre grupos (padrão G{numero}/G{numero})
  const groupDivisionPattern = /G\d+\s*\/\s*G\d+/;
  return groupDivisionPattern.test(formula);
}

/**
 * Calcula se o indicador deveria usar média ao invés de soma para totais anuais
 */
function shouldUseAverageForAnnual(indicador?: any): boolean {
  if (!indicador) return false;
  
  // Se é divisão entre grupos, NÃO usar média - calcular com totais anuais
  if (isGroupDivisionIndicator(indicador.formula)) {
    console.log(`Indicator ${indicador.codigo} is group division, using annual totals calculation`);
    return false;
  }
  
  // Indicadores de percentual simples devem usar média
  if (isPercentageIndicator(indicador.unidade, indicador.formula)) {
    console.log(`Indicator ${indicador.codigo} is simple percentage, using average`);
    return true;
  }
  
  return false;
}

export function calculatePerformance(
  metas: any[],
  valoresRealizados: number[],
  melhorQuando: 'maior' | 'menor'
): PerformanceCompleta {
  console.log(`=== CALCULATING PERFORMANCE ===`);
  console.log('Metas:', metas.length);
  console.log('Valores realizados:', valoresRealizados.length);
  console.log('Melhor quando:', melhorQuando);

  const performanceData: PerformanceMensal[] = [];

  // Calcular performance para cada mês (1-12)
  for (let mes = 1; mes <= 12; mes++) {
    const valorRealizado = valoresRealizados[mes - 1] || 0;

    // Buscar meta para este mês
    const metaMes = metas.find(meta => meta.mes === mes);
    const valorMeta = metaMes?.valor_meta || 0;

    // Calcular variação absoluta e percentual
    const variacao = valorRealizado - valorMeta;
    let variacaoPercentual = 0;
    if (valorMeta !== 0) {
      variacaoPercentual = ((valorRealizado - valorMeta) / Math.abs(valorMeta)) * 100;
    } else if (valorRealizado !== 0) {
      variacaoPercentual = valorRealizado > 0 ? 100 : -100;
    }

    // Determinar status baseado na preferência do indicador
    let status: 'acima' | 'dentro' | 'abaixo';
    
    if (Math.abs(variacaoPercentual) <= 5) {
      status = 'dentro'; // Margem de 5% considerada "dentro da meta"
    } else if (melhorQuando === 'maior') {
      status = variacaoPercentual > 0 ? 'acima' : 'abaixo';
    } else {
      status = variacaoPercentual < 0 ? 'acima' : 'abaixo';
    }

    performanceData.push({
      mes,
      valorRealizado,
      valorMeta,
      variacao,
      variacaoPercentual,
      status
    });
  }

  // Calcular totais anuais
  const totalRealizado = performanceData.reduce((sum, p) => sum + p.valorRealizado, 0);
  const totalMeta = performanceData.reduce((sum, p) => sum + p.valorMeta, 0);
  
  let variacaoAnual = 0;
  if (totalMeta !== 0) {
    variacaoAnual = ((totalRealizado - totalMeta) / Math.abs(totalMeta)) * 100;
  } else if (totalRealizado !== 0) {
    variacaoAnual = totalRealizado > 0 ? 100 : -100;
  }

  let statusAnual: 'acima' | 'dentro' | 'abaixo';
  
  if (Math.abs(variacaoAnual) <= 5) {
    statusAnual = 'dentro';
  } else if (melhorQuando === 'maior') {
    statusAnual = variacaoAnual > 0 ? 'acima' : 'abaixo';
  } else {
    statusAnual = variacaoAnual < 0 ? 'acima' : 'abaixo';
  }

  const result: PerformanceCompleta = {
    mensal: performanceData,
    anual: {
      totalRealizado,
      totalMeta,
      variacaoPercentual: variacaoAnual,
      status: statusAnual
    }
  };

  console.log(`=== PERFORMANCE CALCULATION COMPLETED ===`);
  console.log('Annual summary:', result.anual);

  return result;
}

export async function calcularPerformanceIndicador(
  indicador: any,
  metas: any[],
  grupos: any[],
  valores: any[],
  tipo: 'plano-contas' | 'empresa'
): Promise<PerformanceCompleta> {
  console.log(`=== CALCULATING PERFORMANCE FOR ${tipo.toUpperCase()} INDICATOR ${indicador.codigo} ===`);
  console.log('Indicador:', indicador.nome);
  console.log('Formula:', indicador.formula);
  console.log('Unidade:', indicador.unidade);
  console.log('Available grupos:', grupos.length);
  console.log('Available valores:', valores.length);
  console.log('Metas:', metas.length);

  const performanceData: PerformanceMensal[] = [];
  const isPercentage = isPercentageIndicator(indicador.unidade, indicador.formula);
  const isGroupDivision = isGroupDivisionIndicator(indicador.formula);
  const useAverageForAnnual = shouldUseAverageForAnnual(indicador);
  
  console.log('Is percentage indicator:', isPercentage);
  console.log('Is group division indicator:', isGroupDivision);
  console.log('Use average for annual:', useAverageForAnnual);

  // Calcular performance para cada mês (1-12)
  for (let mes = 1; mes <= 12; mes++) {
    try {
      console.log(`--- Calculating performance for month ${mes} ---`);
      
      // Calcular valor realizado usando a fórmula do indicador
      const valorRealizado = evaluateUnifiedFormula(
        indicador.formula,
        grupos,
        valores,
        'realizado',
        mes,
        indicador
      );

      // Garantir que o valor é numérico e válido
      const valorRealizadoNumerico = Number(valorRealizado) || 0;
      console.log(`Month ${mes} - Valor realizado: ${valorRealizadoNumerico}`);

      // Buscar meta para este mês
      const metaMes = metas.find(meta => meta.mes === mes);
      const valorMeta = Number(metaMes?.valor_meta) || 0;

      console.log(`Month ${mes} - Valor meta: ${valorMeta}`);

      // Calcular variação absoluta e percentual
      const variacao = valorRealizadoNumerico - valorMeta;
      let variacaoPercentual = 0;
      if (valorMeta !== 0) {
        variacaoPercentual = ((valorRealizadoNumerico - valorMeta) / Math.abs(valorMeta)) * 100;
      } else if (valorRealizadoNumerico !== 0) {
        variacaoPercentual = valorRealizadoNumerico > 0 ? 100 : -100;
      }

      // Determinar status baseado na preferência do indicador
      let status: 'acima' | 'dentro' | 'abaixo';
      const melhorQuando = indicador.melhor_quando || 'maior';
      
      if (Math.abs(variacaoPercentual) <= 5) {
        status = 'dentro'; // Margem de 5% considerada "dentro da meta"
      } else if (melhorQuando === 'maior') {
        status = variacaoPercentual > 0 ? 'acima' : 'abaixo';
      } else {
        status = variacaoPercentual < 0 ? 'acima' : 'abaixo';
      }

      console.log(`Month ${mes} - Status: ${status}, Variação: ${variacaoPercentual.toFixed(2)}%`);

      performanceData.push({
        mes,
        valorRealizado: valorRealizadoNumerico,
        valorMeta,
        variacao,
        variacaoPercentual,
        status
      });

    } catch (error) {
      console.error(`Error calculating performance for month ${mes}:`, error);
      performanceData.push({
        mes,
        valorRealizado: 0,
        valorMeta: 0,
        variacao: 0,
        variacaoPercentual: 0,
        status: 'abaixo'
      });
    }
  }

  // Calcular totais anuais CORRIGIDOS
  let totalRealizado: number;
  let totalMeta: number;

  if (isGroupDivision) {
    // Para indicadores de divisão entre grupos, calcular usando fórmula anual
    console.log('Calculating annual value using unified formula for group division indicator');
    totalRealizado = evaluateUnifiedFormula(
      indicador.formula,
      grupos,
      valores,
      'realizado',
      undefined, // sem mês = cálculo anual
      indicador,
      true // isAnnual
    );
    
    totalMeta = 0; // Calcular se existem metas anuais
    const metasValidas = performanceData
      .map(p => p.valorMeta)
      .filter(v => v !== 0);
    
    if (metasValidas.length > 0) {
      totalMeta = metasValidas.reduce((sum, v) => sum + v, 0) / metasValidas.length;
    }

    console.log(`Using ANNUAL FORMULA calculation for group division: Realizado=${totalRealizado.toFixed(2)}, Meta=${totalMeta.toFixed(2)}`);
  } else if (useAverageForAnnual) {
    // Para indicadores percentuais simples, usar MÉDIA dos valores não-zero
    const valoresRealizadosValidos = performanceData
      .map(p => p.valorRealizado)
      .filter(v => v !== 0);
    
    const valoresMetaValidos = performanceData
      .map(p => p.valorMeta)
      .filter(v => v !== 0);

    totalRealizado = valoresRealizadosValidos.length > 0 
      ? valoresRealizadosValidos.reduce((sum, v) => sum + v, 0) / valoresRealizadosValidos.length
      : 0;

    totalMeta = valoresMetaValidos.length > 0
      ? valoresMetaValidos.reduce((sum, v) => sum + v, 0) / valoresMetaValidos.length
      : 0;

    console.log(`Using AVERAGE for annual calculation: Realizado=${totalRealizado.toFixed(2)}, Meta=${totalMeta.toFixed(2)}`);
  } else {
    // Para indicadores absolutos, usar SOMA
    totalRealizado = performanceData.reduce((sum, p) => sum + p.valorRealizado, 0);
    totalMeta = performanceData.reduce((sum, p) => sum + p.valorMeta, 0);

    console.log(`Using SUM for annual calculation: Realizado=${totalRealizado.toFixed(2)}, Meta=${totalMeta.toFixed(2)}`);
  }
  
  let variacaoAnual = 0;
  if (totalMeta !== 0) {
    variacaoAnual = ((totalRealizado - totalMeta) / Math.abs(totalMeta)) * 100;
  } else if (totalRealizado !== 0) {
    variacaoAnual = totalRealizado > 0 ? 100 : -100;
  }

  const melhorQuando = indicador.melhor_quando || 'maior';
  let statusAnual: 'acima' | 'dentro' | 'abaixo';
  
  if (Math.abs(variacaoAnual) <= 5) {
    statusAnual = 'dentro';
  } else if (melhorQuando === 'maior') {
    statusAnual = variacaoAnual > 0 ? 'acima' : 'abaixo';
  } else {
    statusAnual = variacaoAnual < 0 ? 'acima' : 'abaixo';
  }

  const result: PerformanceCompleta = {
    mensal: performanceData,
    anual: {
      totalRealizado,
      totalMeta,
      variacaoPercentual: variacaoAnual,
      status: statusAnual
    }
  };

  console.log(`=== PERFORMANCE CALCULATION COMPLETED FOR ${indicador.codigo} ===`);
  console.log('Annual summary:', result.anual);
  console.log('Monthly summary:', performanceData.map(p => `${p.mes}: ${p.status}`).join(', '));

  return result;
}
