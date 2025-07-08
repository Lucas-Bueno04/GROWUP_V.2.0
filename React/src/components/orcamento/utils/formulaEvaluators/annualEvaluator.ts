
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from '../types';
import { evaluateExpression } from './expressionEvaluator';
import { 
  processContaPatterns, 
  processCPatterns, 
  processGPatterns, 
  processLegacyNumericPatterns 
} from '../patternProcessors';

export function evaluateFormulaAnnual(
  formula: string,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  cache: CalculationCache
): number {
  let processedFormula = formula.trim();
  console.log(`=== DEBUG ANNUAL ORCAMENTO FORMULA EVALUATION START ===`);
  console.log(`=== Evaluating annual formula: "${processedFormula}" ===`);
  console.log('Tipo:', tipo);
  console.log('Total grupos disponíveis:', allGroups.length);
  console.log('Total contas disponíveis:', contas.length);
  console.log('Total valores disponíveis:', valores.length);
  
  try {
    // Process patterns for annual calculation
    processedFormula = processContaPatterns(processedFormula, contas, valores, tipo, 1, true);
    processedFormula = processCPatterns(processedFormula, contas, valores, tipo, 1, true);
    processedFormula = processGPatterns(processedFormula, allGroups, contas, valores, tipo, 1, cache, true);

    // Check if we need to process legacy patterns
    const hasGPattern = formula.match(/G(\d+)/g);
    const hasCPattern = formula.match(/C([\w\d\.]+)/g);
    const hasContaPattern = formula.match(/CONTA_([\w\d_]+)/g);
    
    if (!hasGPattern && !hasCPattern && !hasContaPattern) {
      processedFormula = processLegacyNumericPatterns(
        processedFormula, 
        allGroups, 
        contas, 
        valores, 
        tipo, 
        1, 
        cache,
        true
      );
    }
    
    console.log(`Annual final processed formula before evaluation: "${processedFormula}"`);
    
    // Evaluate the mathematical expression
    const result = evaluateExpression(processedFormula);
    console.log(`Annual formula evaluation result: ${result}`);
    console.log('=== DEBUG ANNUAL ORCAMENTO FORMULA EVALUATION END ===');
    return result;
  } catch (error) {
    console.error(`Error evaluating annual orcamento formula:`, error);
    console.log('=== DEBUG ANNUAL ORCAMENTO FORMULA EVALUATION ERROR ===');
    return 0;
  }
}
