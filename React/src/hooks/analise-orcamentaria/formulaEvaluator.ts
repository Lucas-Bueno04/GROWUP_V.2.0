
import { evaluateUnifiedFormula } from './unifiedFormulaEvaluator';

/**
 * Evaluates a group formula for the Análise Orçamentária context
 * This is the main entry point for formula evaluation in budget analysis
 */
export function evaluateGroupFormula(
  formula: string,
  grupos: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
): number {
  console.log('=== EVALUATE GROUP FORMULA (ANÁLISE ORÇAMENTÁRIA) ===');
  console.log('Formula:', formula);
  console.log('Tipo:', tipo);
  console.log('Mês:', mes || 'all months');
  console.log('Grupos disponíveis:', grupos.length);
  console.log('Valores disponíveis:', valores.length);

  // Check if we have the expected data structure for Análise Orçamentária
  const hasAnaliseStructure = valores.length > 0 && valores[0].conta && !Array.isArray(valores[0].conta);
  console.log('Has Análise Orçamentária structure:', hasAnaliseStructure);

  if (hasAnaliseStructure) {
    // Log some data structure details for debugging
    console.log('Sample value structure:', Object.keys(valores[0]));
    if (valores[0].conta) {
      console.log('Sample conta structure:', Object.keys(valores[0].conta as any));
    }
  }

  try {
    const result = evaluateUnifiedFormula(
      formula,
      grupos,
      valores,
      tipo,
      mes,
      undefined, // no indicador context for direct group evaluation
      !mes // isAnnual when no month specified
    );

    console.log('Formula evaluation result:', result);
    console.log('=== END EVALUATE GROUP FORMULA ===');
    return result;
  } catch (error) {
    console.error('Error in evaluateGroupFormula:', error);
    console.log('=== ERROR IN EVALUATE GROUP FORMULA ===');
    return 0;
  }
}

/**
 * Legacy function name for backward compatibility
 */
export function evaluateFormula(
  formula: string,
  grupos: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
): number {
  return evaluateGroupFormula(formula, grupos, valores, tipo, mes);
}

/**
 * Evaluate a formula for a specific month in the Análise Orçamentária context
 */
export function evaluateFormulaForMonth(
  formula: string,
  grupos: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes: number
): number {
  console.log(`=== EVALUATE FORMULA FOR MONTH ${mes} ===`);
  
  const result = evaluateGroupFormula(formula, grupos, valores, tipo, mes);
  
  console.log(`Monthly evaluation result for month ${mes}: ${result}`);
  console.log(`=== END EVALUATE FORMULA FOR MONTH ${mes} ===`);
  return result;
}

/**
 * Evaluate a formula for all months (annual) in the Análise Orçamentária context
 */
export function evaluateFormulaAnnual(
  formula: string,
  grupos: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado'
): number {
  console.log('=== EVALUATE FORMULA ANNUAL ===');
  
  const result = evaluateGroupFormula(formula, grupos, valores, tipo);
  
  console.log(`Annual evaluation result: ${result}`);
  console.log('=== END EVALUATE FORMULA ANNUAL ===');
  return result;
}
