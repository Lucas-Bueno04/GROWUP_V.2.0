
/**
 * Tipos para o Motor de Cálculo Unificado
 */

export interface CalculationContext {
  // Dados principais
  allGroups: any[];
  valores: any[];
  tipo: 'orcado' | 'realizado';
  mes?: number;
  isAnnual?: boolean;

  // Contexto adicional
  indicador?: any;
  empresaId?: string;
  ano?: number;

  // Metadados
  dataType: 'analise_orcamentaria' | 'orcamento' | 'cards_estrategicos';
  requestId?: string;
}

export interface CalculationResult {
  value: number;
  success: boolean;
  errors?: string[];
  warnings?: string[];
  metadata?: {
    fromCache?: boolean;
    validationFailed?: boolean;
    error?: boolean;
    processingTime?: number;
    [key: string]: any;
  };
}

export interface AccountValue {
  value: number;
  fromCache: boolean;
  error?: string;
  metadata?: any;
}

export interface GroupValue {
  value: number;
  fromCache: boolean;
  error?: string;
  metadata?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export interface FormulaPattern {
  type: 'account' | 'group' | 'function';
  pattern: RegExp;
  processor: (match: string, context: CalculationContext) => number;
}

export interface NormalizationRule {
  dataType: string;
  accountSignHandling: 'preserve' | 'absolute' | 'invert';
  groupSignHandling: 'preserve' | 'absolute' | 'sum_accounts';
}
