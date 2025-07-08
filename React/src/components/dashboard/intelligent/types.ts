
export interface AIInsight {
  tipo: 'oportunidade' | 'alerta' | 'tendencia' | 'recomendacao';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  confianca: number;
  acoes: string[];
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  resumoExecutivo: string;
  scorePerformance: number;
}

export interface DashboardInteligenteProps {
  empresaId?: string;
}

export interface Indicador {
  codigo: string;
  nome: string;
  valor: number;
  unidade: string;
}

export interface ContextoEmpresa {
  empresaId?: string;
  ano: number;
  mes: number;
  dataAnalise: string;
}

export interface DefaultInsight {
  tipo: string;
  titulo: string;
  descricao: string;
  impacto: string;
  categoria: string;
  prioridade: string;
}
