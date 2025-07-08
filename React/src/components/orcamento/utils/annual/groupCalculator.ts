
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from '../types';
import { evaluateFormulaAnnual } from './formulaEvaluator';
import { calculateAccountValueAnnual } from './accountCalculator';

export function calculateGroupValueAnnual(
  grupo: any,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  cache: CalculationCache
): number {
  console.log(`=== ANNUAL GROUP CALCULATION FOR ${grupo.codigo} ===`);
  console.log(`Group details:`, {
    id: grupo.id,
    codigo: grupo.codigo,
    nome: grupo.nome,
    tipo_calculo: grupo.tipo_calculo,
    formula: grupo.formula || 'N/A'
  });
  
  // Check cache first
  const cacheKey = grupo.id;
  if (cache[cacheKey]?.annual !== undefined) {
    const cachedValue = cache[cacheKey].annual;
    console.log(`✅ Using cached annual value for ${grupo.codigo}: ${cachedValue}`);
    return cachedValue;
  }
  
  let result = 0;
  
  if (grupo.tipo_calculo === 'soma') {
    console.log(`Processing annual sum calculation for group ${grupo.codigo}`);
    
    // Calculate the sum of this group's accounts for all months
    const groupAccounts = contas.filter(conta => conta.grupo_id === grupo.id);
    console.log(`Group ${grupo.codigo} has ${groupAccounts.length} accounts for annual calculation`);
    
    groupAccounts.forEach(conta => {
      const accountAnnualValue = calculateAccountValueAnnual(conta.codigo, contas, valores, tipo);
      result += accountAnnualValue;
      console.log(`  Account ${conta.codigo} annual contribution: ${accountAnnualValue}, running_total=${result}`);
    });
    
    console.log(`✅ Annual sum result for ${grupo.codigo}: ${result}`);
  } else if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
    console.log(`Processing annual calculated formula for ${grupo.codigo}: "${grupo.formula}"`);
    
    // Evaluate the formula for annual calculation
    result = evaluateFormulaAnnual(
      grupo.formula,
      allGroups,
      contas,
      valores,
      tipo,
      cache
    );
    console.log(`✅ Annual formula result for ${grupo.codigo}: ${result}`);
  } else {
    console.warn(`❌ Group ${grupo.codigo} has unsupported calculation type: ${grupo.tipo_calculo}`);
  }
  
  // Cache the result
  if (!cache[cacheKey]) {
    cache[cacheKey] = {};
  }
  cache[cacheKey].annual = result;
  
  console.log(`💾 Cached annual result for ${grupo.codigo}: ${result}`);
  console.log(`=== END ANNUAL GROUP CALCULATION FOR ${grupo.codigo} ===`);
  
  return result;
}
