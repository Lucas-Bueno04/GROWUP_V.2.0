
export { useDashboardInteligente } from './useDashboardInteligente';
export { useMediasComparativas, useMediasComparativasEmpresa } from './useMediasComparativas';
export { fetchEmpresaGrupos, fetchIndicadoresPlano, fetchOrcamentoData, fetchOrcamentoEmpresa } from './dataFetcher';
export { calculateIndicadorValue, calculateResumoPerformance, calculatePerformanceScore } from './calculators';
export { generateAdvancedInsights } from './insightsGenerator';
export { UnifiedFormulaEvaluator, avaliarFormula, testarFormula } from './formulaEvaluator';
export type { 
  IndicadorCalculado, 
  DadosGrupoEmpresa, 
  InsightIA, 
  ResumoPerformance, 
  DashboardInteligenteDados,
  ConfiguracaoSistema as TipoConfiguracaoSistema,
  FaixaFaturamento,
  ConfiguracaoCalculos,
  ParametrosIA,
  ContextoFormula,
  ResultadoFormula
} from './types';
