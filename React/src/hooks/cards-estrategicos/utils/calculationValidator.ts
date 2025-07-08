
/**
 * Validador de Cálculos para Cards Estratégicos
 * Testa especificamente EBITDA% e Margem Líquida
 */

import { evaluateUnifiedFormula } from '@/hooks/analise-orcamentaria/unifiedFormulaEvaluator';
import { CardsEstrategicosDebugLogger } from './debugLogger';

export class CalculationValidator {
  static validateEBITDAPercent(
    grupos: any[],
    valores: any[],
    mes?: number
  ): { isValid: boolean; details: any } {
    console.log('🧪 === VALIDATING EBITDA% CALCULATION ===');
    
    try {
      // Calcular componentes individuais
      const g3 = evaluateUnifiedFormula('G3', grupos, valores, 'realizado', mes);
      const g4 = evaluateUnifiedFormula('G4', grupos, valores, 'realizado', mes);
      const g5 = evaluateUnifiedFormula('G5', grupos, valores, 'realizado', mes);
      
      // Calcular EBITDA manualmente
      const ebitdaManual = g3 - g4 - g5;
      
      // Calcular EBITDA% usando fórmula
      const ebitdaPercentFormula = '((G3 - G4 - G5) / G3) * 100';
      const ebitdaPercent = evaluateUnifiedFormula(ebitdaPercentFormula, grupos, valores, 'realizado', mes);
      
      // Calcular EBITDA% manualmente para comparação
      const ebitdaPercentManual = g3 > 0 ? (ebitdaManual / g3) * 100 : 0;
      
      const details = {
        g3_receita: g3,
        g4_custos: g4,
        g5_despesas: g5,
        ebitda_manual: ebitdaManual,
        ebitda_percent_formula: ebitdaPercent,
        ebitda_percent_manual: ebitdaPercentManual,
        difference: Math.abs(ebitdaPercent - ebitdaPercentManual)
      };
      
      // Log detalhado
      CardsEstrategicosDebugLogger.logEBITDACalculation(g3, g4, g5, ebitdaManual, ebitdaPercent);
      
      // Considerar válido se diferença for menor que 0.01%
      const isValid = details.difference < 0.01;
      
      console.log('🧪 EBITDA% Validation result:', { isValid, details });
      return { isValid, details };
      
    } catch (error) {
      console.error('❌ EBITDA% validation error:', error);
      return { isValid: false, details: { error: error.message } };
    }
  }

  static validateNetMargin(
    grupos: any[],
    valores: any[],
    mes?: number
  ): { isValid: boolean; details: any } {
    console.log('🧪 === VALIDATING NET MARGIN CALCULATION ===');
    
    try {
      // Calcular componentes individuais
      const g7 = evaluateUnifiedFormula('G7', grupos, valores, 'realizado', mes);
      const g3 = evaluateUnifiedFormula('G3', grupos, valores, 'realizado', mes);
      
      // Calcular Margem Líquida% usando fórmula
      const marginFormula = '(G7 / G3) * 100';
      const marginPercent = evaluateUnifiedFormula(marginFormula, grupos, valores, 'realizado', mes);
      
      // Calcular Margem Líquida% manualmente para comparação
      const marginPercentManual = g3 > 0 ? (g7 / g3) * 100 : 0;
      
      const details = {
        g7_resultado_liquido: g7,
        g3_receita: g3,
        margin_percent_formula: marginPercent,
        margin_percent_manual: marginPercentManual,
        difference: Math.abs(marginPercent - marginPercentManual)
      };
      
      // Log detalhado
      CardsEstrategicosDebugLogger.logNetMarginCalculation(g7, g3, marginPercent);
      
      // Considerar válido se diferença for menor que 0.01%
      const isValid = details.difference < 0.01;
      
      console.log('🧪 Net Margin Validation result:', { isValid, details });
      return { isValid, details };
      
    } catch (error) {
      console.error('❌ Net Margin validation error:', error);
      return { isValid: false, details: { error: error.message } };
    }
  }

  static runFullValidation(grupos: any[], valores: any[]): void {
    console.log('🧪 === RUNNING FULL CALCULATION VALIDATION ===');
    
    // Validar para alguns meses específicos
    const testMonths = [1, 6, 12];
    
    for (const mes of testMonths) {
      console.log(`\n📅 Validating month ${mes}:`);
      
      const ebitdaValidation = this.validateEBITDAPercent(grupos, valores, mes);
      const marginValidation = this.validateNetMargin(grupos, valores, mes);
      
      console.log(`Month ${mes} - EBITDA% Valid: ${ebitdaValidation.isValid}`);
      console.log(`Month ${mes} - Net Margin Valid: ${marginValidation.isValid}`);
    }
    
    // Validar anual também
    console.log(`\n📅 Validating annual:`);
    const ebitdaValidationAnual = this.validateEBITDAPercent(grupos, valores);
    const marginValidationAnual = this.validateNetMargin(grupos, valores);
    
    console.log(`Annual - EBITDA% Valid: ${ebitdaValidationAnual.isValid}`);
    console.log(`Annual - Net Margin Valid: ${marginValidationAnual.isValid}`);
    
    console.log('🧪 === VALIDATION COMPLETED ===');
  }
}
