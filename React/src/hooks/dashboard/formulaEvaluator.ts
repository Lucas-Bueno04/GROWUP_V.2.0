
import type { ContextoFormula, ResultadoFormula } from './types';

/**
 * Avaliador unificado de fórmulas para indicadores
 * Suporte a:
 * - Operações matemáticas básicas
 * - Referências a contas do orçamento (por código)
 * - Funções financeiras
 * - Condicionais simples
 */
export class UnifiedFormulaEvaluator {
  private contexto: ContextoFormula;

  constructor(contexto: ContextoFormula) {
    this.contexto = contexto;
  }

  async avaliarFormula(formula: string): Promise<ResultadoFormula> {
    console.log('=== AVALIANDO FÓRMULA ===');
    console.log('Fórmula:', formula);
    console.log('Contexto:', this.contexto);

    try {
      // Preprocessar a fórmula
      const formulaProcessada = this.preprocessarFormula(formula);
      console.log('Fórmula processada:', formulaProcessada);

      // Extrair variáveis
      const variaveis = this.extrairVariaveis(formulaProcessada);
      console.log('Variáveis encontradas:', variaveis);

      // Resolver variáveis
      const resolucao = await this.resolverVariaveis(variaveis);
      console.log('Resolução de variáveis:', resolucao);

      // Substituir variáveis na fórmula
      let formulaSubstituida = formulaProcessada;
      for (const [variavel, valor] of Object.entries(resolucao.valores)) {
        const regex = new RegExp(`\\b${variavel}\\b`, 'g');
        formulaSubstituida = formulaSubstituida.replace(regex, valor.toString());
      }

      console.log('Fórmula com variáveis substituídas:', formulaSubstituida);

      // Avaliar matematicamente
      const resultado = this.avaliarExpressaoMatematica(formulaSubstituida);

      return {
        valor: resultado,
        sucesso: true,
        detalhes: {
          formula_usada: formulaSubstituida,
          variaveis_encontradas: resolucao.encontradas,
          variaveis_nao_encontradas: resolucao.naoEncontradas
        }
      };

    } catch (error) {
      console.error('Erro ao avaliar fórmula:', error);
      return {
        valor: 0,
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private preprocessarFormula(formula: string): string {
    // Remover espaços desnecessários
    let processada = formula.trim();

    // Converter funções especiais
    processada = processada.replace(/SUM\((.*?)\)/g, '($1)');
    processada = processada.replace(/ABS\((.*?)\)/g, 'Math.abs($1)');
    processada = processada.replace(/MAX\((.*?)\)/g, 'Math.max($1)');
    processada = processada.replace(/MIN\((.*?)\)/g, 'Math.min($1)');

    // Normalizar operadores
    processada = processada.replace(/×/g, '*');
    processada = processada.replace(/÷/g, '/');

    return processada;
  }

  private extrairVariaveis(formula: string): string[] {
    // Extrair códigos de contas (formato: C.1.01.001 ou similar)
    const padraoConta = /C\.\d+(?:\.\d+)*/g;
    const contasEncontradas = formula.match(padraoConta) || [];

    // Extrair outras variáveis alfanuméricas (excluindo funções matemáticas)
    const padraoVariavel = /\b[A-Za-z][A-Za-z0-9_]*\b/g;
    const variaveisEncontradas = formula.match(padraoVariavel) || [];

    // Filtrar funções matemáticas conhecidas
    const funcoesMatematicas = ['Math', 'abs', 'max', 'min', 'pow', 'sqrt', 'sin', 'cos', 'tan'];
    const variaveis = variaveisEncontradas.filter(v => !funcoesMatematicas.includes(v));

    return [...new Set([...contasEncontradas, ...variaveis])];
  }

  private async resolverVariaveis(variaveis: string[]): Promise<{
    valores: Record<string, number>;
    encontradas: string[];
    naoEncontradas: string[];
  }> {
    const valores: Record<string, number> = {};
    const encontradas: string[] = [];
    const naoEncontradas: string[] = [];

    for (const variavel of variaveis) {
      let valor: number | null = null;

      // Tentar resolver como conta do orçamento
      if (variavel.startsWith('C.')) {
        valor = await this.resolverContaOrcamento(variavel);
      } else {
        // Tentar resolver como indicador anterior ou variável personalizada
        valor = this.resolverIndicadorAnterior(variavel);
      }

      if (valor !== null) {
        valores[variavel] = valor;
        encontradas.push(variavel);
      } else {
        // Usar valor padrão para evitar erro na avaliação
        valores[variavel] = 0;
        naoEncontradas.push(variavel);
      }
    }

    return { valores, encontradas, naoEncontradas };
  }

  private async resolverContaOrcamento(codigoConta: string): Promise<number | null> {
    // Remover o prefixo 'C.' para buscar o código real
    const codigo = codigoConta.replace('C.', '');

    // Buscar nos valores orçamentários do contexto
    if (this.contexto.valores_orcamentarios[codigo]) {
      return this.contexto.valores_orcamentarios[codigo];
    }

    // Se não encontrar no contexto, tentar buscar no banco
    // (implementação simplificada - na versão real, faria query ao Supabase)
    return null;
  }

  private resolverIndicadorAnterior(nomeIndicador: string): number | null {
    return this.contexto.indicadores_anteriores[nomeIndicador] || null;
  }

  private avaliarExpressaoMatematica(expressao: string): number {
    // Validar se a expressão é segura (apenas números, operadores e funções Math)
    const expressaoSegura = /^[0-9+\-*/.(),\sMath\s]+$/;
    if (!expressaoSegura.test(expressao)) {
      throw new Error('Expressão matemática contém caracteres não permitidos');
    }

    try {
      // Usar Function ao invés de eval para maior segurança
      const funcao = new Function('Math', `return ${expressao}`);
      const resultado = funcao(Math);

      if (typeof resultado !== 'number' || !isFinite(resultado)) {
        throw new Error('Resultado da avaliação não é um número válido');
      }

      return resultado;
    } catch (error) {
      throw new Error(`Erro ao avaliar expressão matemática: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}

// Função auxiliar para usar o avaliador
export async function avaliarFormula(
  formula: string, 
  contexto: ContextoFormula
): Promise<ResultadoFormula> {
  const avaliador = new UnifiedFormulaEvaluator(contexto);
  return await avaliador.avaliarFormula(formula);
}

// Função para testar fórmulas
export async function testarFormula(formula: string): Promise<ResultadoFormula> {
  const contextoTeste: ContextoFormula = {
    empresa_id: 'teste',
    ano: new Date().getFullYear(),
    valores_orcamentarios: {
      '3.01.001': 100000, // Receita Bruta
      '3.01.002': 15000,  // Impostos sobre Vendas
      '4.01.001': 60000,  // CMV
      '5.01.001': 20000   // Despesas Operacionais
    },
    indicadores_anteriores: {
      'margem_bruta': 25.0,
      'liquidez_corrente': 1.5
    }
  };

  return await avaliarFormula(formula, contextoTeste);
}
