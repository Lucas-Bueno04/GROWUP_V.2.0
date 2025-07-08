
/**
 * Verifica se um indicador precisa de correção para despesas
 */
export function shouldCorrectForExpenses(indicador: any, formula: string): boolean {
  // Indicadores de margem que trabalham com despesas podem precisar de correção
  const isMarginIndicator = indicador.nome?.toLowerCase().includes('margem') ||
                           indicador.codigo?.toLowerCase().includes('margin') ||
                           formula.includes('*100') || 
                           formula.includes('* 100');
  
  // Verifica se a fórmula referencia grupos de despesas (5, 6, 7, 8)
  const hasExpenseGroups = /[G5678]/.test(formula);
  
  console.log(`Expense correction check for ${indicador.nome}: isMargin=${isMarginIndicator}, hasExpenseGroups=${hasExpenseGroups}`);
  
  return false; // Por enquanto, desabilitamos correções automáticas
}

/**
 * Aplica correção na fórmula para indicadores de despesas
 */
export function correctFormulaForExpenses(formula: string, grupos: any[]): string {
  console.log('Applying expense correction to formula:', formula);
  
  // Por enquanto, retorna a fórmula original sem modificações
  return formula;
}
