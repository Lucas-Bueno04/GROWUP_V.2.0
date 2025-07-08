
/**
 * Motor de Cálculo Unificado - Versão Melhorada
 * Centraliza toda a lógica de cálculo e avaliação de fórmulas
 */

import { ValueNormalizer } from './ValueNormalizer';
import { FormulaProcessor } from './FormulaProcessor';
import { HierarchicalCache } from './HierarchicalCache';
import { CalculationValidator } from './CalculationValidator';
import type { 
  CalculationContext, 
  CalculationResult, 
  AccountValue, 
  GroupValue,
  ValidationResult 
} from './types';

export class UnifiedCalculationEngine {
  private valueNormalizer: ValueNormalizer;
  private formulaProcessor: FormulaProcessor;
  private cache: HierarchicalCache;
  private validator: CalculationValidator;

  constructor() {
    this.valueNormalizer = new ValueNormalizer();
    this.formulaProcessor = new FormulaProcessor(this.valueNormalizer);
    this.cache = new HierarchicalCache();
    this.validator = new CalculationValidator();
  }

  /**
   * Avalia uma fórmula no contexto especificado - VERSÃO SÍNCRONA
   */
  evaluateFormula(
    formula: string,
    context: CalculationContext
  ): CalculationResult {
    console.log('🔧 UnifiedCalculationEngine: Starting formula evaluation (sync)');
    console.log('Formula:', formula);
    console.log('Context:', {
      dataType: context.dataType,
      hasGroups: context.allGroups?.length || 0,
      hasValues: context.valores?.length || 0,
      tipo: context.tipo,
      mes: context.mes,
      isAnnual: context.isAnnual
    });

    try {
      // Validar entrada
      const validationResult = this.validator.validateInput(formula, context);
      if (!validationResult.isValid) {
        console.error('❌ Validation failed:', validationResult.errors);
        return {
          value: 0,
          success: false,
          errors: validationResult.errors,
          metadata: { validationFailed: true }
        };
      }

      // Verificar cache
      const cacheKey = this.cache.generateKey(formula, context);
      const cachedResult = this.cache.get(cacheKey);
      if (cachedResult !== undefined) {
        console.log('✅ Cache hit:', cachedResult);
        return {
          value: cachedResult,
          success: true,
          metadata: { fromCache: true }
        };
      }

      // Processar fórmula de forma síncrona
      const result = this.formulaProcessor.processSync(formula, context);
      
      // Validar resultado
      const resultValidation = this.validator.validateResult(result, context);
      if (!resultValidation.isValid) {
        console.warn('⚠️ Result validation warnings:', resultValidation.warnings);
      }

      // Cachear resultado
      this.cache.set(cacheKey, result.value, context);

      console.log('✅ Formula evaluation completed:', result.value);
      return result;

    } catch (error) {
      console.error('❌ Error in formula evaluation:', error);
      return {
        value: 0,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        metadata: { error: true }
      };
    }
  }

  /**
   * Calcula valor de conta específica
   */
  calculateAccountValue(
    accountCode: string,
    context: CalculationContext
  ): AccountValue {
    console.log('🏦 Calculating account value:', accountCode);
    
    try {
      const cacheKey = this.cache.generateAccountKey(accountCode, context);
      const cached = this.cache.getAccount(cacheKey);
      if (cached !== undefined) {
        console.log('✅ Account cache hit:', cached);
        return { value: cached, fromCache: true };
      }

      const result = this.valueNormalizer.calculateAccountValue(accountCode, context);
      this.cache.setAccount(cacheKey, result);
      
      console.log('✅ Account calculated:', result);
      return { value: result, fromCache: false };

    } catch (error) {
      console.error('❌ Error calculating account:', error);
      return { value: 0, fromCache: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Calcula valor de grupo específico
   */
  calculateGroupValue(
    grupo: any,
    context: CalculationContext
  ): GroupValue {
    console.log('📊 Calculating group value:', grupo.codigo);
    
    try {
      const cacheKey = this.cache.generateGroupKey(grupo.id, context);
      const cached = this.cache.getGroup(cacheKey);
      if (cached !== undefined) {
        console.log('✅ Group cache hit:', cached);
        return { value: cached, fromCache: true };
      }

      let result: number;
      
      if (grupo.tipo_calculo === 'soma') {
        result = this.valueNormalizer.calculateGroupSum(grupo, context);
      } else if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
        const formulaResult = this.formulaProcessor.processSync(grupo.formula, context);
        result = formulaResult.value;
      } else {
        console.warn('⚠️ Unsupported group calculation type:', grupo.tipo_calculo);
        result = 0;
      }

      this.cache.setGroup(cacheKey, result);
      
      console.log('✅ Group calculated:', result);
      return { value: result, fromCache: false };

    } catch (error) {
      console.error('❌ Error calculating group:', error);
      return { value: 0, fromCache: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Valida integridade do sistema
   */
  validateSystem(context: CalculationContext): ValidationResult {
    return this.validator.validateSystem(context);
  }
}

// Instância singleton
export const calculationEngine = new UnifiedCalculationEngine();
