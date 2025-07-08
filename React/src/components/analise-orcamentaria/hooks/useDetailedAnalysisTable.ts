
import { useState, useMemo } from 'react';
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';

export function useDetailedAnalysisTable(data: BudgetAnalysisData) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'nome' | 'orcado' | 'realizado' | 'variancia'>('variancia');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const indicadoresDetalhados = data?.indicadoresDetalhados || [];

  const filteredAndSortedData = useMemo(() => {
    return indicadoresDetalhados
      .filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        let aValue: number | string = a[sortField];
        let bValue: number | string = b[sortField];
        
        if (typeof aValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue);
        }
        
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
  }, [indicadoresDetalhados, searchTerm, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredAndSortedData,
    handleSort
  };
}
