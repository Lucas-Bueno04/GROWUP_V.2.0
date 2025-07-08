
/**
 * Utilitários para conversão entre diferentes formatos de referência de conta
 */

/**
 * Converte código de conta com pontos para formato CONTA_X_Y
 * Exemplo: "5.4" -> "CONTA_5_4"
 */
export function convertAccountCodeToContaFormat(accountCode: string): string {
  const codeWithUnderscores = accountCode.replace(/\./g, '_');
  return `CONTA_${codeWithUnderscores}`;
}

/**
 * Converte formato CONTA_X_Y de volta para código com pontos
 * Exemplo: "CONTA_5_4" -> "5.4"
 */
export function convertContaFormatToAccountCode(contaFormat: string): string {
  if (!contaFormat.startsWith('CONTA_')) {
    return contaFormat;
  }
  
  const codeWithUnderscores = contaFormat.replace('CONTA_', '');
  return codeWithUnderscores.replace(/_/g, '.');
}

/**
 * Converte uma fórmula inteira do formato C{código} para CONTA_X_Y
 * Exemplo: "(C5.4/G3)*100" -> "(CONTA_5_4/G3)*100"
 */
export function convertFormulaToContaFormat(formula: string): string {
  // Encontrar todas as referências C{código} que contêm pontos
  return formula.replace(/C([\w\d\.]+)/g, (match, accountCode) => {
    if (accountCode.includes('.')) {
      return convertAccountCodeToContaFormat(accountCode);
    }
    // Se não contém ponto, manter o formato C{código}
    return match;
  });
}

/**
 * Converte uma fórmula do formato CONTA_X_Y de volta para C{código}
 * Exemplo: "(CONTA_5_4/G3)*100" -> "(C5.4/G3)*100"
 */
export function convertFormulaFromContaFormat(formula: string): string {
  return formula.replace(/CONTA_([\w\d_]+)/g, (match, codeWithUnderscores) => {
    const accountCode = codeWithUnderscores.replace(/_/g, '.');
    return `C${accountCode}`;
  });
}

/**
 * Valida se uma string está no formato CONTA_X_Y válido
 */
export function isValidContaFormat(input: string): boolean {
  return /^CONTA_[\w\d_]+$/.test(input);
}

/**
 * Extrai todos os códigos de conta de uma fórmula (tanto C{código} quanto CONTA_X_Y)
 */
export function extractAccountReferencesFromFormula(formula: string): string[] {
  const cReferences = (formula.match(/C([\w\d\.]+)/g) || [])
    .map(match => match.replace('C', ''));
  
  const contaReferences = (formula.match(/CONTA_([\w\d_]+)/g) || [])
    .map(match => convertContaFormatToAccountCode(match));
  
  return [...new Set([...cReferences, ...contaReferences])];
}

/**
 * Documenta a convenção de nomenclatura para logs e debug
 */
export function getFormulaNamingConvention(): string {
  return `
=== CONVENÇÃO DE NOMENCLATURA DE FÓRMULAS ===

1. Grupos: G{número}
   Exemplo: G1, G2, G3

2. Contas simples: C{código}
   Exemplo: C1, C2, C100

3. Contas com pontos: CONTA_X_Y
   Exemplo: CONTA_5_4 (representa conta "5.4")
   Exemplo: CONTA_1_2_3 (representa conta "1.2.3")

4. Funções matemáticas: abs()
   Exemplo: abs(G1-G2)

5. Operadores: +, -, *, /, (), números literais
   Exemplo: (CONTA_5_4/G3)*100

=== EXEMPLOS DE FÓRMULAS VÁLIDAS ===
- G1+G2
- (CONTA_5_4/G3)*100
- abs(C100-CONTA_2_1)
- (G1+G2)*CONTA_1_5/100
  `;
}
