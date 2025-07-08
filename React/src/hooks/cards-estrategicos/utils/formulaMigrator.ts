/**
 * Migra fórmulas para a nova sintaxe unificada
 */
export function migrateFormulaToNewSyntax(formula: string, grupos: any[]): string {
  let migratedFormula = formula;
  
  console.log('Migrating formula:', formula);
  
  // Check if formula already uses new G-syntax
  if (formula.includes('G') && formula.match(/G\d+/)) {
    console.log('Formula already uses new G-syntax, no migration needed');
    return formula;
  }
  
  // Check if formula uses CONTA_ patterns - keep as is
  if (formula.includes('CONTA_')) {
    console.log('Formula uses CONTA_ patterns, checking for other migrations');
    // Still check for group references that might need migration
  }
  
  // Check if formula uses C{code} patterns - keep as is for now
  if (formula.match(/C[\d\.]+/) && !formula.includes('CONTA_')) {
    console.log('Formula uses C{code} patterns, keeping as is');
    return formula;
  }
  
  // Migrate numeric group references to G{number} format
  const groupCodes = grupos.map(g => g.codigo);
  console.log('Available group codes:', groupCodes);
  
  // Find numeric patterns that match group codes
  const numericMatches = formula.match(/\b(\d+)\b/g);
  if (numericMatches) {
    console.log('Found numeric patterns:', numericMatches);
    
    numericMatches.forEach(numericPattern => {
      // Only migrate if it matches a group code and isn't part of CONTA_ or large number
      if (groupCodes.includes(numericPattern) && parseInt(numericPattern) <= 20) {
        const regex = new RegExp(`\\b${numericPattern}\\b`, 'g');
        migratedFormula = migratedFormula.replace(regex, `G${numericPattern}`);
        console.log(`Migrated ${numericPattern} to G${numericPattern}`);
      }
    });
  }
  
  console.log('Migrated formula:', migratedFormula);
  return migratedFormula;
}

/**
 * Converte códigos de conta com pontos para formato CONTA_X_Y
 */
export function convertAccountCodeToContaFormat(accountCode: string): string {
  const codeWithUnderscores = accountCode.replace(/\./g, '_');
  return `CONTA_${codeWithUnderscores}`;
}

/**
 * Converte formato CONTA_X_Y de volta para código com pontos
 */
export function convertContaFormatToAccountCode(contaFormat: string): string {
  if (!contaFormat.startsWith('CONTA_')) {
    return contaFormat;
  }
  
  const codeWithUnderscores = contaFormat.replace('CONTA_', '');
  return codeWithUnderscores.replace(/_/g, '.');
}

export function validateFormulaSyntax(formula: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Verificar se há mistura de sintaxes
  const hasGPattern = /G\d+/.test(formula);
  const hasNumericPattern = /\b\d+\b/.test(formula);
  
  if (hasGPattern && hasNumericPattern) {
    issues.push('Fórmula mistura sintaxe nova (G1) com antiga (1)');
    suggestions.push('Use apenas G1, G2, G3 para grupos e números sem prefixo para literais');
  }
  
  // Verificar parênteses balanceados
  const openParens = (formula.match(/\(/g) || []).length;
  const closeParens = (formula.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    issues.push('Parênteses não balanceados');
    suggestions.push('Verifique se todos os parênteses estão fechados corretamente');
  }
  
  // Verificar operadores válidos
  const invalidChars = formula.match(/[^0-9+\-*/().\sGabs]/g);
  if (invalidChars) {
    issues.push(`Caracteres inválidos encontrados: ${invalidChars.join(', ')}`);
    suggestions.push('Use apenas números, operadores (+, -, *, /), parênteses e funções permitidas (abs)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}
