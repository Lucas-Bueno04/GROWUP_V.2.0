
export const getDescricaoGrupo = (codigo: string) => {
  const descriptions: { [key: string]: string } = {
    '01': 'Total das receitas brutas antes das deduções fiscais',
    '02': 'Impostos e deduções sobre a receita bruta',
    '03': 'Receita após deduções (01 - 02)',
    '04': 'Custos diretos relacionados aos serviços prestados',
    '05': 'Margem de contribuição (03 - 04)',
    '06': 'Despesas administrativas e operacionais',
    '07': 'Receitas financeiras e outras receitas eventuais',
    '08': 'Despesas financeiras e outras despesas eventuais',
    '09': 'Resultado operacional antes dos tributos sobre lucro',
    '10': 'Provisões para Imposto de Renda e CSLL',
    '11': 'Resultado final do exercício'
  };
  return descriptions[codigo] || '';
};

export const getGrupoColorClass = (codigo: string) => {
  const num = parseInt(codigo);
  if (num === 1) return 'border-l-4 border-l-blue-500';
  if (num === 2) return 'border-l-4 border-l-red-500';
  if (num === 3) return 'border-l-4 border-l-green-500';
  if (num === 4) return 'border-l-4 border-l-orange-500';
  if (num === 5) return 'border-l-4 border-l-purple-500';
  if (num === 6) return 'border-l-4 border-l-yellow-500';
  if (num === 7) return 'border-l-4 border-l-teal-500';
  if (num === 8) return 'border-l-4 border-l-pink-500';
  if (num === 9) return 'border-l-4 border-l-indigo-500';
  if (num === 10) return 'border-l-4 border-l-gray-500';
  if (num === 11) return 'border-l-4 border-l-emerald-500';
  return 'border-l-4 border-l-gray-300';
};

export const getTipoCalculoBadgeVariant = (tipoCalculo: string) => {
  switch (tipoCalculo) {
    case 'soma': return 'default';
    case 'calculado': return 'secondary';
    case 'manual': return 'outline';
    default: return 'default';
  }
};
