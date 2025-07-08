
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { calculateAccountValueForMonth, calculateAccountValueAnnual } from '../accountValueCalculator';

export function processContaPatterns(
  formula: string,
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number,
  isAnnual = false
): string {
  let processedFormula = formula;
  
  // Processar padrões CONTA_X_Y para códigos com underscores
  const contaMatches = processedFormula.match(/CONTA_([\w\d_]+)/g);
  if (contaMatches) {
    console.log(`=== ORCAMENTO CONTA_X_Y PATTERN PROCESSING ===`);
    console.log(`Found CONTA_X_Y pattern account references: ${contaMatches.join(', ')}`);
    console.log(`Processing for ${isAnnual ? 'annual' : 'monthly'} calculation`);
    
    contaMatches.forEach(accountPattern => {
      // Extrair o código da conta do padrão CONTA_X_Y -> X.Y
      const codeWithUnderscores = accountPattern.replace('CONTA_', '');
      const accountCode = codeWithUnderscores.replace(/_/g, '.');
      console.log(`Processing orcamento account pattern: ${accountPattern} -> code: ${accountCode}`);
      
      const accountValue = isAnnual 
        ? calculateAccountValueAnnual(accountCode, contas, valores, tipo)
        : calculateAccountValueForMonth(accountCode, contas, valores, tipo, mes);
      console.log(`Orcamento account ${accountPattern} calculated value: ${accountValue}`);
      
      processedFormula = processedFormula.replace(
        new RegExp(accountPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        accountValue.toString()
      );
      console.log(`Orcamento formula after replacing ${accountPattern}: "${processedFormula}"`);
    });
    console.log(`=== END ORCAMENTO CONTA_X_Y PATTERN PROCESSING ===`);
  }

  return processedFormula;
}
