
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import type { CalculationCache } from '../types';
import { calculateGroupValueForMonth } from '../valueCalculator';
import { calculateGroupValueAnnual } from '../annualCalculator';

export function processGPatterns(
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
  
  console.log('=== G PATTERN PROCESSOR ===');
  console.log('Input formula:', formula);
  console.log('Processing for:', isAnnual ? 'annual' : `month ${mes}`);
  console.log('Cache state:', Object.keys(cache).length > 0 ? Object.keys(cache).map(key => `${key}: ${Object.keys(cache[key] || {}).join(',')}`) : 'empty');
  
  // **CRITICAL FIX**: Process G-patterns with word boundaries and correct dependency order
  const gMatches = processedFormula.match(/\bG(\d+)\b/g);
  if (gMatches) {
    console.log(`Found G-pattern group references: ${gMatches.join(', ')}`);
    
    // **CRITICAL**: Sort G-patterns to ensure dependencies are calculated first
    // This ensures G1, G2 are calculated before G3 (which depends on them)
    const sortedGMatches = [...new Set(gMatches)].sort((a, b) => {
      const numA = parseInt(a.replace('G', ''));
      const numB = parseInt(b.replace('G', ''));
      return numA - numB;
    });
    
    console.log(`Processing G-patterns in dependency order: ${sortedGMatches.join(', ')}`);
    
    // Process each G pattern individually and replace immediately
    sortedGMatches.forEach(groupPattern => {
      // Extract only the number from the G{number} pattern
      const groupNumber = groupPattern.replace('G', '');
      const referencedGroup = allGroups.find(g => g.codigo === groupNumber);
      
      if (referencedGroup) {
        console.log(`Processing group ${groupPattern}:`, {
          id: referencedGroup.id,
          codigo: referencedGroup.codigo,
          nome: referencedGroup.nome,
          tipo_calculo: referencedGroup.tipo_calculo,
          formula: referencedGroup.formula || 'N/A'
        });
        
        let groupValue;
        
        if (isAnnual) {
          // For annual calculations
          groupValue = cache[referencedGroup.id]?.annual;
          
          if (groupValue === undefined) {
            console.log(`Cache miss for annual ${groupPattern}, calculating...`);
            groupValue = calculateGroupValueAnnual(
              referencedGroup,
              allGroups,
              contas,
              valores,
              tipo,
              cache
            );
            console.log(`Calculated annual value for ${groupPattern}: ${groupValue}`);
          } else {
            console.log(`Using cached annual value for ${groupPattern}: ${groupValue}`);
          }
        } else {
          // For monthly calculations
          groupValue = cache[referencedGroup.id]?.[mes];
          
          if (groupValue === undefined) {
            console.log(`Cache miss for ${groupPattern} month ${mes}, calculating...`);
            groupValue = calculateGroupValueForMonth(
              referencedGroup,
              allGroups,
              contas,
              valores,
              tipo,
              mes,
              cache
            );
            console.log(`Calculated monthly value for ${groupPattern} month ${mes}: ${groupValue}`);
          } else {
            console.log(`Using cached value for ${groupPattern} month ${mes}: ${groupValue}`);
          }
        }
        
        console.log(`Group ${groupPattern} final calculated value: ${groupValue}`);
        console.log(`Before replacement - Formula: "${processedFormula}"`);
        
        // **CRITICAL**: Use word boundaries to ensure exact replacement
        // This prevents G1 from being replaced when processing G10, etc.
        const regex = new RegExp(`\\b${groupPattern}\\b`, 'g');
        const beforeReplacement = processedFormula;
        processedFormula = processedFormula.replace(regex, groupValue.toString());
        
        console.log(`After replacement - Formula: "${processedFormula}"`);
        
        // Verify the replacement worked correctly
        if (beforeReplacement === processedFormula) {
          console.warn(`⚠️ WARNING: No replacement occurred for ${groupPattern}. Pattern not found in formula.`);
        } else {
          console.log(`✅ Successfully replaced ${groupPattern} with ${groupValue}`);
        }
      } else {
        console.error(`❌ Group with code ${groupNumber} not found for pattern ${groupPattern}`);
        console.log('Available group codes:', allGroups.map(g => g.codigo));
        
        // Replace with 0 if group not found to prevent formula evaluation errors
        const regex = new RegExp(`\\b${groupPattern}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, '0');
        console.log(`Replaced missing ${groupPattern} with 0`);
      }
    });
  } else {
    console.log('No G-pattern references found in formula');
  }

  console.log(`Final processed formula: "${processedFormula}"`);
  console.log('=== END G PATTERN PROCESSOR ===');
  return processedFormula;
}
