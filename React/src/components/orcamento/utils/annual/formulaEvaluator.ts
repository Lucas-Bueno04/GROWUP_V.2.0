
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { calculateAccountValueAnnual } from './accountCalculator';
import { calculateGroupValueAnnual } from './groupCalculator';

export function evaluateFormulaAnnual(
  formula: string,
  allGroups: any[],
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  cache: any
): number {
  let processedFormula = formula.trim();
  console.log(`=== ANNUAL FORMULA EVALUATION ===`);
  console.log(`Evaluating annual formula: "${processedFormula}"`);
  
  try {
    // Process CONTA_X_Y patterns for annual calculation
    const contaMatches = processedFormula.match(/CONTA_([\w\d_]+)/g);
    if (contaMatches) {
      console.log(`Found CONTA_X_Y patterns for annual calculation: ${contaMatches.join(', ')}`);
      
      contaMatches.forEach(accountPattern => {
        const codeWithUnderscores = accountPattern.replace('CONTA_', '');
        const accountCode = codeWithUnderscores.replace(/_/g, '.');
        console.log(`Processing annual account pattern: ${accountPattern} -> code: ${accountCode}`);
        
        const accountValue = calculateAccountValueAnnual(accountCode, contas, valores, tipo);
        console.log(`Annual account ${accountPattern} calculated value: ${accountValue}`);
        
        processedFormula = processedFormula.replace(
          new RegExp(accountPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          accountValue.toString()
        );
        console.log(`Annual formula after replacing ${accountPattern}: "${processedFormula}"`);
      });
    }

    // Process C{código} patterns for annual calculation
    const cMatches = processedFormula.match(/C([\w\d\.]+)/g);
    if (cMatches) {
      console.log(`Found C-pattern references for annual calculation: ${cMatches.join(', ')}`);
      cMatches.forEach(accountPattern => {
        const accountCode = accountPattern.replace('C', '');
        console.log(`Processing annual C-pattern: ${accountPattern} -> code: ${accountCode}`);
        
        const accountValue = calculateAccountValueAnnual(accountCode, contas, valores, tipo);
        console.log(`Annual C-pattern ${accountPattern} calculated value: ${accountValue}`);
        
        processedFormula = processedFormula.replace(
          new RegExp(accountPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          accountValue.toString()
        );
        console.log(`Annual formula after replacing ${accountPattern}: "${processedFormula}"`);
      });
    }

    // Process G{número} patterns for annual calculation
    const gMatches = processedFormula.match(/G(\d+)/g);
    if (gMatches) {
      console.log(`Found G-pattern references for annual calculation: ${gMatches.join(', ')}`);
      gMatches.forEach(groupPattern => {
        const groupNumber = groupPattern.replace('G', '');
        const referencedGroup = allGroups.find(g => g.codigo === groupNumber);
        
        if (referencedGroup) {
          console.log(`Found group for annual ${groupPattern}:`, {
            id: referencedGroup.id,
            codigo: referencedGroup.codigo,
            nome: referencedGroup.nome,
            tipo_calculo: referencedGroup.tipo_calculo
          });
          
          let groupValue = cache[referencedGroup.id]?.annual;
          
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
          } else {
            console.log(`Using cached annual value for ${groupPattern}: ${groupValue}`);
          }
          
          console.log(`Annual group ${groupPattern} calculated value: ${groupValue}`);
          processedFormula = processedFormula.replace(
            new RegExp(groupPattern, 'g'),
            groupValue.toString()
          );
          console.log(`Annual formula after replacing ${groupPattern}: "${processedFormula}"`);
        } else {
          console.warn(`Group with code ${groupNumber} not found for annual pattern ${groupPattern}`);
        }
      });
    }
    
    console.log(`Annual final processed formula before evaluation: "${processedFormula}"`);
    
    // Evaluate the mathematical expression
    const result = evaluateExpression(processedFormula);
    console.log(`Annual formula evaluation result: ${result}`);
    console.log('=== END ANNUAL FORMULA EVALUATION ===');
    return result;
  } catch (error) {
    console.error(`Error evaluating annual formula:`, error);
    console.log('=== ANNUAL FORMULA EVALUATION ERROR ===');
    return 0;
  }
}

function evaluateExpression(expression: string): number {
  console.log(`Evaluating expression: "${expression}"`);
  
  // Replace abs() functions with Math.abs()
  let processedExpression = expression.replace(/abs\(/g, 'Math.abs(');
  
  // Simple and safe mathematical expression evaluator
  const sanitized = processedExpression.replace(/[^0-9+\-*/().\sMath.abs]/g, '');
  
  try {
    const result = new Function('return ' + sanitized)();
    const finalResult = isNaN(result) ? 0 : result;
    console.log(`Expression evaluation result: ${finalResult}`);
    return finalResult;
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return 0;
  }
}
