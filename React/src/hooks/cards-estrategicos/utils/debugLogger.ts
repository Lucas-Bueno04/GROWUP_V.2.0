
/**
 * Logger específico para debug de Cards Estratégicos
 * Foca na identificação e correção de problemas de cálculo
 */

export class CardsEstrategicosDebugLogger {
  private static enabled = true;

  static logIndicatorCalculation(
    indicadorCodigo: string,
    formula: string,
    valoresOriginais: any,
    valoresProcessados: any,
    resultado: number
  ) {
    if (!this.enabled) return;

    console.log(`🎯 === CARDS ESTRATÉGICOS DEBUG: ${indicadorCodigo} ===`);
    console.log(`Formula: ${formula}`);
    console.log(`Valores originais:`, valoresOriginais);
    console.log(`Valores processados:`, valoresProcessados);
    console.log(`Resultado final: ${resultado}`);
    console.log(`=== FIM DEBUG ${indicadorCodigo} ===`);
  }

  static logEBITDACalculation(
    g3: number,
    g4: number,
    g5: number,
    ebitda: number,
    ebitdaPercent: number
  ) {
    if (!this.enabled) return;

    console.log(`📊 === EBITDA% DEBUG ===`);
    console.log(`G3 (Receita Líquida): ${g3}`);
    console.log(`G4 (Custos): ${g4}`);
    console.log(`G5 (Despesas): ${g5}`);
    console.log(`EBITDA (G3 - G4 - G5): ${ebitda}`);
    console.log(`EBITDA% ((G3 - G4 - G5) / G3) * 100: ${ebitdaPercent}%`);
    console.log(`=== FIM EBITDA% DEBUG ===`);
  }

  static logNetMarginCalculation(
    g7: number,
    g3: number,
    margemLiquida: number
  ) {
    if (!this.enabled) return;

    console.log(`📊 === MARGEM LÍQUIDA% DEBUG ===`);
    console.log(`G7 (Resultado Líquido): ${g7}`);
    console.log(`G3 (Receita Líquida): ${g3}`);
    console.log(`Margem Líquida% (G7 / G3) * 100: ${margemLiquida}%`);
    console.log(`=== FIM MARGEM LÍQUIDA% DEBUG ===`);
  }

  static logSignRulesApplication(
    originalValue: number,
    groupCode: string,
    accountCode: string,
    finalValue: number
  ) {
    if (!this.enabled) return;

    console.log(`🔧 SIGN RULES: Group ${groupCode}, Account ${accountCode}`);
    console.log(`Original: ${originalValue} -> Final: ${finalValue}`);
  }

  static enable() {
    this.enabled = true;
    console.log('🔍 Cards Estratégicos Debug Logger ENABLED');
  }

  static disable() {
    this.enabled = false;
  }
}
