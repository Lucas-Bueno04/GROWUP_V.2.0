

export interface FaixaFaturamento {
  id: string;
  nome: string;
  valor_minimo: number;
  valor_maximo: number;
  ativa: boolean;
  ordem: number;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConfigCalculos {
  recalcularAutomatico: boolean;
  frequenciaCalculoMedias: 'mensal' | 'trimestral' | 'anual';
  minimoEmpresasPorGrupo: number;
  precisaoDecimal: number;
}

export interface ParametrosIA {
  confiancaMinima: number;
  gerarInsightsAutomatico: boolean;
  categoriasInsights: string[];
}

export interface DashboardData {
  financeiro: any;
  insights: any[];
  medias: any[];
}

// Tipos para indicadores calculados
export interface IndicadorCalculado {
  codigo: string;
  nome: string;
  unidade: string;
  melhorQuando: 'maior' | 'menor';
  formula: string;
  valorEmpresa: number;
  valorGrupo: number;
  valorGeral: number;
  performanceVsGrupo: number;
  performanceVsGeral: number;
}

// Tipos para resumo de performance
export interface ResumoPerformance {
  totalIndicadores: number;
  acimaGrupo: number;
  abaixoGrupo: number;
  acimaGeral: number;
  abaixoGeral: number;
}

// Tipos para dados de grupo de empresa
export interface DadosGrupoEmpresa {
  grupoTipo: string;
  grupoValor: string;
  empresaId: string;
}

// Tipos para insights de IA
export interface InsightIA {
  tipo: 'oportunidade' | 'alerta' | 'tendencia' | 'recomendacao';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  confianca: number;
  acoes: string[];
}

// Tipos para dashboard inteligente
export interface DashboardInteligenteDados {
  indicadores: IndicadorCalculado[];
  insights: InsightIA[];
  performanceScore: number;
  resumoPerformance: ResumoPerformance;
  dadosGrupo: DadosGrupoEmpresa | null;
}

// Tipos para configuração do sistema
export interface ConfiguracaoSistema {
  faixasFaturamento: FaixaFaturamento[];
  configCalculos: ConfigCalculos;
  parametrosIA: ParametrosIA;
}

// Tipos para contexto de fórmula
export interface ContextoFormula {
  empresa_id: string;
  ano: number;
  valores_orcamentarios: Record<string, number>;
  indicadores_anteriores: Record<string, number>;
}

// Tipos para resultado de fórmula
export interface ResultadoFormula {
  valor: number;
  sucesso: boolean;
  erro?: string;
  detalhes?: {
    formula_usada?: string;
    variaveis_encontradas?: string[];
    variaveis_nao_encontradas?: string[];
  };
}

// Alias para compatibilidade com código existente
export type ConfiguracaoCalculos = ConfigCalculos;

