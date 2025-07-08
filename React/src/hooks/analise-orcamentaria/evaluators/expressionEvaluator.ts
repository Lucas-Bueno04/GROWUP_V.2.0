
import { evaluateExpression as safeEvaluateExpression } from '@/utils/safeExpressionEvaluator';

export function evaluateExpressionWithAbs(expression: string): number {
  console.log(`=== EVALUATING EXPRESSION WITH ABS ===`);
  console.log(`Expression: "${expression}"`);
  
  try {
    // **CORREÇÃO CRÍTICA**: Usar avaliador seguro em vez de eval()
    const result = safeEvaluateExpression(expression);
    
    console.log(`Expression evaluation result: ${result}`);
    console.log(`=== END EVALUATING EXPRESSION WITH ABS ===`);
    
    return result;
  } catch (error) {
    console.error(`Error evaluating expression "${expression}":`, error);
    console.log(`=== ERROR IN EXPRESSION EVALUATION ===`);
    return 0;
  }
}
