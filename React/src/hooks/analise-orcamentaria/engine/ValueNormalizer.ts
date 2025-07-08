/**
 * Normalizador de Valores - Padroniza tratamento de sinais e valores
 * VERSÃO CORRIGIDA: Aplica regras de sinal corretas para Análise Orçamentária
 */

import type { CalculationContext, NormalizationRule } from './types';

export class ValueNormalizer {
  private rules: Map<string, NormalizationRule> = new Map();

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    // Regras para Análise Orçamentária - CORRIGIDAS
    this.rules.set('analise_orcamentaria', {
      dataType: 'analise_orcamentaria',
      accountSignHandling: 'preserve', // Manter valores como vêm do banco
      groupSignHandling: 'sum_accounts' // Somar valores das contas
    });

    // Regras para Orçamento
    this.rules.set('orcamento', {
      dataType: 'orcamento',
      accountSignHandling: 'preserve', // Aplicar sinal da conta
      groupSignHandling: 'sum_accounts' // Somar valores com sinal aplicado
    });

    // Regras para Cards Estratégicos
    this.rules.set('cards_estrategicos', {
      dataType: 'cards_estrategicos',
      accountSignHandling: 'preserve',
      groupSignHandling: 'sum_accounts'
    });
  }

  /**
   * Calcula valor normalizado de uma conta
   */
  calculateAccountValue(
    accountCode: string,
    context: CalculationContext
  ): number {
    console.log('💰 Normalizing account value:', accountCode);
    
    const rule = this.rules.get(context.dataType);
    if (!rule) {
      console.warn('⚠️ No normalization rule found for:', context.dataType);
      return 0;
    }

    if (context.dataType === 'analise_orcamentaria') {
      return this.calculateAnaliseOrcamentariaAccount(accountCode, context);
    } else if (context.dataType === 'orcamento') {
      return this.calculateOrcamentoAccount(accountCode, context);
    }

    return 0;
  }

  /**
   * Calcula soma de grupo normalizada
   */
  calculateGroupSum(
    grupo: any,
    context: CalculationContext
  ): number {
    console.log('📊 Normalizing group sum:', grupo.codigo);
    
    const rule = this.rules.get(context.dataType);
    if (!rule) {
      console.warn('⚠️ No normalization rule found for:', context.dataType);
      return 0;
    }

    if (context.dataType === 'analise_orcamentaria') {
      return this.calculateAnaliseOrcamentariaGroupSum(grupo, context);
    } else if (context.dataType === 'orcamento') {
      return this.calculateOrcamentoGroupSum(grupo, context);
    }

    return 0;
  }

  private calculateAnaliseOrcamentariaAccount(
    accountCode: string,
    context: CalculationContext
  ): number {
    const accountValues = context.valores.filter(valor => {
      if (!valor.conta || Array.isArray(valor.conta)) return false;
      const conta = valor.conta as any;
      
      const matchesAccount = conta.codigo === accountCode;
      const matchesMonth = context.mes ? valor.mes === context.mes : true;
      
      return matchesAccount && matchesMonth;
    });

    let result = 0;
    accountValues.forEach(valor => {
      const valorField = context.tipo === 'orcado' ? 'valor_orcado' : 'valor_realizado';
      const valorRaw = Number(valor[valorField]) || 0;
      
      // **CORREÇÃO CRÍTICA**: Para Análise Orçamentária, aplicar regras de sinal baseadas no grupo
      const conta = valor.conta as any;
      const grupo = conta.grupo as any;
      const signedValue = this.applyAnaliseOrcamentariaSignRules(valorRaw, grupo?.codigo, accountCode);
      
      result += signedValue;
    });

    console.log(`Account ${accountCode} normalized value: ${result}`);
    return result;
  }

  private calculateAnaliseOrcamentariaGroupSum(
    grupo: any,
    context: CalculationContext
  ): number {
    const groupValues = context.valores.filter(valor => {
      if (!valor.conta || Array.isArray(valor.conta)) return false;
      const conta = valor.conta as any;
      if (!conta.grupo || Array.isArray(conta.grupo)) return false;
      const grupoAssociado = conta.grupo as any;
      
      const matchesGroup = grupoAssociado.id === grupo.id;
      const matchesMonth = context.mes ? valor.mes === context.mes : true;
      
      return matchesGroup && matchesMonth;
    });

    let result = 0;
    groupValues.forEach(valor => {
      const valorField = context.tipo === 'orcado' ? 'valor_orcado' : 'valor_realizado';
      const valorRaw = Number(valor[valorField]) || 0;
      
      // **CORREÇÃO CRÍTICA**: Para grupos de soma, aplicar regras de sinal corretas
      const conta = valor.conta as any;
      const signedValue = this.applyAnaliseOrcamentariaSignRules(valorRaw, grupo.codigo, conta.codigo);
      
      result += signedValue;
    });

    console.log(`Group ${grupo.codigo} sum normalized value: ${result}`);
    return result;
  }

  /**
   * **MÉTODO CRÍTICO**: Aplica regras de sinal específicas para Análise Orçamentária
   */
  private applyAnaliseOrcamentariaSignRules(
    rawValue: number,
    groupCode: string,
    accountCode: string
  ): number {
    console.log(`🔧 Applying sign rules for group ${groupCode}, account ${accountCode}, raw value: ${rawValue}`);
    
    // **REGRAS ESPECÍFICAS PARA ANÁLISE ORÇAMENTÁRIA**:
    
    // Grupo 3: Receita Líquida - valores positivos (receitas)
    if (groupCode === '3') {
      const result = Math.abs(rawValue); // Sempre positivo para receitas
      console.log(`✅ Group 3 (Receita): ${rawValue} -> ${result}`);
      return result;
    }
    
    // Grupo 4: Custos Operacionais - valores positivos (custos como valores positivos)
    if (groupCode === '4') {
      const result = Math.abs(rawValue); // Sempre positivo para custos
      console.log(`✅ Group 4 (Custos): ${rawValue} -> ${result}`);
      return result;
    }
    
    // Grupo 5: Despesas Operacionais - valores positivos (despesas como valores positivos)
    if (groupCode === '5') {
      const result = Math.abs(rawValue); // Sempre positivo para despesas
      console.log(`✅ Group 5 (Despesas): ${rawValue} -> ${result}`);
      return result;
    }
    
    // Grupo 6: Resultado Financeiro - manter sinal original
    if (groupCode === '6') {
      console.log(`✅ Group 6 (Financeiro): ${rawValue} -> ${rawValue}`);
      return rawValue;
    }
    
    // Grupo 1: Ativo - valores positivos
    if (groupCode === '1') {
      const result = Math.abs(rawValue);
      console.log(`✅ Group 1 (Ativo): ${rawValue} -> ${result}`);
      return result;
    }
    
    // Grupo 2: Passivo - valores positivos
    if (groupCode === '2') {
      const result = Math.abs(rawValue);
      console.log(`✅ Group 2 (Passivo): ${rawValue} -> ${result}`);
      return result;
    }
    
    // Para outros grupos, manter valor absoluto por segurança
    const result = Math.abs(rawValue);
    console.log(`⚠️ Default rule for group ${groupCode}: ${rawValue} -> ${result}`);
    return result;
  }

  private calculateOrcamentoAccount(
    accountCode: string,
    context: CalculationContext
  ): number {
    // Extrair contas do contexto estruturado
    const contas = this.extractContasFromContext(context);
    const conta = contas.find(c => c.codigo === accountCode);
    
    if (!conta) {
      console.warn(`Account ${accountCode} not found`);
      return 0;
    }

    const accountValues = context.valores.filter(valor => {
      const matchesAccount = valor.conta_id === conta.id;
      const matchesMonth = context.mes ? valor.mes === context.mes : true;
      
      return matchesAccount && matchesMonth;
    });

    let result = 0;
    accountValues.forEach(valor => {
      const valorField = context.tipo === 'orcado' ? 'valor_orcado' : 'valor_realizado';
      const rawValue = Number(valor[valorField]) || 0;
      
      // **CORREÇÃO**: Aplicar sinal da conta corretamente
      const signedValue = conta.sinal === '+' ? rawValue : -Math.abs(rawValue);
      result += signedValue;
    });

    console.log(`Orcamento account ${accountCode} normalized value: ${result}`);
    return result;
  }

  private calculateOrcamentoGroupSum(
    grupo: any,
    context: CalculationContext
  ): number {
    const contas = this.extractContasFromContext(context);
    const groupAccounts = contas.filter(conta => conta.grupo_id === grupo.id);

    let result = 0;
    groupAccounts.forEach(conta => {
      const accountValue = this.calculateOrcamentoAccount(conta.codigo, context);
      result += accountValue;
    });

    console.log(`Orcamento group ${grupo.codigo} sum normalized value: ${result}`);
    return result;
  }

  private extractContasFromContext(context: CalculationContext): any[] {
    if (context.dataType === 'orcamento') {
      // Para dados estruturados, extrair contas únicas
      return context.valores
        .filter(v => v.conta && !Array.isArray(v.conta))
        .map(v => v.conta)
        .filter((conta, index, array) => 
          array.findIndex(c => c.id === conta.id) === index
        );
    }
    
    return [];
  }
}
