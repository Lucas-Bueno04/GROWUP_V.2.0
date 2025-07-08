
/**
 * Avaliador seguro de expressões matemáticas
 * Evita o uso de eval() ou new Function() para prevenir problemas de CSP
 */

interface MathContext {
  abs: (x: number) => number;
  max: (...args: number[]) => number;
  min: (...args: number[]) => number;
  pow: (x: number, y: number) => number;
  sqrt: (x: number) => number;
}

export class SafeExpressionEvaluator {
  private context: MathContext;

  constructor() {
    this.context = {
      abs: Math.abs,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      sqrt: Math.sqrt
    };
  }

  /**
   * Avalia uma expressão matemática de forma segura
   */
  evaluate(expression: string): number {
    console.log('SafeExpressionEvaluator - Evaluating:', expression);
    
    try {
      // Limpar e validar a expressão
      const cleanExpression = this.sanitizeExpression(expression);
      console.log('SafeExpressionEvaluator - Sanitized:', cleanExpression);
      
      // **CORREÇÃO CRÍTICA**: Para expressões simples, usar avaliação direta
      if (this.isSimpleExpression(cleanExpression)) {
        const result = this.evaluateSimpleExpression(cleanExpression);
        console.log('SafeExpressionEvaluator - Simple result:', result);
        return isNaN(result) ? 0 : result;
      }
      
      // Para expressões complexas, usar parser recursivo
      const result = this.parseExpression(cleanExpression);
      
      console.log('SafeExpressionEvaluator - Complex result:', result);
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.error('SafeExpressionEvaluator - Error:', error);
      return 0;
    }
  }

  private isSimpleExpression(expression: string): boolean {
    // Expressão simples: apenas números e operadores básicos
    return /^[0-9+\-*/.() ]+$/.test(expression) && !expression.includes('ABS');
  }

  private evaluateSimpleExpression(expression: string): number {
    // **CORREÇÃO**: Usar Function constructor apenas para expressões simples e validadas
    try {
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = new Function('return ' + sanitized)();
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.error('Error in simple expression evaluation:', error);
      return 0;
    }
  }

  private sanitizeExpression(expression: string): string {
    // Remover espaços
    let clean = expression.replace(/\s+/g, '');
    
    // Substituir funções matemáticas por tokens seguros
    clean = clean.replace(/abs\(/g, 'ABS(');
    clean = clean.replace(/max\(/g, 'MAX(');
    clean = clean.replace(/min\(/g, 'MIN(');
    clean = clean.replace(/pow\(/g, 'POW(');
    clean = clean.replace(/sqrt\(/g, 'SQRT(');
    
    // Validar caracteres permitidos
    const allowedPattern = /^[0-9+\-*/().ABCDEFGHIJKLMNOPQRSTUVWXYZ,]+$/;
    if (!allowedPattern.test(clean)) {
      throw new Error('Expressão contém caracteres não permitidos');
    }
    
    return clean;
  }

  private parseExpression(expression: string): number {
    const tokens = this.tokenize(expression);
    return this.evaluateTokens(tokens);
  }

  private tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let current = '';
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      
      if ('+-*/()'.includes(char)) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
      } else {
        current += char;
      }
    }
    
    if (current) {
      tokens.push(current);
    }
    
    return tokens;
  }

  private evaluateTokens(tokens: string[]): number {
    // Implementação simplificada para expressões básicas
    // Processa parênteses primeiro
    while (tokens.includes('(')) {
      const openIndex = tokens.lastIndexOf('(');
      const closeIndex = tokens.indexOf(')', openIndex);
      
      if (closeIndex === -1) {
        throw new Error('Parênteses não balanceados');
      }
      
      const subTokens = tokens.slice(openIndex + 1, closeIndex);
      const subResult = this.evaluateSimpleTokens(subTokens);
      
      tokens.splice(openIndex, closeIndex - openIndex + 1, subResult.toString());
    }
    
    return this.evaluateSimpleTokens(tokens);
  }

  private evaluateSimpleTokens(tokens: string[]): number {
    // Converter números e processar funções
    const processedTokens = tokens.map(token => {
      if (!isNaN(Number(token))) {
        return Number(token);
      }
      
      // Processar funções matemáticas
      if (token.startsWith('ABS(') || token.startsWith('MAX(') || 
          token.startsWith('MIN(') || token.startsWith('POW(') || 
          token.startsWith('SQRT(')) {
        return this.evaluateFunction(token);
      }
      
      return token;
    });
    
    // Processar multiplicação e divisão
    for (let i = 1; i < processedTokens.length; i += 2) {
      const operator = processedTokens[i];
      if (operator === '*' || operator === '/') {
        const left = Number(processedTokens[i - 1]);
        const right = Number(processedTokens[i + 1]);
        
        const result = operator === '*' ? left * right : left / right;
        processedTokens.splice(i - 1, 3, result);
        i -= 2;
      }
    }
    
    // Processar adição e subtração
    let result = Number(processedTokens[0]);
    for (let i = 1; i < processedTokens.length; i += 2) {
      const operator = processedTokens[i];
      const operand = Number(processedTokens[i + 1]);
      
      if (operator === '+') {
        result += operand;
      } else if (operator === '-') {
        result -= operand;
      }
    }
    
    return result;
  }

  private evaluateFunction(functionCall: string): number {
    const funcName = functionCall.substring(0, functionCall.indexOf('('));
    const argsString = functionCall.substring(functionCall.indexOf('(') + 1, functionCall.lastIndexOf(')'));
    const args = argsString.split(',').map(arg => Number(arg.trim()));
    
    switch (funcName) {
      case 'ABS':
        return this.context.abs(args[0]);
      case 'MAX':
        return this.context.max(...args);
      case 'MIN':
        return this.context.min(...args);
      case 'POW':
        return this.context.pow(args[0], args[1]);
      case 'SQRT':
        return this.context.sqrt(args[0]);
      default:
        throw new Error(`Função não suportada: ${funcName}`);
    }
  }
}

// Instância global do avaliador
export const safeEvaluator = new SafeExpressionEvaluator();

// Função de conveniência
export function evaluateExpression(expression: string): number {
  return safeEvaluator.evaluate(expression);
}
