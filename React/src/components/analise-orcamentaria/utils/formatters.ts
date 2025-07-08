
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(orcado: number, realizado: number): string {
  if (orcado === 0) return '0%';
  const variance = ((realizado - orcado) / Math.abs(orcado)) * 100;
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`;
}
