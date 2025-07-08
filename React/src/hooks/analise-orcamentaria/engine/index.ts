
/**
 * Exports principais do Motor de Cálculo Unificado
 */

export { UnifiedCalculationEngine, calculationEngine } from './UnifiedCalculationEngine';
export { ValueNormalizer } from './ValueNormalizer';
export { FormulaProcessor } from './FormulaProcessor';
export { HierarchicalCache } from './HierarchicalCache';
export { CalculationValidator } from './CalculationValidator';

export type {
  CalculationContext,
  CalculationResult,
  AccountValue,
  GroupValue,
  ValidationResult,
  CacheStats,
  FormulaPattern,
  NormalizationRule
} from './types';
