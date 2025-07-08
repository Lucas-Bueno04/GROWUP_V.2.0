
import { calculationEngine } from '../engine';
import type { CalculationContext } from '../engine/types';
import { 
  analyzeDataStructure, 
  shouldCalculateAnnual, 
  logDebugInfo, 
  isBreakEvenFormula, 
  logBreakEvenDebug 
} from './utils';

export function evaluateUnifiedFormula(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number,
  indicador?: any,
  isAnnual = false
): number {
  console.log('🚀 === UNIFIED FORMULA EVALUATOR (IMPROVED) ===');
  console.log('Using new calculation engine');
  
  // Detectar tipo de dados
  const dataStructure = analyzeDataStructure(valores);
  let dataType: 'analise_orcamentaria' | 'orcamento' | 'cards_estrategicos';
  
  if (dataStructure.hasAnaliseOrcamentariaData) {
    dataType = 'analise_orcamentaria';
  } else if (dataStructure.hasStructuredData) {
    dataType = 'orcamento';
  } else {
    dataType = 'cards_estrategicos';
  }

  // Criar contexto unificado
  const context: CalculationContext = {
    allGroups,
    valores,
    tipo,
    mes,
    isAnnual: shouldCalculateAnnual(mes, isAnnual),
    indicador,
    dataType
  };

  logDebugInfo(formula, context);

  // Debug específico para Break-even
  if (isBreakEvenFormula(formula, indicador)) {
    logBreakEvenDebug(formula, allGroups, valores, tipo, mes);
  }

  try {
    // Usar o motor de cálculo unificado (agora síncrono)
    const result = calculationEngine.evaluateFormula(formula, context);
    
    console.log('✅ Unified calculation completed:', result.value);
    return result.value;

  } catch (error) {
    console.error('❌ Error in unified calculation:', error);
    return 0;
  }
}
