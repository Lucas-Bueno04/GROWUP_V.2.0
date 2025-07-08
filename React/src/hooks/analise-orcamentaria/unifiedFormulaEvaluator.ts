
// Re-export the main evaluator function to maintain backward compatibility
export { evaluateUnifiedFormula } from './evaluators';

// Re-export other commonly used functions
export { 
  evaluateExpressionWithAbs,
  calculateAnaliseOrcamentariaAccountValue,
  calculateAnaliseOrcamentariaGroupValue,
  processAnaliseOrcamentariaPatterns
} from './evaluators';

// Re-export types
export type { 
  EvaluationContext, 
  PatternMatch, 
  EvaluationCache, 
  DataStructureInfo 
} from './evaluators';
