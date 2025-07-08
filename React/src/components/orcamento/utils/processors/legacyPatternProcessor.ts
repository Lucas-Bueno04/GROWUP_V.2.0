
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from '../types';
import { calculateGroupValueForMonth } from '../valueCalculator';
import { calculateGroupValueAnnual } from '../annualCalculator';

export function processLegacyNumericPatterns(
  formula: string,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number,
  cache: CalculationCache,
  isAnnual = false
): string {
  let processedFormula = formula;
  
  console.log('No G-pattern, C-pattern, or CONTA_X_Y pattern found, checking for legacy numeric patterns...');
  
  // Processar padrões numéricos apenas se não há padrões G, C ou CONTA_X_Y
  const numericMatches = processedFormula.match(/\b(\d+)\b/g);
  if (numericMatches) {
    console.log(`Found numeric patterns (legacy mode): ${numericMatches.join(', ')}`);
    console.log(`Processing for ${isAnnual ? 'annual' : 'monthly'} calculation`);
    
    const uniqueNumbers = [...new Set(numericMatches)];
    
    uniqueNumbers.forEach(numberStr => {
      const referencedGroup = allGroups.find(g => g.codigo === numberStr);
      
      if (referencedGroup) {
        console.log(`Legacy mode: Treating ${numberStr} as group reference`);
        
        let groupValue;
        
        if (isAnnual) {
          groupValue = cache[referencedGroup.id]?.annual;
          
          if (groupValue === undefined) {
            console.log(`Cache miss for legacy annual ${numberStr}, calculating...`);
            groupValue = calculateGroupValueAnnual(
              referencedGroup,
              allGroups,
              contas,
              valores,
              tipo,
              cache
            );
          }
        } else {
          groupValue = cache[referencedGroup.id]?.[mes];
          
          if (groupValue === undefined) {
            console.log(`Cache miss for legacy ${numberStr}, calculating...`);
            groupValue = calculateGroupValueForMonth(
              referencedGroup,
              allGroups,
              contas,
              valores,
              tipo,
              mes,
              cache
            );
          }
        }
        
        console.log(`Replacing legacy ${numberStr} with ${groupValue}`);
        processedFormula = processedFormula.replace(
          new RegExp(`\\b${numberStr}\\b`, 'g'),
          groupValue.toString()
        );
      } else {
        console.log(`Number ${numberStr} is not a group code, keeping as literal`);
      }
    });
  }

  return processedFormula;
}
