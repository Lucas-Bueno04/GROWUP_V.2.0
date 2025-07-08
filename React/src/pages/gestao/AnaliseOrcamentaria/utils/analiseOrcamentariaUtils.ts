
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const getVarianceVariant = (status: string) => {
  if (status === 'positive') return 'default' as const;
  if (status === 'negative') return 'destructive' as const;
  return 'secondary' as const;
};

export const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
};

export const getCumulativeData = (analysisData: any, isCumulative: boolean) => {
  return {
    receitaRealizada: isCumulative && analysisData?.receitaLiquidaRealizadaCumulativa !== undefined 
      ? analysisData.receitaLiquidaRealizadaCumulativa! 
      : analysisData?.receitaLiquidaRealizada || 0,
      
    varianciaPercentual: isCumulative && analysisData?.varianciaPercentualCumulativa !== undefined 
      ? analysisData.varianciaPercentualCumulativa! 
      : analysisData?.varianciaPercentual || 0,
      
    status: isCumulative && analysisData?.statusCumulativo !== undefined 
      ? analysisData.statusCumulativo! 
      : analysisData?.status || 'neutral'
  };
};
