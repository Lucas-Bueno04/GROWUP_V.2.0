
import type { FaixaFaturamento } from '@/hooks/dashboard/types';

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

export interface ConfiguracaoSistemaData {
  faixasFaturamento: FaixaFaturamento[];
  configCalculos: ConfigCalculos;
  parametrosIA: ParametrosIA;
}

export type CnpjApiStatus = 'not-configured' | 'configured' | 'error';
