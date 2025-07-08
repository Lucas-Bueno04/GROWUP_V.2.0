
import { evaluateUnifiedFormula } from './unifiedFormulaEvaluator';

export function evaluateGroupFormulaWithCorrection(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number,
  indicador?: any
): number {
  console.log('=== FORMULA EVALUATOR WITH CORRECTION (UNIFIED) ===');
  console.log('Delegating to unified formula evaluator...');
  
  return evaluateUnifiedFormula(formula, allGroups, valores, tipo, mes, indicador);
}
