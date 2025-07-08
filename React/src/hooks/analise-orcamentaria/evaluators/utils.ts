
import type { EvaluationContext } from './types';

export function analyzeDataStructure(valores: any[]): any {
  if (valores.length === 0) {
    return {
      hasAnaliseOrcamentariaData: false,
      hasStructuredData: false,
      firstValueStructure: []
    };
  }

  const firstValue = valores[0];
  const hasContaStructure = firstValue.conta && !Array.isArray(firstValue.conta);
  
  return {
    hasAnaliseOrcamentariaData: hasContaStructure,
    hasStructuredData: !hasContaStructure && firstValue.conta,
    firstValueStructure: Object.keys(firstValue)
  };
}

export function shouldCalculateAnnual(mes?: number, isAnnual = false): boolean {
  return !mes || isAnnual;
}

export function logDebugInfo(formula: string, context: EvaluationContext): void {
  console.log('=== UNIFIED FORMULA EVALUATION START ===');
  console.log('Formula:', formula);
  console.log('Context:', {
    hasGroups: context.allGroups.length,
    hasValues: context.valores.length,
    tipo: context.tipo,
    mes: context.mes,
    isAnnual: context.isAnnual
  });
}

export function isBreakEvenFormula(formula: string, indicador?: any): boolean {
  // Melhor detecção de Break-even Operacional
  const breakEvenKeywords = [
    'break.even',
    'breakeven',
    'ponto.de.equilibrio',
    'ponto de equilibrio',
    'equilibrio operacional'
  ];
  
  const formulaLower = formula.toLowerCase();
  const indicadorName = indicador?.nome?.toLowerCase() || '';
  
  return breakEvenKeywords.some(keyword => 
    formulaLower.includes(keyword) || indicadorName.includes(keyword)
  ) || (formula.includes('G3') && formula.includes('G4') && formula.includes('G5'));
}

export function logBreakEvenDebug(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
): void {
  console.log('🔍 === BREAK-EVEN OPERACIONAL DEBUG ===');
  console.log('Formula:', formula);
  console.log('Tipo:', tipo);
  console.log('Mês:', mes || 'annual');
  
  // Identificar grupos G3, G4, G5 para Break-even
  const relevantGroups = ['3', '4', '5'];
  
  relevantGroups.forEach(groupCode => {
    const group = allGroups.find(g => g.codigo === groupCode);
    if (group) {
      console.log(`📊 Group G${groupCode} (${group.nome}):`, {
        tipo_calculo: group.tipo_calculo,
        formula: group.formula,
        codigo: group.codigo
      });
      
      // Para grupos de soma, mostrar contas associadas
      if (group.tipo_calculo === 'soma') {
        const groupValues = valores.filter(valor => {
          if (!valor.conta || Array.isArray(valor.conta)) return false;
          const conta = valor.conta as any;
          if (!conta.grupo || Array.isArray(conta.grupo)) return false;
          const grupoAssociado = conta.grupo as any;
          
          const matchesGroup = grupoAssociado.id === group.id;
          const matchesMonth = mes ? valor.mes === mes : true;
          
          return matchesGroup && matchesMonth;
        });
        
        console.log(`  📈 Accounts in G${groupCode}:`, groupValues.length);
        groupValues.forEach(valor => {
          const conta = valor.conta as any;
          const valorField = tipo === 'orcado' ? 'valor_orcado' : 'valor_realizado';
          const valorRaw = valor[valorField] || 0;
          
          console.log(`    💰 ${conta.codigo} (${conta.nome}): ${valorRaw} [${conta.sinal}]`);
        });
      }
    }
  });
  
  console.log('🔍 === END BREAK-EVEN OPERACIONAL DEBUG ===');
}
