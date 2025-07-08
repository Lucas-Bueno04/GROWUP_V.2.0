
// Main exports for the unified formula evaluator
export { evaluateUnifiedFormula } from './mainEvaluator';
export { evaluateExpressionWithAbs } from './expressionEvaluator';
export { calculateAnaliseOrcamentariaAccountValue } from './accountCalculator';
export { calculateAnaliseOrcamentariaGroupValue } from './groupCalculator';
export { processAnaliseOrcamentariaPatterns } from './patternProcessor';

// Type exports
export type { 
  EvaluationContext, 
  PatternMatch, 
  EvaluationCache, 
  DataStructureInfo 
} from './types';

// Utility exports
export { 
  analyzeDataStructure, 
  shouldCalculateAnnual, 
  logDebugInfo, 
  isBreakEvenFormula, 
  logBreakEvenDebug 
} from './utils';

// EBITDA debugging utilities
export { 
  debugEBITDACalculation, 
  validateEBITDAResult 
} from './ebitdaDebugger';
