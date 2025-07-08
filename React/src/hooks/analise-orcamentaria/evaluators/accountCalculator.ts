
import { calculationEngine } from '../engine';
import type { CalculationContext } from '../engine/types';

export function calculateAnaliseOrcamentariaAccountValue(
  accountCode: string,
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
): number {
  console.log(`🏦 === IMPROVED ACCOUNT CALCULATOR ===`);
  console.log(`Account: ${accountCode}, Type: ${tipo}, Month: ${mes || 'all'}`);

  // Criar contexto para o novo motor
  const context: CalculationContext = {
    allGroups: [], // Não necessário para cálculo de conta
    valores,
    tipo,
    mes,
    isAnnual: !mes,
    dataType: 'analise_orcamentaria'
  };

  try {
    const result = calculationEngine.calculateAccountValue(accountCode, context);
    console.log(`✅ Account ${accountCode} calculated: ${result.value}`);
    return result.value;
  } catch (error) {
    console.error(`❌ Error calculating account ${accountCode}:`, error);
    return 0;
  }
}
