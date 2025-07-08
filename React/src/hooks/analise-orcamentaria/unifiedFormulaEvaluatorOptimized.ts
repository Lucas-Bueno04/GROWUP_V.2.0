
import { calculationEngine } from './engine';
import type { CalculationContext } from './engine/types';
import { 
  analyzeDataStructure, 
  shouldCalculateAnnual, 
  logDebugInfo, 
  isBreakEvenFormula, 
  logBreakEvenDebug 
} from './evaluators/utils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced unified formula evaluator that uses materialized group values when available
 */
export async function evaluateUnifiedFormulaOptimized(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number,
  indicador?: any,
  isAnnual = false,
  orcamentoEmpresaId?: string
): Promise<number> {
  console.log('🚀 === OPTIMIZED UNIFIED FORMULA EVALUATOR ===');
  console.log('Using materialized values when available');
  
  // Try to use materialized values if orcamentoEmpresaId is provided
  if (orcamentoEmpresaId && formula.includes('G')) {
    try {
      console.log('🔍 Attempting to use materialized group values');
      
      let query = supabase
        .from('orcamento_empresa_grupos_valores')
        .select(`
          grupo_id,
          mes,
          valor_calculado,
          valor_orcado,
          orcamento_grupos!inner(codigo)
        `)
        .eq('orcamento_empresa_id', orcamentoEmpresaId);

      if (mes) {
        query = query.eq('mes', mes);
      }

      const { data: materializedValues, error } = await query;

      if (!error && materializedValues && materializedValues.length > 0) {
        console.log(`✅ Found ${materializedValues.length} materialized values`);
        
        // Replace group references with materialized values
        let processedFormula = formula;
        
        // Process G{number} patterns
        const groupPattern = /G(\d+)/g;
        let match;
        
        while ((match = groupPattern.exec(formula)) !== null) {
          const groupCode = match[1];
          
          // Find materialized values for this group
          const groupMaterializedValues = materializedValues.filter(mv => 
            (mv.orcamento_grupos as any)?.codigo === groupCode
          );
          
          if (groupMaterializedValues.length > 0) {
            let groupValue = 0;
            
            if (mes) {
              // Single month calculation
              const monthValue = groupMaterializedValues.find(mv => mv.mes === mes);
              if (monthValue) {
                groupValue = tipo === 'orcado' ? monthValue.valor_orcado : monthValue.valor_calculado;
                console.log(`📊 Using materialized value for G${groupCode} month ${mes}: ${groupValue}`);
              }
            } else if (isAnnual) {
              // Annual calculation - sum all months
              groupValue = groupMaterializedValues.reduce((sum, mv) => {
                const value = tipo === 'orcado' ? mv.valor_orcado : mv.valor_calculado;
                return sum + value;
              }, 0);
              console.log(`📊 Using materialized annual value for G${groupCode}: ${groupValue}`);
            }
            
            // Replace in formula
            processedFormula = processedFormula.replace(
              new RegExp(`G${groupCode}`, 'g'), 
              groupValue.toString()
            );
          }
        }
        
        // If we successfully replaced all group references, evaluate the formula
        if (!processedFormula.includes('G')) {
          console.log('✅ All group references replaced with materialized values');
          console.log('Final formula:', processedFormula);
          
          try {
            // Safe evaluation of mathematical expression
            const result = Function(`"use strict"; return (${processedFormula})`)();
            console.log('✅ Optimized calculation result:', result);
            return result || 0;
          } catch (evalError) {
            console.warn('⚠️ Error evaluating optimized formula, falling back to standard method:', evalError);
          }
        } else {
          console.log('⚠️ Some group references could not be resolved with materialized values');
        }
      } else {
        console.log('ℹ️ No materialized values found, using standard calculation');
      }
    } catch (error) {
      console.warn('⚠️ Error fetching materialized values, falling back to standard method:', error);
    }
  }

  // Fallback to standard unified formula evaluator
  console.log('🔄 Using standard unified formula evaluator');
  return evaluateUnifiedFormulaStandard(formula, allGroups, valores, tipo, mes, indicador, isAnnual);
}

/**
 * Standard unified formula evaluator (original implementation)
 */
function evaluateUnifiedFormulaStandard(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number,
  indicador?: any,
  isAnnual = false
): number {
  console.log('🚀 === STANDARD UNIFIED FORMULA EVALUATOR ===');
  
  // Detectar tipo de dados
  const dataStructure = analyzeDataStructure(valores);
  let dataType: 'analise_orcamentaria' | 'orcamento' | 'cards_estrategicos';
  
  if (dataStructure.hasAnaliseOrcamentariaData) {
    dataType = 'analise_orcamentaria';
  } else if (dataStructure.hasStructuredData) {
    dataType = 'orcamento';
  } else {
    dataType = 'cards_estrategicos';
  }

  // Criar contexto unificado
  const context: CalculationContext = {
    allGroups,
    valores,
    tipo,
    mes,
    isAnnual: shouldCalculateAnnual(mes, isAnnual),
    indicador,
    dataType
  };

  logDebugInfo(formula, context);

  // Debug específico para Break-even
  if (isBreakEvenFormula(formula, indicador)) {
    logBreakEvenDebug(formula, allGroups, valores, tipo, mes);
  }

  try {
    // Usar o motor de cálculo unificado (agora síncrono)
    const result = calculationEngine.evaluateFormula(formula, context);
    
    console.log('✅ Standard calculation completed:', result.value);
    return result.value;

  } catch (error) {
    console.error('❌ Error in standard calculation:', error);
    return 0;
  }
}

// Re-export the original function for backward compatibility
export { evaluateUnifiedFormulaStandard as evaluateUnifiedFormula };
