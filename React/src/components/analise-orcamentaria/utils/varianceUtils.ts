
export function getVarianceInterpretation(variancia: number, orcado: number, sinal: '+' | '-') {
  if (orcado === 0) {
    return {
      status: 'neutral' as const,
      isPositiveOutcome: false
    };
  }

  const percent = Math.abs(variancia / orcado) * 100;
  
  // For positive sign accounts (revenue), positive variance is good
  // For negative sign accounts (expenses), negative variance is good (less expense than budgeted)
  let isPositiveOutcome: boolean;
  if (sinal === '+') {
    isPositiveOutcome = variancia > 0;
  } else {
    isPositiveOutcome = variancia < 0; // Less expense than budgeted is good
  }

  // Determine status based on percentage threshold and outcome - changed from 5% to 1%
  let status: 'positive' | 'negative' | 'neutral';
  if (percent > 1) {
    status = isPositiveOutcome ? 'positive' : 'negative';
  } else {
    status = 'neutral';
  }

  return { status, isPositiveOutcome };
}

export function getVarianceStatusIcon(variancia: number, orcado: number) {
  const { status } = getVarianceInterpretation(variancia, orcado, sinal);
  
  switch (status) {
    case 'positive':
      return 'trending-up';
    case 'negative':
      return 'trending-down';
    default:
      return 'minus';
  }
}

export function getVarianceStatusBadge(variancia: number, orcado: number, sinal: '+' | '-') {
  const { status } = getVarianceInterpretation(variancia, orcado, sinal);
  
  switch (status) {
    case 'positive':
      return { variant: 'default' as const, text: 'Positivo', className: 'bg-green-100 text-green-800' };
    case 'negative':
      return { variant: 'destructive' as const, text: 'Negativo', className: '' };
    default:
      return { variant: 'secondary' as const, text: 'Neutro', className: '' };
  }
}

// Improved function to determine group sign based on group characteristics (for variance calculations)
export function determineGroupSign(grupo: any): '+' | '-' {
  const groupName = grupo.nome?.toLowerCase() || '';
  const groupCode = grupo.codigo?.toString() || '';
  
  console.log(`Determining sign for group ${groupCode} (${grupo.nome})`);
  
  // Specific group corrections based on user feedback
  
  // Grupo 6 - SALÁRIOS ENCARGOS DIRETORIA should be expense (-) 
  if (groupCode === '6' || groupName.includes('salários') || groupName.includes('encargos')) {
    console.log(`Group ${groupCode} classified as expense (salary/charges)`);
    return '-';
  }
  
  // Result indicators should be positive (+) for variance calculation
  // Grupos 7 (EBITDA) and 10 (RESULTADO LÍQUIDO) are result indicators
  if (groupCode === '7' || groupCode === '10' || 
      groupName.includes('ebitda') || 
      groupName.includes('resultado') ||
      groupName.includes('lucro') ||
      groupName.includes('profit')) {
    console.log(`Group ${groupCode} classified as positive result indicator`);
    return '+';
  }
  
  // For calculated groups, analyze their formula and position
  if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
    const formula = grupo.formula.toLowerCase();
    
    // Groups that typically represent financial results
    if (formula.includes('receita') || 
        groupName.includes('receita') ||
        groupName.includes('revenue') ||
        groupName.includes('faturamento') ||
        groupName.includes('vendas')) {
      console.log(`Group ${groupCode} classified as revenue (+) based on formula/name`);
      return '+';
    }
    
    // Cost and expense patterns in calculated groups
    if (formula.includes('custo') || 
        formula.includes('despesa') ||
        formula.includes('gasto') ||
        groupName.includes('custo') ||
        groupName.includes('despesa') ||
        groupName.includes('gasto') ||
        groupName.includes('expense') ||
        groupName.includes('cost')) {
      console.log(`Group ${groupCode} classified as cost/expense (-) based on formula/name`);
      return '-';
    }
  }
  
  // For sum groups, use the predominant sign of their accounts
  if (grupo.contas && grupo.contas.length > 0) {
    const positiveSigns = grupo.contas.filter((conta: any) => conta.sinal === '+').length;
    const negativeSigns = grupo.contas.filter((conta: any) => conta.sinal === '-').length;
    
    const predominantSign = positiveSigns >= negativeSigns ? '+' : '-';
    console.log(`Group ${groupCode} classified as ${predominantSign} based on account signs (${positiveSigns}+ vs ${negativeSigns}-)`);
    return predominantSign;
  }
  
  // Enhanced pattern matching for group names and codes
  
  // Revenue indicators (more comprehensive)
  if (groupName.includes('receita') || 
      groupName.includes('revenue') ||
      groupName.includes('vendas') ||
      groupName.includes('faturamento') ||
      groupName.includes('venda') ||
      groupCode.toLowerCase().includes('rec') ||
      groupCode.toLowerCase().includes('rev') ||
      // Groups 1-2 are typically revenue related
      (parseInt(groupCode) >= 1 && parseInt(groupCode) <= 2)) {
    console.log(`Group ${groupCode} classified as revenue (+) based on patterns`);
    return '+';
  }
  
  // Cost/expense indicators (more comprehensive)
  if (groupName.includes('custo') || 
      groupName.includes('despesa') ||
      groupName.includes('gasto') ||
      groupName.includes('expense') ||
      groupName.includes('cost') ||
      groupName.includes('salário') ||
      groupName.includes('encargo') ||
      groupName.includes('folha') ||
      groupName.includes('pessoal') ||
      groupName.includes('administrativ') ||
      groupName.includes('operacion') ||
      groupCode.toLowerCase().includes('cus') ||
      groupCode.toLowerCase().includes('des') ||
      groupCode.toLowerCase().includes('exp') ||
      groupCode.toLowerCase().includes('sal') ||
      // Groups 3-6 are typically cost/expense related
      (parseInt(groupCode) >= 3 && parseInt(groupCode) <= 6)) {
    console.log(`Group ${groupCode} classified as cost/expense (-) based on patterns`);
    return '-';
  }
  
  // Default classification based on group order
  // Groups 1-3: Revenue and initial deductions (typically positive for variance analysis)
  // Groups 4-6: Costs and expenses (typically negative)
  // Groups 7+: Results (typically positive for variance analysis)
  const order = parseInt(groupCode) || grupo.ordem || 1;
  
  if (order <= 3 || order >= 7) {
    console.log(`Group ${groupCode} classified as (+) based on order ${order} (revenue or result)`);
    return '+';
  } else {
    console.log(`Group ${groupCode} classified as (-) based on order ${order} (cost/expense)`);
    return '-';
  }
}

