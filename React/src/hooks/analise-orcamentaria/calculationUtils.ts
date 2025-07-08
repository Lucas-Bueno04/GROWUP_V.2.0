
import { calculationEngine } from './engine';
import type { CalculationContext } from './engine/types';

/**
 * CÁLCULOS CRÍTICOS USANDO MOTOR UNIFICADO
 * Versão melhorada com consistência garantida
 */

export function calculateReceitaLiquida(valores: any[]): { receitaLiquidaOrcada: number; receitaLiquidaRealizada: number } {
  console.log('🎯 === RECEITA LÍQUIDA (UNIFIED ENGINE) ===');
  
  const context: CalculationContext = {
    allGroups: [],
    valores,
    tipo: 'orcado', // Será alterado conforme necessário
    dataType: 'analise_orcamentaria'
  };

  try {
    // Calcular valores usando o motor unificado
    context.tipo = 'orcado';
    const receitaOrcada = calculationEngine.calculateAccountValue('3', context); // Grupo 3 como conta
    
    context.tipo = 'realizado';
    const receitaRealizada = calculationEngine.calculateAccountValue('3', context);
    
    console.log(`Receita Líquida (Unified): Orçado=${receitaOrcada.value}, Realizado=${receitaRealizada.value}`);
    
    return { 
      receitaLiquidaOrcada: receitaOrcada.value, 
      receitaLiquidaRealizada: receitaRealizada.value 
    };
  } catch (error) {
    console.error('❌ Error in unified receita calculation:', error);
    return { receitaLiquidaOrcada: 0, receitaLiquidaRealizada: 0 };
  }
}

export function calculateCustosOperacionais(valores: any[]): { custosOperacionaisOrcado: number; custosOperacionaisRealizado: number } {
  console.log('🎯 === CUSTOS OPERACIONAIS (UNIFIED ENGINE) ===');
  
  const context: CalculationContext = {
    allGroups: [],
    valores,
    tipo: 'orcado',
    dataType: 'analise_orcamentaria'
  };

  try {
    context.tipo = 'orcado';
    const custosOrcado = calculationEngine.calculateAccountValue('4', context);
    
    context.tipo = 'realizado';
    const custosRealizado = calculationEngine.calculateAccountValue('4', context);
    
    console.log(`Custos Operacionais (Unified): Orçado=${Math.abs(custosOrcado.value)}, Realizado=${Math.abs(custosRealizado.value)}`);
    
    return { 
      custosOperacionaisOrcado: Math.abs(custosOrcado.value), 
      custosOperacionaisRealizado: Math.abs(custosRealizado.value) 
    };
  } catch (error) {
    console.error('❌ Error in unified custos calculation:', error);
    return { custosOperacionaisOrcado: 0, custosOperacionaisRealizado: 0 };
  }
}

export function calculateEbitda(valores: any[]): { ebitdaOrcado: number; ebitdaRealizado: number } {
  console.log('🎯 === EBITDA (UNIFIED ENGINE) ===');
  
  // Usar fórmula padrão do EBITDA: G3 - G4 - G5
  const ebitdaFormula = 'G3 - G4 - G5';
  
  const context: CalculationContext = {
    allGroups: [
      { codigo: '3', nome: 'Receita Líquida', tipo_calculo: 'soma' },
      { codigo: '4', nome: 'Custos Operacionais', tipo_calculo: 'soma' },
      { codigo: '5', nome: 'Despesas Operacionais', tipo_calculo: 'soma' }
    ],
    valores,
    tipo: 'orcado',
    dataType: 'analise_orcamentaria'
  };

  try {
    // Calcular EBITDA orçado
    context.tipo = 'orcado';
    const resultOrcado = calculationEngine.evaluateFormula(ebitdaFormula, context);
    const ebitdaOrcado = resultOrcado.value;
    
    // Calcular EBITDA realizado
    context.tipo = 'realizado';
    const resultRealizado = calculationEngine.evaluateFormula(ebitdaFormula, context);
    const ebitdaRealizado = resultRealizado.value;
    
    console.log(`EBITDA (Unified): Orçado=${ebitdaOrcado}, Realizado=${ebitdaRealizado}`);
    
    return { ebitdaOrcado, ebitdaRealizado };
  } catch (error) {
    console.error('❌ Error in unified EBITDA calculation:', error);
    return { ebitdaOrcado: 0, ebitdaRealizado: 0 };
  }
}

// **FUNÇÕES AUXILIARES SIMPLIFICADAS** - Mantidas para compatibilidade

export function applySign(value: number, sign: string): number {
  return value; // Simplificado - o motor unificado já trata sinais
}

export function calculateGroupTotals(grupo: any, valoresArray: any[]): { orcado: number; realizado: number } {
  const context: CalculationContext = {
    allGroups: [grupo],
    valores: valoresArray,
    tipo: 'orcado',
    dataType: 'analise_orcamentaria'
  };

  try {
    context.tipo = 'orcado';
    const orcadoResult = calculationEngine.calculateGroupValue(grupo, context);
    
    context.tipo = 'realizado';
    const realizadoResult = calculationEngine.calculateGroupValue(grupo, context);

    return { 
      orcado: orcadoResult.value, 
      realizado: realizadoResult.value 
    };
  } catch (error) {
    console.error('Error in calculateGroupTotals:', error);
    return { orcado: 0, realizado: 0 };
  }
}

export function calculateMonthlyGroupData(grupo: any, valoresArray: any[], mes: number): { orcado: number; realizado: number } {
  const context: CalculationContext = {
    allGroups: [grupo],
    valores: valoresArray,
    tipo: 'orcado',
    mes,
    dataType: 'analise_orcamentaria'
  };

  try {
    context.tipo = 'orcado';
    const orcadoResult = calculationEngine.calculateGroupValue(grupo, context);
    
    context.tipo = 'realizado';
    const realizadoResult = calculationEngine.calculateGroupValue(grupo, context);

    return { 
      orcado: orcadoResult.value, 
      realizado: realizadoResult.value 
    };
  } catch (error) {
    console.error('Error in calculateMonthlyGroupData:', error);
    return { orcado: 0, realizado: 0 };
  }
}
