
export const formatValue = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const getPerformanceColor = (valor: number, media: number) => {
  if (valor > media) return 'text-green-600';
  return 'text-red-600';
};

export const getPerformanceDifference = (valor?: number, media?: number) => {
  if (!valor || !media) return null;
  
  const diferenca = ((valor - media) / media) * 100;
  return {
    value: diferenca,
    isPositive: diferenca > 0
  };
};
