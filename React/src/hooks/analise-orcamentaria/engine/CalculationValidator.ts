
/**
 * Validador de Cálculos - Valida entrada, processamento e resultados
 */

import type { CalculationContext, ValidationResult } from './types';

export class CalculationValidator {
  
  /**
   * Valida entrada da fórmula
   */
  validateInput(formula: string, context: CalculationContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validar fórmula
    if (!formula || formula.trim().length === 0) {
      errors.push('Formula is empty');
    }

    if (formula.includes('eval') || formula.includes('Function')) {
      errors.push('Formula contains unsafe functions');
    }

    // Validar contexto
    if (!context.allGroups) {
      warnings.push('No groups provided in context');
    }

    if (!context.valores || context.valores.length === 0) {
      warnings.push('No values provided in context');
    }

    if (!['orcado', 'realizado'].includes(context.tipo)) {
      errors.push('Invalid calculation type');
    }

    // Validar estrutura de dados
    if (context.valores && context.valores.length > 0) {
      const firstValue = context.valores[0];
      const hasAnaliseStructure = firstValue.conta && !Array.isArray(firstValue.conta);
      const hasOrcamentoStructure = firstValue.conta_id;
      
      if (!hasAnaliseStructure && !hasOrcamentoStructure) {
        warnings.push('Data structure may be incompatible');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Valida resultado do cálculo
   */
  validateResult(result: any, context: CalculationContext): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (typeof result.value !== 'number') {
      warnings.push('Result value is not a number');
    }

    if (isNaN(result.value)) {
      warnings.push('Result value is NaN');
    }

    if (!isFinite(result.value)) {
      warnings.push('Result value is not finite');
    }

    // Verificar valores muito grandes (possível erro)
    if (Math.abs(result.value) > 1e12) {
      warnings.push('Result value is unusually large');
      suggestions.push('Check for formula errors or scaling issues');
    }

    // Verificar se resultado é sempre zero (possível problema)
    if (result.value === 0 && context.valores && context.valores.length > 0) {
      suggestions.push('Result is zero - verify formula patterns and data structure');
    }

    return {
      isValid: true, // Resultados são sempre "válidos", mas podem ter avisos
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Valida integridade do sistema
   */
  validateSystem(context: CalculationContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Verificar dependências circulares em grupos calculados
    if (context.allGroups) {
      const circularDeps = this.detectCircularDependencies(context.allGroups);
      if (circularDeps.length > 0) {
        errors.push(`Circular dependencies detected: ${circularDeps.join(', ')}`);
        suggestions.push('Review formula references to eliminate circular dependencies');
      }
    }

    // Verificar consistência de dados
    if (context.valores && context.valores.length > 0) {
      const dataConsistency = this.checkDataConsistency(context.valores);
      if (!dataConsistency.isConsistent) {
        warnings.push('Data inconsistencies detected');
        suggestions.push(...dataConsistency.suggestions);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  private detectCircularDependencies(groups: any[]): string[] {
    const circular: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (group: any): void => {
      if (visiting.has(group.codigo)) {
        circular.push(group.codigo);
        return;
      }

      if (visited.has(group.codigo)) {
        return;
      }

      visiting.add(group.codigo);

      if (group.tipo_calculo === 'calculado' && group.formula) {
        const dependencies = this.extractFormulaDependencies(group.formula);
        for (const dep of dependencies) {
          const depGroup = groups.find(g => g.codigo === dep);
          if (depGroup) {
            visit(depGroup);
          }
        }
      }

      visiting.delete(group.codigo);
      visited.add(group.codigo);
    };

    for (const group of groups) {
      if (!visited.has(group.codigo)) {
        visit(group);
      }
    }

    return circular;
  }

  private extractFormulaDependencies(formula: string): string[] {
    const deps: string[] = [];
    const gMatches = formula.match(/\bG(\d+)\b/g);
    
    if (gMatches) {
      deps.push(...gMatches.map(match => match.replace('G', '')));
    }

    return deps;
  }

  private checkDataConsistency(valores: any[]): { isConsistent: boolean; suggestions: string[] } {
    const suggestions: string[] = [];
    
    // Verificar se todos os valores têm estrutura similar
    if (valores.length > 1) {
      const firstKeys = Object.keys(valores[0]).sort();
      const inconsistentStructures = valores.slice(1).some(valor => 
        JSON.stringify(Object.keys(valor).sort()) !== JSON.stringify(firstKeys)
      );
      
      if (inconsistentStructures) {
        suggestions.push('Values have inconsistent data structures');
      }
    }

    // Verificar valores nulos ou inválidos
    const hasInvalidValues = valores.some(valor => {
      const orcado = valor.valor_orcado;
      const realizado = valor.valor_realizado;
      
      return (orcado !== null && orcado !== undefined && isNaN(Number(orcado))) ||
             (realizado !== null && realizado !== undefined && isNaN(Number(realizado)));
    });

    if (hasInvalidValues) {
      suggestions.push('Some values contain invalid numeric data');
    }

    return {
      isConsistent: suggestions.length === 0,
      suggestions
    };
  }
}
