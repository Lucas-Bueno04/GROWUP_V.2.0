
/**
 * Processador de Fórmulas - Centraliza processamento de padrões e avaliação
 * VERSÃO CORRIGIDA: Melhora o tratamento de fórmulas e indicadores percentuais
 */

import { evaluateExpression } from '@/utils/safeExpressionEvaluator';
import type { CalculationContext, CalculationResult, FormulaPattern } from './types';
import type { ValueNormalizer } from './ValueNormalizer';

export class FormulaProcessor {
  private patterns: FormulaPattern[] = [];
  private valueNormalizer: ValueNormalizer;
  private recursionDepth = 0;
  private maxRecursionDepth = 10;

  constructor(valueNormalizer: ValueNormalizer) {
    this.valueNormalizer = valueNormalizer;
    this.initializePatterns();
  }

  private initializePatterns(): void {
    // Padrão G{número} - Referências a grupos
    this.patterns.push({
      type: 'group',
      pattern: /\bG(\d+)\b/g,
      processor: (match: string, context: CalculationContext) => {
        const groupCode = match.replace('G', '');
        const grupo = context.allGroups.find(g => g.codigo === groupCode);
        
        if (!grupo) {
          console.warn(`Group ${groupCode} not found`);
          return 0;
        }

        // Proteção contra recursão infinita
        if (this.recursionDepth >= this.maxRecursionDepth) {
          console.error(`Max recursion depth reached for group ${groupCode}`);
          return 0;
        }

        // Usar o normalizador de valores para calcular
        if (grupo.tipo_calculo === 'soma') {
          const value = this.valueNormalizer.calculateGroupSum(grupo, context);
          console.log(`🔍 Group ${groupCode} (soma) calculated: ${value}`);
          return value;
        } else if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
          // Processar recursivamente, mas com proteção contra ciclos
          this.recursionDepth++;
          const result = this.processSync(grupo.formula, context);
          this.recursionDepth--;
          console.log(`🔍 Group ${groupCode} (calculado) result: ${result.value}`);
          return result.value;
        }
        
        console.warn(`⚠️ Unknown calculation type for group ${groupCode}: ${grupo.tipo_calculo}`);
        return 0;
      }
    });

    // Padrão CONTA_{código} - Referências a contas
    this.patterns.push({
      type: 'account',
      pattern: /CONTA_([\w\d_]+)/g,
      processor: (match: string, context: CalculationContext) => {
        const accountCode = match.replace('CONTA_', '').replace(/_/g, '.');
        const value = this.valueNormalizer.calculateAccountValue(accountCode, context);
        console.log(`🔍 Account ${match} (${accountCode}) calculated: ${value}`);
        return value;
      }
    });

