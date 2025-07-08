

import { calculationEngine } from '../engine';
import type { CalculationContext } from '../engine/types';
import type { EvaluationCache } from './types';

export function calculateAnaliseOrcamentariaGroupValue(
  grupo: any,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number,
  cache: EvaluationCache = {}
): number {
  console.log(`📊 === IMPROVED GROUP CALCULATOR ===`);
  console.log(`Group: ${grupo.codigo} (${grupo.nome}), Type: ${tipo}, Month: ${mes || 'all'}`);

  // Verificar cache legado primeiro (para compatibilidade)
  const cacheKey = `${grupo.id}_${mes || 'annual'}_${tipo}`;
  if (cache[cacheKey] !== undefined) {
    console.log(`Using legacy cache for ${grupo.codigo}: ${cache[cacheKey]}`);
    return cache[cacheKey];
  }

  // Criar contexto para o novo motor
  const context: CalculationContext = {
    allGroups,
    valores,
    tipo,
    mes,
    isAnnual: !mes,
    dataType: 'analise_orcamentaria'
  };

  try {
    const result = calculationEngine.calculateGroupValue(grupo, context);
    
    // Manter compatibilidade com cache legado
    cache[cacheKey] = result.value;
    
    console.log(`✅ Group ${grupo.codigo} calculated: ${result.value}`);
    return result.value;
  } catch (error) {
    console.error(`❌ Error calculating group ${grupo.codigo}:`, error);
    return 0;
  }
}
