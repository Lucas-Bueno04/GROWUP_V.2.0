
export function exportDetailedAnalysisToCSV(data: any[]) {
  const formatPercentage = (orcado: number, realizado: number) => {
    if (orcado === 0) return '0';
    const variance = ((realizado - orcado) / orcado) * 100;
    return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}`;
  };

  const headers = ['Código', 'Nome', 'Orçado', 'Realizado', 'Variação (R$)', 'Variação (%)', 'Status'];
  const csvData = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.nome}"`,
      item.orcado,
      item.realizado,
      item.variancia,
      formatPercentage(item.orcado, item.realizado),
      item.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `analise-orcamentaria-${new Date().getFullYear()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
