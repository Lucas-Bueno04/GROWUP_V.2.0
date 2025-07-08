
/**
 * Utilitário específico para debug de cálculos de EBITDA
 * Ajuda a identificar problemas nos valores calculados
 */

export function debugEBITDACalculation(
  formula: string,
  grupos: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
) {
  console.log('🔧 === EBITDA DEBUG SESSION START ===');
  console.log('Formula:', formula);
  console.log('Tipo:', tipo);
  console.log('Mês:', mes || 'annual');
  
  // Identificar grupos envolvidos na fórmula EBITDA
  const gMatches = formula.match(/G(\d+)/g);
  if (gMatches) {
    console.log('Groups referenced in EBITDA formula:', gMatches);
    
    gMatches.forEach(gPattern => {
      const groupCode = gPattern.replace('G', '');
      const group = grupos.find(g => g.codigo === groupCode);
      
      if (group) {
        console.log(`📊 Group ${gPattern} (${group.nome}):`, {
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
          
          console.log(`  📈 Accounts in ${gPattern}:`, groupValues.length);
          groupValues.forEach(valor => {
            const conta = valor.conta as any;
            const valorField = tipo === 'orcado' ? 'valor_orcado' : 'valor_realizado';
            const valorRaw = valor[valorField] || 0;
            
            console.log(`    💰 ${conta.codigo} (${conta.nome}): ${valorRaw} [${conta.sinal}]`);
          });
        }
      }
    });
  }
  
  console.log('🔧 === EBITDA DEBUG SESSION END ===');
}

export function validateEBITDAResult(
  indicatorName: string,
  formula: string,
  result: number,
  expectedRange?: { min: number; max: number }
) {
  console.log('✅ === EBITDA RESULT VALIDATION ===');
  console.log('Indicator:', indicatorName);
  console.log('Formula:', formula);
  console.log('Result:', result);
  
  // Validações básicas
  const validations = {
    isNumber: !isNaN(result) && isFinite(result),
    isRealistic: Math.abs(result) < 1e12, // Evitar valores absurdos
    isInExpectedRange: expectedRange ? 
      (result >= expectedRange.min && result <= expectedRange.max) : true
  };
  
  console.log('Validations:', validations);
  
  if (!validations.isNumber) {
    console.error('❌ EBITDA result is not a valid number!');
  }
  
  if (!validations.isRealistic) {
    console.warn('⚠️ EBITDA result seems unrealistic (too large)');
  }
  
  if (!validations.isInExpectedRange) {
    console.warn('⚠️ EBITDA result is outside expected range');
  }
  
  const isValid = Object.values(validations).every(v => v);
  console.log(`Overall validation: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
  
  console.log('✅ === END EBITDA RESULT VALIDATION ===');
  return isValid;
}
