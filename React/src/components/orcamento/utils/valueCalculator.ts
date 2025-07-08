
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from './types';
import { evaluateFormulaForMonth } from './formulaEvaluators';

export function calculateGroupValueForMonth(
  grupo: any,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number,
  cache: CalculationCache
): number {
  console.log(`=== CALCULATING GROUP ${grupo.codigo} FOR MONTH ${mes} ===`);
  console.log(`Group details:`, {
    id: grupo.id,
    codigo: grupo.codigo,
    nome: grupo.nome,
    tipo_calculo: grupo.tipo_calculo,
    formula: grupo.formula || 'N/A'
  });
  
  // **CRITICAL**: Check cache first with proper key structure
  const cacheKey = grupo.id;
  if (cache[cacheKey]?.[mes] !== undefined) {
    const cachedValue = cache[cacheKey][mes];
    console.log(`✅ Using cached value for ${grupo.codigo} month ${mes}: ${cachedValue}`);
    return cachedValue;
  }
  
  let result = 0;
  
  if (grupo.tipo_calculo === 'soma') {
    console.log(`Processing sum calculation for group ${grupo.codigo}`);
    
    // Calculate the sum of this group's accounts for the current month
    const groupAccounts = contas.filter(conta => conta.grupo_id === grupo.id);
    console.log(`Group ${grupo.codigo} has ${groupAccounts.length} accounts`);
    
    groupAccounts.forEach(conta => {
      const valor = getValorForConta(conta.id, mes, tipo, valores);
      // **CRITICAL FIX**: Apply the account sign correctly
      // The raw value from database should be applied with the account's intended sign
      const signedValue = conta.sinal === '+' ? valor : -Math.abs(valor);
      result += signedValue;
      console.log(`  Account ${conta.codigo}: raw=${valor}, sinal=${conta.sinal}, applied=${signedValue}, running_total=${result}`);
    });
    
    console.log(`✅ Sum result for ${grupo.codigo} month ${mes}: ${result}`);
  } else if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
    console.log(`Processing calculated formula for ${grupo.codigo}: "${grupo.formula}"`);
    
    // **CRITICAL**: Ensure all dependencies are calculated before evaluating formula
    const dependentGroups = extractGroupDependencies(grupo.formula);
    console.log(`Formula dependencies for ${grupo.codigo}:`, dependentGroups);
    
    // Pre-calculate all dependencies
    dependentGroups.forEach(depGroupCode => {
      const depGroup = allGroups.find(g => g.codigo === depGroupCode);
      if (depGroup && (!cache[depGroup.id] || cache[depGroup.id][mes] === undefined)) {
        console.log(`Pre-calculating dependency ${depGroupCode} for ${grupo.codigo}`);
        calculateGroupValueForMonth(depGroup, allGroups, contas, valores, tipo, mes, cache);
      }
    });
    
    // Now evaluate the formula with all dependencies cached
    result = evaluateFormulaForMonth(
      grupo.formula,
      allGroups,
      contas,
      valores,
      tipo,
      mes,
      cache
    );
    console.log(`✅ Formula result for ${grupo.codigo} month ${mes}: ${result}`);
  } else {
    console.warn(`❌ Group ${grupo.codigo} has unsupported calculation type: ${grupo.tipo_calculo}`);
  }
  
  // **CRITICAL**: Cache the result with proper structure
  if (!cache[cacheKey]) {
    cache[cacheKey] = {};
  }
  cache[cacheKey][mes] = result;
  
  console.log(`💾 Cached result for ${grupo.codigo} month ${mes}: ${result}`);
  console.log(`=== END CALCULATING GROUP ${grupo.codigo} FOR MONTH ${mes} ===`);
  
  return result;
}

export function getValorForConta(
  contaId: string,
  mes: number,
  tipo: 'orcado' | 'realizado',
  valores: OrcamentoEmpresaValor[]
): number {
  const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
  // **CRITICAL FIX**: Return the raw value as stored in database
  // The sign application will be handled at the group level based on account's sinal
  const rawValue = valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  console.log(`Raw value for conta ${contaId} month ${mes}: ${rawValue}`);
  return rawValue || 0;
}

// Helper function to extract G{number} dependencies from formula
function extractGroupDependencies(formula: string): string[] {
  const matches = formula.match(/\bG(\d+)\b/g);
  if (!matches) return [];
  
  return matches.map(match => match.replace('G', '')).filter((value, index, self) => self.indexOf(value) === index);
}
