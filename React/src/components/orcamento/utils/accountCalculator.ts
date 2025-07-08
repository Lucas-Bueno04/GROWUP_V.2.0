
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
        sinal: conta.sinal
      });
    });
  }
  
  // Encontrar a conta pelo código
  const conta = contas.find(c => c.codigo === accountCode);
  if (!conta) {
    console.warn(`Orcamento account with code ${accountCode} not found`);
    console.log('Available orcamento account codes:', contas.map(c => c.codigo));
    return 0;
  }

  console.log(`Found orcamento account:`, {
    id: conta.id,
    codigo: conta.codigo,
    nome: conta.nome,
    sinal: conta.sinal
  });

  // Filtrar valores para a conta específica no mês
  const accountValues = valores.filter(valor => {
    const isCorrectAccount = valor.conta_id === conta.id;
    const isCorrectMonth = valor.mes === mes;
    
    console.log(`Checking orcamento valor:`, {
      valorContaId: valor.conta_id,
      targetContaId: conta.id,
      isCorrectAccount,
      valorMes: valor.mes,
      targetMes: mes,
      isCorrectMonth,
      finalMatch: isCorrectAccount && isCorrectMonth
    });
    
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
