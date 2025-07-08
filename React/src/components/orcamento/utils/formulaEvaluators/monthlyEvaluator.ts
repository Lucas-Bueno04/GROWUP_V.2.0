
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from '../types';
import { 
  processContaPatterns,
  processCPatterns, 
  processGPatterns,
  processLegacyNumericPatterns
} from '../processors';
import { evaluateExpression } from './expressionEvaluator';

export function evaluateFormulaForMonth(
  formula: string,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number,
  cache: CalculationCache
): number {
  console.log(`=== EVALUATING FORMULA FOR MONTH ${mes} ===`);
  console.log('Input formula:', formula);
  console.log('Available groups:', allGroups.length);
  console.log('Available accounts:', contas.length);
  console.log('Available values:', valores.length);

  let processedFormula = formula.trim();

  try {
    // **CRITICAL**: Process patterns in the correct order for proper dependency resolution
    console.log('🔄 Processing CONTA patterns...');
    processedFormula = processContaPatterns(processedFormula, contas, valores, tipo, mes, false);
    console.log('After CONTA patterns:', processedFormula);
    
    console.log('🔄 Processing C patterns...');
    processedFormula = processCPatterns(processedFormula, contas, valores, tipo, mes, false);
    console.log('After C patterns:', processedFormula);
    
    console.log('🔄 Processing G patterns...');
    processedFormula = processGPatterns(processedFormula, allGroups, contas, valores, tipo, mes, cache, false);
    console.log('After G patterns:', processedFormula);
    
    // Only process legacy patterns if no modern patterns were found
    if (!formula.match(/CONTA_([\w\d_]+)/g) && !formula.match(/C([\w\d\.]+)/g) && !formula.match(/G(\d+)/g)) {
      console.log('🔄 Processing legacy numeric patterns...');
      processedFormula = processLegacyNumericPatterns(processedFormula, allGroups, contas, valores, tipo, mes, cache, false);
      console.log('After legacy patterns:', processedFormula);
    }

    console.log(`🧮 Final formula to evaluate: "${processedFormula}"`);
    
    // Evaluate the mathematical expression
    const result = evaluateExpression(processedFormula);
    console.log(`✅ Monthly formula evaluation result: ${result}`);
    console.log(`=== END EVALUATING FORMULA FOR MONTH ${mes} ===`);
    
    return result;
  } catch (error) {
    console.error(`❌ Error evaluating monthly formula:`, error);
    console.log(`=== ERROR IN FORMULA EVALUATION FOR MONTH ${mes} ===`);
    return 0;
  }
}
