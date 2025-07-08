
import { useState, useEffect } from 'react';
import { useCardsEstrategicos, CardsEstrategicosFilters } from '@/hooks/cards-estrategicos';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';

export function useCardsEstrategicosPage() {
  const [ano] = useState(new Date().getFullYear());
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CardsEstrategicosFilters>({
    periodo: 'mensal',
    tipoIndicador: 'todos',
    status: 'todos',
    tipoVisualizacao: 'todos'
  });

  // Hook para buscar empresas disponíveis
  const { data: empresasDisponiveis = [], isLoading: isLoadingEmpresas, error: empresasError } = useEmpresasOrcamento();
  
  // Auto-selecionar a primeira empresa específica disponível se nenhuma estiver selecionada
  useEffect(() => {
    if (!isLoadingEmpresas && empresasDisponiveis.length > 0 && !empresaId) {
      // Procurar por uma empresa específica (evitar empresas com nomes genéricos)
      const empresaEspecifica = empresasDisponiveis.find(empresa => 
        empresa.nome && 
        empresa.nome.toLowerCase() !== 'empresa' && 
        empresa.nome.toLowerCase() !== 'teste' &&
        !empresa.nome.toLowerCase().includes('test')
      );
      
      const empresaParaSelecionar = empresaEspecifica || empresasDisponiveis[0];
      
      console.log('Auto-selecionando empresa para Cards Estratégicos:', empresaParaSelecionar);
      setEmpresaId(empresaParaSelecionar.id);
    }
  }, [empresasDisponiveis, isLoadingEmpresas, empresaId]);

  console.log('=== CARDS ESTRATÉGICOS PAGE ===');
  console.log('Current state:', { ano, empresaId });
  console.log('Empresas disponíveis:', empresasDisponiveis.length);

  // Hook para buscar indicadores estratégicos
  const { data: indicadores, isLoading, error, refetch } = useCardsEstrategicos(ano, empresaId);

  console.log('Page data status:', {
    indicadores: {
      isLoading,
      error: error?.message,
      dataLength: indicadores?.length || 0
    }
  });

  // Auto-refresh when empresa changes
  useEffect(() => {
    if (empresaId) {
      console.log('Empresa changed to:', empresaId);
      refetch();
    }
  }, [empresaId, refetch]);

  // Aplicar filtros aos indicadores
  const indicadoresFiltrados = indicadores?.filter(indicador => {
    if (filters.tipoIndicador !== 'todos' && indicador.tipo !== filters.tipoIndicador) {
      return false;
    }
    if (filters.status !== 'todos' && indicador.performance.anual.status !== filters.status) {
      return false;
    }
    if (filters.tipoVisualizacao !== 'todos' && indicador.tipoVisualizacao !== filters.tipoVisualizacao) {
      return false;
    }
    return true;
  }) || [];

  // Estatísticas resumidas
  const stats = indicadores ? {
    total: indicadores.length,
    acima: indicadores.filter(i => i.performance.anual.status === 'acima').length,
    dentro: indicadores.filter(i => i.performance.anual.status === 'dentro').length,
    abaixo: indicadores.filter(i => i.performance.anual.status === 'abaixo').length,
    cards: indicadores.filter(i => i.tipoVisualizacao === 'card').length,
    charts: indicadores.filter(i => i.tipoVisualizacao === 'chart').length,
    lists: indicadores.filter(i => i.tipoVisualizacao === 'list').length
  } : null;

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refetch();
  };

  return {
    ano,
    empresaId,
    setEmpresaId,
    filters,
    setFilters,
    empresasDisponiveis,
    isLoadingEmpresas,
    empresasError,
    indicadores,
    indicadoresFiltrados,
    isLoading,
    error,
    stats,
    handleRefresh
  };
}
