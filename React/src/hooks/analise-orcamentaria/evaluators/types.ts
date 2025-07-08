
// Types for the unified formula evaluator
export interface EvaluationContext {
  allGroups: any[];
  valores: any[];
  tipo: 'orcado' | 'realizado';
  mes?: number;
  indicador?: any;
  isAnnual?: boolean;
}

export interface PatternMatch {
  pattern: string;
  value: number;
}

export interface EvaluationCache {
  [key: string]: number;
}

export interface DataStructureInfo {
  hasStructuredData: boolean;
  hasAnaliseOrcamentariaData: boolean;
  firstValueStructure: string[];
}
