
export const processDetailedIndicators = (valoresArray: any[]) => {
  const contasData = new Map<string, { nome: string; orcado: number; realizado: number }>();
  
  valoresArray.forEach(valor => {
    if (valor.conta && !Array.isArray(valor.conta)) {
      const conta = valor.conta as { codigo: string; nome: string };
      const key = conta.codigo;
      const existing = contasData.get(key) || { nome: conta.nome, orcado: 0, realizado: 0 };
      contasData.set(key, {
        nome: existing.nome,
        orcado: existing.orcado + (valor.valor_orcado || 0),
        realizado: existing.realizado + (valor.valor_realizado || 0)
      });
    }
  });

  return Array.from(contasData.entries()).map(([codigo, dados]) => {
    const variancia = dados.realizado - dados.orcado;
    const varPercent = dados.orcado > 0 ? (variancia / dados.orcado) * 100 : 0;
    
    const itemStatus: 'positive' | 'negative' | 'neutral' = 
      varPercent > 5 ? 'positive' : varPercent < -5 ? 'negative' : 'neutral';
    
    return {
      id: codigo,
      nome: dados.nome,
      tipo: 'sistema' as const,
      orcado: dados.orcado,
      realizado: dados.realizado,
      variancia,
      status: itemStatus
    };
  });
};