    // Padrão C{código} - Referências diretas a contas
    this.patterns.push({
      type: 'account',
      pattern: /\bC([\w\d\.]+)\b/g,
      processor: (match: string, context: CalculationContext) => {
        const accountCode = match.replace('C', '');
        const value = this.valueNormalizer.calculateAccountValue(accountCode, context);
        console.log(`🔍 Account ${match} (${accountCode}) calculated: ${value}`);
        return value;
      }
    });
  }

  /**
   * Processa fórmula de forma assíncrona
   */
  async process(
    formula: string,
    context: CalculationContext
  ): Promise<CalculationResult> {
    const startTime = Date.now();
    
    try {
      const result = this.processSync(formula, context);
      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime
        }
      };
    } catch (error) {
      return {
        value: 0,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        metadata: {
          processingTime: Date.now() - startTime,
          error: true
        }
      };
    }
  }

  /**
   * Processa fórmula de forma síncrona - VERSÃO MELHORADA
   */
  processSync(
    formula: string,
    context: CalculationContext
  ): CalculationResult {
    console.log('🔄 Processing formula:', formula);
    console.log('🔄 Context:', {
      dataType: context.dataType,
      tipo: context.tipo,
      mes: context.mes,
      isAnnual: context.isAnnual
    });
    
    let processedFormula = formula.trim();
    const processedPatterns: string[] = [];

    // **CORREÇÃO CRÍTICA**: Processar padrões em ordem específica
    // 1. Primeiro processar grupos G{número}
    // 2. Depois processar contas CONTA_{código}
    // 3. Por último processar contas C{código}

    // Processar padrões G{número} primeiro
    const groupPattern = this.patterns.find(p => p.type === 'group');
    if (groupPattern) {
      const matches = [...processedFormula.matchAll(groupPattern.pattern)];
      
      if (matches.length > 0) {
        console.log(`🔍 Found ${matches.length} group references: ${matches.map(m => m[0]).join(', ')}`);
        
        for (const match of matches) {
          try {
            const value = groupPattern.processor(match[0], context);
            
            // **DEBUG ESPECÍFICO PARA FÓRMULAS CRÍTICAS**
            if (['G3', 'G4', 'G5'].includes(match[0])) {
              console.log(`🎯 CRITICAL GROUP ${match[0]} = ${value}`);
            }
            
            processedFormula = processedFormula.replace(match[0], value.toString());
            processedPatterns.push(`${match[0]} -> ${value}`);
            
          } catch (error) {
            console.error(`Error processing group pattern ${match[0]}:`, error);
            processedFormula = processedFormula.replace(match[0], '0');
          }
        }
      }
    }

    // Processar padrões de conta
    const accountPatterns = this.patterns.filter(p => p.type === 'account');
    for (const pattern of accountPatterns) {
      const matches = [...processedFormula.matchAll(pattern.pattern)];
      
      if (matches.length > 0) {
        console.log(`🔍 Found ${matches.length} account references for pattern ${pattern.pattern}`);
        
        for (const match of matches) {
          try {
            const value = pattern.processor(match[0], context);
            processedFormula = processedFormula.replace(match[0], value.toString());
            processedPatterns.push(`${match[0]} -> ${value}`);
            
          } catch (error) {
            console.error(`Error processing account pattern ${match[0]}:`, error);
            processedFormula = processedFormula.replace(match[0], '0');
          }
        }
      }
    }

    console.log('🔍 Processed patterns:', processedPatterns);
    console.log('🔍 Final formula before evaluation:', processedFormula);

    // **TRATAMENTO ESPECIAL PARA INDICADORES PERCENTUAIS**
    const result = this.evaluateFormulaWithPercentageHandling(processedFormula, formula, context);

    console.log('✅ Formula processed successfully:', result.value);
    return {
      ...result,
      metadata: {
        processedPatterns,
        finalFormula: processedFormula,
        originalFormula: formula
      }
    };
  }

  /**
   * **NOVO MÉTODO**: Avalia fórmula com tratamento especial para percentuais
   */
  private evaluateFormulaWithPercentageHandling(
    processedFormula: string,
    originalFormula: string,
    context: CalculationContext
  ): CalculationResult {
    try {
      // Detectar se é um indicador percentual
      const isPercentageIndicator = this.isPercentageFormula(originalFormula, context);
      
      if (isPercentageIndicator) {
        console.log('📊 Detected percentage indicator, applying special handling');
        return this.evaluatePercentageFormula(processedFormula, context);
      }
      
      // Avaliação normal para não-percentuais
      const result = evaluateExpression(processedFormula);
      return {
        value: result,
        success: true
      };
      
    } catch (error) {
      console.error('❌ Error evaluating expression:', error);
      return {
        value: 0,
        success: false,
        errors: [error instanceof Error ? error.message : 'Expression evaluation failed']
      };
    }
  }

  /**
   * **NOVO MÉTODO**: Detecta se é uma fórmula de percentual
   */
  private isPercentageFormula(formula: string, context: CalculationContext): boolean {
    // Padrões típicos de fórmulas percentuais
    const percentagePatterns = [
      /\(\s*G\d+\s*\/\s*G\d+\s*\)\s*\*\s*100/, // (G4/G3)*100
      /G\d+\s*\/\s*G\d+\s*\*\s*100/, // G4/G3*100
      /\(\s*.*\s*\/\s*.*\s*\)\s*\*\s*100/ // Divisão geral * 100
    ];
    
    return percentagePatterns.some(pattern => pattern.test(formula));
  }

  /**
   * **NOVO MÉTODO**: Avalia fórmulas percentuais com proteção contra divisão por zero
   */
  private evaluatePercentageFormula(formula: string, context: CalculationContext): CalculationResult {
    console.log('📊 Evaluating percentage formula:', formula);
    
    try {
      // Detectar padrão de divisão
      const divisionMatch = formula.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
      
      if (divisionMatch) {
        const numerator = parseFloat(divisionMatch[1]);
        const denominator = parseFloat(divisionMatch[2]);
        
        console.log(`📊 Division detected: ${numerator} / ${denominator}`);
        
        // Proteção contra divisão por zero
        if (denominator === 0) {
          console.warn('⚠️ Division by zero detected in percentage formula');
          return {
            value: 0,
            success: true,
            warnings: ['Division by zero - returning 0%']
          };
        }
        
        // Continuar com avaliação normal se denominador não é zero
      }
      
      const result = evaluateExpression(formula);
      console.log(`📊 Percentage result: ${result}%`);
      
      return {
        value: result,
        success: true
      };
      
    } catch (error) {
      console.error('❌ Error in percentage evaluation:', error);
      return {
        value: 0,
        success: false,
        errors: [error instanceof Error ? error.message : 'Percentage evaluation failed']
      };
    }
  }
}
