
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { IndicadorEmpresa, MetaIndicadorCompleta, MetaIndicadorEmpresaCompleta } from '@/types/metas.types';

export type TipoVisualizacao = 'card' | 'chart' | 'list' | 'trend';

export interface PerformanceMensal {
  mes: number;
  valorMeta: number;
  valorRealizado: number;
  variacao: number;
  variacaoPercentual: number;
  status: 'acima' | 'dentro' | 'abaixo';
}

export interface PerformanceAnual {
  totalRealizado: number;
  totalMeta: number;
  variacaoPercentual: number;
  status: 'acima' | 'dentro' | 'abaixo';
}

export interface PerformanceCompleta {
  mensal: PerformanceMensal[];
  anual: PerformanceAnual;
}

export interface IndicadorEstrategico {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade: string;
  melhorQuando: 'maior' | 'menor';
  valorAtual: number;
  tipo: 'plano-contas' | 'empresa';
  tipoVisualizacao: TipoVisualizacao;
  performance: PerformanceCompleta;
  ordem?: number; // Added ordem property for sorting
}

export interface CardsEstrategicosFilters {
  periodo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  tipoIndicador: 'todos' | 'plano-contas' | 'empresa';
  status: 'todos' | 'acima' | 'dentro' | 'abaixo';
  tipoVisualizacao: 'todos' | TipoVisualizacao;
}
