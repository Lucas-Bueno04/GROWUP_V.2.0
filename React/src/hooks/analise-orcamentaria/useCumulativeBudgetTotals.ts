
import { useMemo } from 'react';

export interface CumulativeBudgetTotals {
  totalOrcadoCumulativo: number;
  totalRealizadoCumulativo: number;
  varianciaAbsolutaCumulativa: number;
  varianciaPercentualCumulativa: number;
  status: 'positive' | 'negative' | 'neutral';
  receitaLiquidaOrcadaCumulativa: number;
  receitaLiquidaRealizadaCumulativa: number;
  custosOperacionaisOrcadoCumulativo: number;
  custosOperacionaisRealizadoCumulativo: number;
  ebitdaOrcadoCumulativo: number;
  ebitdaRealizadoCumulativo: number;
}

export function useCumulativeBudgetTotals(
  valores: any[],
  mesAte: number
): CumulativeBudgetTotals {
  return useMemo(() => {
    // Filtrar valores até o mês especificado
    const valoresFiltrados = valores.filter(v => v.mes <= mesAte);
    
    // Calcular totais cumulativos gerais
    const totalOrcadoCumulativo = valoresFiltrados.reduce((sum, v) => sum + (v.valor_orcado || 0), 0);
    const totalRealizadoCumulativo = valoresFiltrados.reduce((sum, v) => sum + (v.valor_realizado || 0), 0);
    
    // Calcular receita líquida cumulativa (grupos 3.x - receitas)
    const receitasOrcadas = valoresFiltrados
      .filter(v => v.conta?.grupo?.codigo?.startsWith('3'))
      .reduce((sum, v) => {
        const valor = v.valor_orcado || 0;
        return sum + (v.conta.sinal === '+' ? valor : -valor);
      }, 0);
      
    const receitasRealizadas = valoresFiltrados
      .filter(v => v.conta?.grupo?.codigo?.startsWith('3'))
      .reduce((sum, v) => {
        const valor = v.valor_realizado || 0;
        return sum + (v.conta.sinal === '+' ? valor : -valor);
      }, 0);
    
    // Calcular custos operacionais cumulativos (grupos 4.x e 5.x - despesas)
    const custosOrcados = valoresFiltrados
      .filter(v => v.conta?.grupo?.codigo?.match(/^[45]/))
      .reduce((sum, v) => {
        const valor = v.valor_orcado || 0;
        return sum + (v.conta.sinal === '+' ? valor : -valor);
      }, 0);
      
    const custosRealizados = valoresFiltrados
      .filter(v => v.conta?.grupo?.codigo?.match(/^[45]/))
      .reduce((sum, v) => {
        const valor = v.valor_realizado || 0;
        return sum + (v.conta.sinal === '+' ? valor : -valor);
      }, 0);
    
    // Calcular EBITDA cumulativo (Receita Líquida - Custos Operacionais)
    const ebitdaOrcadoCumulativo = receitasOrcadas - Math.abs(custosOrcados);
    const ebitdaRealizadoCumulativo = receitasRealizadas - Math.abs(custosRealizados);
    
    // Calcular variâncias da receita líquida
    const varianciaAbsolutaCumulativa = receitasRealizadas - receitasOrcadas;
    const varianciaPercentualCumulativa = receitasOrcadas > 0 ? 
      (varianciaAbsolutaCumulativa / receitasOrcadas) * 100 : 0;
    
    // Determinar status baseado na variância da receita líquida
    let status: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (Math.abs(varianciaPercentualCumulativa) >= 5) {
      status = varianciaAbsolutaCumulativa > 0 ? 'positive' : 'negative';
    }
    
    return {
      totalOrcadoCumulativo,
      totalRealizadoCumulativo,
      varianciaAbsolutaCumulativa,
      varianciaPercentualCumulativa,
      status,
      receitaLiquidaOrcadaCumulativa: receitasOrcadas,
      receitaLiquidaRealizadaCumulativa: receitasRealizadas,
      custosOperacionaisOrcadoCumulativo: Math.abs(custosOrcados),
      custosOperacionaisRealizadoCumulativo: Math.abs(custosRealizados),
      ebitdaOrcadoCumulativo,
      ebitdaRealizadoCumulativo
    };
  }, [valores, mesAte]);
}
