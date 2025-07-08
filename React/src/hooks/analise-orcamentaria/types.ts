
export interface BudgetAnalysisData {
  totalOrcado: number;
  totalRealizado: number;
  varianciaAbsoluta: number;
  varianciaPercentual: number;
  status: 'positive' | 'negative' | 'neutral';
  indicadoresCount: number;
  
  receitaLiquidaOrcada: number;
  receitaLiquidaRealizada: number;
  custosOperacionaisOrcado: number;
  custosOperacionaisRealizado: number;
  ebitdaOrcado: number;
  ebitdaRealizado: number;
  
  // Dados cumulativos
  totalOrcadoCumulativo?: number;
  totalRealizadoCumulativo?: number;
  varianciaAbsolutaCumulativa?: number;  
  varianciaPercentualCumulativa?: number;
  statusCumulativo?: 'positive' | 'negative' | 'neutral';
  receitaLiquidaOrcadaCumulativa?: number;
  receitaLiquidaRealizadaCumulativa?: number;
  custosOperacionaisOrcadoCumulativo?: number;
  custosOperacionaisRealizadoCumulativo?: number;
  ebitdaOrcadoCumulativo?: number;
  ebitdaRealizadoCumulativo?: number;
  
  dadosMensais: {
    mes: number;
    mesNome: string;
    orcado: number;
    realizado: number;
    variancia: number;
    receitaLiquidaOrcada: number;
    receitaLiquidaRealizada: number;
  }[];
  
  dadosHierarquicos: {
    grupos: {
      id: string;
      codigo: string;
      nome: string;
      sinal: '+' | '-';
      ordem: number;
      orcado: number;
      realizado: number;
      variancia: number;
      tipo_calculo: 'soma' | 'calculado' | 'manual';
      formula?: string;
      contas: {
        id: string;
        codigo: string;
        nome: string;
        sinal: '+' | '-';
        ordem: number;
        orcado: number;
        realizado: number;
        variancia: number;
        dadosMensais: {
          mes: number;
          orcado: number;
          realizado: number;
        }[];
      }[];
      dadosMensais: {
        mes: number;
        orcado: number;
        realizado: number;
      }[];
    }[];
  };
  
  gruposDisponiveis: {
    id: string;
    codigo: string;
    nome: string;
  }[];
  
  indicadoresDetalhados: {
    id: string;
    nome: string;
    tipo: 'sistema' | 'proprio';
    orcado: number;
    realizado: number;
    variancia: number;
    status: 'positive' | 'negative' | 'neutral';
  }[];
}

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

export interface OrcamentoValor {
  mes: number;
  valor_orcado: number;
  valor_realizado: number;
  conta: any;
}