// New function to determine group category for display purposes
export function determineGroupCategory(grupo: any): 'Receita' | 'Custo/Despesa' | 'Resultado/Indicador' {
  const groupName = grupo.nome?.toLowerCase() || '';
  const groupCode = grupo.codigo?.toString() || '';
  
  console.log(`Determining category for group ${groupCode} (${grupo.nome})`);
  
  // Result indicators and calculated metrics
  if (groupCode === '3' || // Receita Líquida
      groupCode === '7' || // EBITDA
      groupCode === '10' || // Resultado Líquido
      groupName.includes('receita líquida') ||
      groupName.includes('receita liquida') ||
      groupName.includes('ebitda') ||
      groupName.includes('resultado líquido') ||
      groupName.includes('resultado liquido') ||
      groupName.includes('lucro líquido') ||
      groupName.includes('lucro liquido') ||
      groupName.includes('margem') ||
      (grupo.tipo_calculo === 'calculado' && (
        groupName.includes('resultado') ||
        groupName.includes('lucro') ||
        groupName.includes('profit') ||
        groupName.includes('margin')
      ))) {
    console.log(`Group ${groupCode} categorized as Resultado/Indicador`);
    return 'Resultado/Indicador';
  }
  
  // Revenue groups (Groups 1-2: raw revenue and deductions)
  if (groupCode === '1' || groupCode === '2' ||
      (groupName.includes('receita') && !groupName.includes('líquida') && !groupName.includes('liquida')) ||
      groupName.includes('faturamento') ||
      groupName.includes('vendas') ||
      groupName.includes('revenue') ||
      groupName.includes('sales') ||
      groupName.includes('deduções') ||
      groupName.includes('deducoes')) {
    console.log(`Group ${groupCode} categorized as Receita`);
    return 'Receita';
  }
  
  // Cost and expense groups
  if (groupCode === '4' || groupCode === '5' || groupCode === '6' ||
      groupName.includes('custo') ||
      groupName.includes('despesa') ||
      groupName.includes('gasto') ||
      groupName.includes('expense') ||
      groupName.includes('cost') ||
      groupName.includes('salário') ||
      groupName.includes('encargo') ||
      groupName.includes('folha') ||
      groupName.includes('pessoal') ||
      groupName.includes('administrativ') ||
      groupName.includes('operacion')) {
    console.log(`Group ${groupCode} categorized as Custo/Despesa`);
    return 'Custo/Despesa';
  }
  
  // Default fallback based on group order
  const order = parseInt(groupCode) || grupo.ordem || 1;
  
  if (order >= 7) {
    console.log(`Group ${groupCode} categorized as Resultado/Indicador (based on order ${order})`);
    return 'Resultado/Indicador';
  } else if (order <= 2) {
    console.log(`Group ${groupCode} categorized as Receita (based on order ${order})`);
    return 'Receita';
  } else {
    console.log(`Group ${groupCode} categorized as Custo/Despesa (based on order ${order})`);
    return 'Custo/Despesa';
  }
}
