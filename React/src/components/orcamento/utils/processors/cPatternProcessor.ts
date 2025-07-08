
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { calculateAccountValueForMonth, calculateAccountValueAnnual } from '../accountValueCalculator';

export function processCPatterns(
  formula: string,
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number,
  isAnnual = false
): string {
  let processedFormula = formula;
  
  // Processar padrões C{código} para referências de contas individuais
  const cMatches = processedFormula.match(/C([\w\d\.]+)/g);
  if (cMatches) {
    console.log(`Found C-pattern account references: ${cMatches.join(', ')}`);
    console.log(`Processing for ${isAnnual ? 'annual' : 'monthly'} calculation`);
    
    cMatches.forEach(accountPattern => {
      const accountCode = accountPattern.replace('C', '');
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
  }

  return processedFormula;
}
