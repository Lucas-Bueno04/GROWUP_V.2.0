
import { evaluateExpression as safeEvaluateExpression } from '@/utils/safeExpressionEvaluator';

export function evaluateExpression(expression: string): number {
  console.log(`=== EVALUATING EXPRESSION ===`);
  console.log(`Expression: "${expression}"`);
  
  try {
    // **CORREÇÃO CRÍTICA**: Usar avaliador seguro
    const result = safeEvaluateExpression(expression);
    
    console.log(`Expression evaluation result: ${result}`);
    console.log(`=== END EVALUATING EXPRESSION ===`);
    
    return result;
  } catch (error) {
    console.error(`Error evaluating expression "${expression}":`, error);
    console.log(`=== ERROR IN EXPRESSION EVALUATION ===`);
    return 0;
  }
}
