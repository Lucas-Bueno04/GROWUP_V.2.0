
import { applySign } from './calculationUtils';

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const processMonthlyData = (valoresArray: any[]) => {
  const mesesReceitaData = new Map<number, { 
    receitaLiquidaOrcada: number; 
    receitaLiquidaRealizada: number; 
    orcado: number; 
    realizado: number 
  }>();
  
  valoresArray.forEach(valor => {
    const existing = mesesReceitaData.get(valor.mes) || { 
      receitaLiquidaOrcada: 0, 
      receitaLiquidaRealizada: 0, 
      orcado: 0, 
      realizado: 0 
    };
    
    // Add to total
    existing.orcado += valor.valor_orcado || 0;
    existing.realizado += valor.valor_realizado || 0;
    
    // Add to Receita Líquida if applicable
    if (valor.conta && !Array.isArray(valor.conta)) {
      const conta = valor.conta as any;
      if (conta.grupo && !Array.isArray(conta.grupo)) {
        const grupo = conta.grupo as any;
        if (grupo.ordem === 1 || grupo.ordem === 2) {
          const orcadoComSinal = applySign(valor.valor_orcado || 0, conta.sinal);
          const realizadoComSinal = applySign(valor.valor_realizado || 0, conta.sinal);
          
          existing.receitaLiquidaOrcada += orcadoComSinal;
          existing.receitaLiquidaRealizada += realizadoComSinal;
        }
      }
    }
    
    mesesReceitaData.set(valor.mes, existing);
  });

  return Array.from(mesesReceitaData.entries()).map(([mes, dados]) => ({
    mes,
    mesNome: MESES[mes - 1],
    orcado: dados.orcado,
    realizado: dados.realizado,
    variancia: dados.realizado - dados.orcado,
    receitaLiquidaOrcada: dados.receitaLiquidaOrcada,
    receitaLiquidaRealizada: dados.receitaLiquidaRealizada
  })).sort((a, b) => a.mes - b.mes);
};
