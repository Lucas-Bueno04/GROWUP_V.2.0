
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

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
