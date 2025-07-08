
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { GroupCalculationResult } from './types';

export type { GroupCalculationResult } from './types';

// This file is kept for backward compatibility but the actual calculations
// are now done directly in OrcamentoGridTable using the unified formula evaluator
// This ensures consistency with other modules like Análise Orçamentária and Cards Estratégicos

// Legacy function for backward compatibility - now redirects to simplified approach
export function calculateGroupValues(
  grupo: any,
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  allGroups: any[]
): GroupCalculationResult {
  console.log(`=== LEGACY calculateGroupValues - DEPRECATED ===`);
  console.log(`This function is deprecated. Calculations are now done directly in OrcamentoGridTable.`);
  console.log(`Group: ${grupo.codigo}, Type: ${tipo}`);
  
  // Return empty result as this function is no longer used
  return {
    monthlyValues: Array(12).fill(0),
    total: 0
  };
}
