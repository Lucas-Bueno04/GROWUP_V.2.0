
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

export interface GroupCalculationResult {
  monthlyValues: number[];
  total: number;
}

export interface CalculationCache {
  [groupId: string]: {
    [mes: number]: number;
    annual?: number;
  };
}

export interface DependencyInfo {
  groupId: string;
  dependencies: string[];
}
