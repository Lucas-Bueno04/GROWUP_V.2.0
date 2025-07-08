
import { formatPercentage } from './formatters';

export function exportHierarchicalDataToCSV(
  data: any,
  selectedMonth: string,
  getGroupDisplayValues: (grupo: any) => any,
  getMonthlyData: (conta: any, month: number) => any
) {
  const csvRows = ['Grupo,Conta,Código,Orçado,Realizado,Variação,Variação %'];
  
  data.dadosHierarquicos.grupos.forEach((grupo: any) => {
    const groupValues = getGroupDisplayValues(grupo);
    csvRows.push(`"${grupo.nome}",,"${grupo.codigo}",${groupValues.orcado},${groupValues.realizado},${groupValues.variancia},"${formatPercentage(groupValues.orcado, groupValues.realizado)}"`);
    
    grupo.contas.forEach((conta: any) => {
      const orcado = selectedMonth === 'all' ? conta.orcado : getMonthlyData(conta, parseInt(selectedMonth)).orcado;
      const realizado = selectedMonth === 'all' ? conta.realizado : getMonthlyData(conta, parseInt(selectedMonth)).realizado;
      const variancia = realizado - orcado;
      
      csvRows.push(`,"${conta.nome}","${conta.codigo}",${orcado},${realizado},${variancia},"${formatPercentage(orcado, realizado)}"`);
    });
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `analise-hierarquica-${new Date().getFullYear()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
