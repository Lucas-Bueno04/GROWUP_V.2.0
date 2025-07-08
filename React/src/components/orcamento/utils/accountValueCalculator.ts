
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

export function calculateAccountValueForMonth(
  accountCode: string,
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado',
  mes: number
): number {
  console.log(`=== ORCAMENTO ACCOUNT VALUE CALCULATION ===`);
  console.log(`Calculating orcamento account value for code: ${accountCode}, type: ${tipo}, month: ${mes}`);
  console.log(`Total contas to search: ${contas.length}`);
  console.log(`Total valores to search: ${valores.length}`);
  
  // DEBUG: Log estrutura das contas
  if (contas.length > 0) {
    console.log('First 3 contas structures:');
    contas.slice(0, 3).forEach((conta, index) => {
      console.log(`Conta ${index}:`, {
        id: conta.id,
        codigo: conta.codigo,
        nome: conta.nome,
        sinal: conta.sinal,
        codigoType: typeof conta.codigo
      });
    });
  }
  
  // Listar todos os códigos de conta disponíveis
  const availableAccountCodes = contas.map(c => c.codigo).sort();
  console.log(`Available orcamento account codes: [${availableAccountCodes.join(', ')}]`);
  console.log(`Looking for orcamento account code: "${accountCode}"`);
  
  // **CRITICAL FIX**: Encontrar a conta pelo código com correspondência exata
  const targetCode = accountCode.toString().trim();
  const conta = contas.find(c => {
    const contaCodigo = c.codigo?.toString().trim();
    return contaCodigo === targetCode;
  });
  
  if (!conta) {
    console.warn(`Orcamento account with code ${accountCode} not found`);
    console.log(`=== ORCAMENTO ACCOUNT SEARCH DEBUG ===`);
    console.log(`Target account: "${accountCode}" (type: ${typeof accountCode})`);
    console.log(`Available accounts in data:`);
    contas.slice(0, 10).forEach((c, i) => {
      console.log(`  ${i + 1}. "${c.codigo}" (type: ${typeof c.codigo}) - ${c.nome}`);
    });
    console.log(`=== END ORCAMENTO ACCOUNT SEARCH DEBUG ===`);
    return 0;
  }

  console.log(`Found orcamento account:`, {
    id: conta.id,
    codigo: conta.codigo,
    nome: conta.nome,
    sinal: conta.sinal
  });

  // **CRITICAL FIX**: Filtrar valores para a conta específica no mês usando IDs
  const accountValues = valores.filter(valor => {
    const isCorrectAccount = valor.conta_id === conta.id;
    const isCorrectMonth = valor.mes === mes;
    
    if (isCorrectAccount && isCorrectMonth) {
      console.log(`Match found: conta_id ${valor.conta_id} = ${conta.id}, mes ${valor.mes} = ${mes}`);
    }
    
    return isCorrectAccount && isCorrectMonth;
  });

  console.log(`Found ${accountValues.length} orcamento values for account ${accountCode} in month ${mes}`);
  
  if (accountValues.length === 0) {
    console.warn(`No orcamento values found for account ${accountCode} in month ${mes}`);
    return 0;
  }

  console.log(`Processing ${accountValues.length} orcamento values for account ${accountCode}:`);

  const totalValue = accountValues.reduce((sum, valor, index) => {
    const valorField = tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado;
    const rawValue = valorField || 0;
    // **CRITICAL FIX**: Apply the account sign correctly
    const signedValue = conta.sinal === '+' ? rawValue : -Math.abs(rawValue);
    
    console.log(`  Orcamento value ${index + 1} - Month ${mes}:`, {
      rawValue: valorField,
      sinal: conta.sinal,
      signedValue: signedValue,
      runningSum: sum + signedValue
    });
    
    return sum + signedValue;
  }, 0);

  console.log(`Total orcamento calculated value for account ${accountCode} in month ${mes}: ${totalValue}`);
  console.log(`=== END ORCAMENTO ACCOUNT VALUE CALCULATION ===`);
  return totalValue;
}

export function calculateAccountValueAnnual(
  accountCode: string,
  contas: any[],
  valores: OrcamentoEmpresaValor[],
  tipo: 'orcado' | 'realizado'
): number {
  console.log(`=== ANNUAL ACCOUNT VALUE CALCULATION ===`);
  console.log(`Calculating annual value for account code: ${accountCode}, type: ${tipo}`);
  
  // Encontrar a conta pelo código
  const targetCode = accountCode.toString().trim();
  const conta = contas.find(c => {
    const contaCodigo = c.codigo?.toString().trim();
    return contaCodigo === targetCode;
  });
  
  if (!conta) {
    console.warn(`Account with code ${accountCode} not found for annual calculation`);
    return 0;
  }

  console.log(`Found account for annual calculation:`, {
    id: conta.id,
    codigo: conta.codigo,
    nome: conta.nome,
    sinal: conta.sinal
  });

  // Filtrar valores para a conta específica em todos os meses
  const accountValues = valores.filter(valor => valor.conta_id === conta.id);

  console.log(`Found ${accountValues.length} values for account ${accountCode} across all months`);
  
  if (accountValues.length === 0) {
    console.warn(`No values found for account ${accountCode} for annual calculation`);
    return 0;
  }

  // Somar todos os valores dos 12 meses
  const totalValue = accountValues.reduce((sum, valor, index) => {
    const valorField = tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado;
    const rawValue = valorField || 0;
    // **CRITICAL FIX**: Apply the account sign correctly
    const signedValue = conta.sinal === '+' ? rawValue : -Math.abs(rawValue);
    
    console.log(`  Annual value ${index + 1} - Month ${valor.mes}:`, {
      rawValue: valorField,
      sinal: conta.sinal,
      signedValue: signedValue,
      runningSum: sum + signedValue
    });
    
    return sum + signedValue;
  }, 0);

  console.log(`Total annual calculated value for account ${accountCode}: ${totalValue}`);
  console.log(`=== END ANNUAL ACCOUNT VALUE CALCULATION ===`);
  return totalValue;
}
