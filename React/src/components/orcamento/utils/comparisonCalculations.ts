
export const calculateVariance = (orcado: number, realizado: number) => {
  if (orcado === 0) return realizado === 0 ? 0 : 100;
  return ((realizado - orcado) / Math.abs(orcado)) * 100;
};

export const getRowTotals = (
  contaId: string, 
  valores: any[], 
  getValorForConta: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => number
) => {
  let totalOrcado = 0;
  let totalRealizado = 0;
  
  for (let mes = 1; mes <= 12; mes++) {
    totalOrcado += getValorForConta(contaId, mes, 'orcado');
    totalRealizado += getValorForConta(contaId, mes, 'realizado');
  }
  
  return { totalOrcado, totalRealizado };
};

export const getGroupTotals = (
  grupoId: string,
  gruposValores: any[],
  getValorForGrupo: (grupoId: string, mes: number, tipo: 'orcado' | 'realizado') => number
) => {
  let totalOrcado = 0;
  let totalRealizado = 0;
  
  for (let mes = 1; mes <= 12; mes++) {
    totalOrcado += getValorForGrupo(grupoId, mes, 'orcado');
    totalRealizado += getValorForGrupo(grupoId, mes, 'realizado');
  }
  
  return { totalOrcado, totalRealizado };
};
