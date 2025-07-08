
import { useState, useEffect, useCallback } from 'react';
import { useAnaliseOrcamentariaData } from '@/hooks/analise-orcamentaria/useAnaliseOrcamentariaData';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';

// Função para limpar referências antigas de empresas no localStorage
const clearOldEmpresaReferences = () => {
  console.log('Limpando referências antigas de empresas...');
  
  const keysToCheck = ['selectedEmpresa', 'lastSelectedEmpresa', 'analiseOrcamentaria'];
  keysToCheck.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      console.log(`Removendo referência antiga: ${key} = ${item}`);
      localStorage.removeItem(key);
    }
  });
};

export function useAnaliseOrcamentariaState() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

  const { data: empresas = [], isLoading: isLoadingEmpresas, error: empresasError } = useEmpresasOrcamento();
  
  console.log('useAnaliseOrcamentariaState - Estado atual:', {
    empresasTotal: empresas.length,
    selectedYear,
    selectedEmpresa,
    isLoadingEmpresas,
    empresasError: empresasError?.message
  });

  // Função para validar se uma empresa ainda é válida
  const validateEmpresaSelection = useCallback((empresaId: string, year: number, availableEmpresas: any[]) => {
    console.log('Validando seleção de empresa:', { empresaId, year, availableCount: availableEmpresas.length });
    
    const empresasParaAno = availableEmpresas.filter(empresa => empresa.ano === year);
    const empresaEncontrada = empresasParaAno.find(e => e.id === empresaId);
    
    if (!empresaEncontrada) {
      console.warn('Empresa selecionada não encontrada ou inválida:', {
        empresaId,
        year,
        empresasDisponiveis: empresasParaAno.map(e => ({ id: e.id, nome: e.nome }))
      });
      return false;
    }
    
    console.log('Empresa validada com sucesso:', empresaEncontrada.nome);
    return true;
  }, []);

  // Auto-seleção da primeira empresa quando carregam os dados
  useEffect(() => {
    if (!isLoadingEmpresas && empresas.length > 0) {
      const empresasParaAno = empresas.filter(empresa => empresa.ano === selectedYear);
      
      console.log('Processando auto-seleção de empresa:', {
        empresasTotal: empresas.length,
        empresasParaAno: empresasParaAno.length,
        selectedEmpresa,
        selectedYear
      });

      // Se há empresa selecionada, validar se ainda é válida
      if (selectedEmpresa) {
        const isValid = validateEmpresaSelection(selectedEmpresa, selectedYear, empresas);
        
        if (!isValid) {
          console.log('Empresa selecionada inválida, limpando seleção...');
          setSelectedEmpresa('');
          clearOldEmpresaReferences();
        } else {
          console.log('Empresa selecionada ainda é válida');
          return; // Manter seleção atual se válida
        }
      }

      // Selecionar primeira empresa disponível se não há seleção ou seleção inválida
      if (!selectedEmpresa && empresasParaAno.length > 0) {
        const empresaParaSelecionar = empresasParaAno[0];
        console.log('Auto-selecionando primeira empresa disponível:', {
          empresa: empresaParaSelecionar.nome,
          id: empresaParaSelecionar.id,
          ano: empresaParaSelecionar.ano
        });
        setSelectedEmpresa(empresaParaSelecionar.id);
      } else if (empresasParaAno.length === 0) {
        console.log('Nenhuma empresa disponível para o ano:', selectedYear);
        if (selectedEmpresa) {
          console.log('Limpando empresa selecionada pois não há empresas para o ano');
          setSelectedEmpresa('');
          clearOldEmpresaReferences();
        }
      }
    }
  }, [empresas, isLoadingEmpresas, selectedYear, selectedEmpresa, validateEmpresaSelection]);

  // Limpar empresa selecionada quando o ano muda e validar nova seleção
  useEffect(() => {
    if (!isLoadingEmpresas && empresas.length > 0) {
      const empresasParaAno = empresas.filter(e => e.ano === selectedYear);
      
      console.log('Mudança de ano detectada:', {
        novoAno: selectedYear,
        empresasDisponiveis: empresasParaAno.length,
        empresaSelecionada: selectedEmpresa
      });

      if (empresasParaAno.length === 0) {
        console.log('Nenhuma empresa disponível para o novo ano, limpando seleção');
        setSelectedEmpresa('');
        clearOldEmpresaReferences();
      } else if (selectedEmpresa && !empresasParaAno.find(e => e.id === selectedEmpresa)) {
        console.log('Empresa selecionada não disponível no novo ano, selecionando primeira disponível');
        setSelectedEmpresa(empresasParaAno[0].id);
        clearOldEmpresaReferences();
      }
    }
  }, [selectedYear, empresas, selectedEmpresa, isLoadingEmpresas]);

  // Hook para carregar dados da análise com validação adicional
  const { data: analysisData, isLoading: isLoadingAnalysis, error } = useAnaliseOrcamentariaData(
    selectedYear, 
    selectedEmpresa || undefined,
    selectedMonth
  );

  console.log('useAnaliseOrcamentariaState - Dados da análise:', {
    hasAnalysisData: !!analysisData,
    isLoadingAnalysis,
    analysisError: error?.message,
    receitaOrcada: analysisData?.receitaLiquidaOrcada,
    receitaRealizada: analysisData?.receitaLiquidaRealizada
  });

  // Validação mais permissiva para dados válidos
  const hasValidData = analysisData && (
    (typeof analysisData.receitaLiquidaOrcada === 'number') ||
    (typeof analysisData.receitaLiquidaRealizada === 'number') ||
    (analysisData.dadosMensais && analysisData.dadosMensais.length > 0) ||
    (analysisData.dadosHierarquicos && 
     analysisData.dadosHierarquicos.grupos && 
     analysisData.dadosHierarquicos.grupos.length > 0) ||
    (analysisData.indicadoresDetalhados && analysisData.indicadoresDetalhados.length > 0)
  );

  const handleEmpresaChange = useCallback((empresaId: string) => {
    console.log('Mudando empresa para:', empresaId);
    
    // Validar se a empresa é válida antes de selecionar
    if (empresaId && empresas.length > 0) {
      const isValid = validateEmpresaSelection(empresaId, selectedYear, empresas);
      if (!isValid) {
        console.warn('Tentativa de selecionar empresa inválida, ignorando...');
        return;
      }
    }
    
    // Limpar cache antigo quando mudando empresa
    if (selectedEmpresa && selectedEmpresa !== empresaId) {
      clearOldEmpresaReferences();
    }
    
    setSelectedEmpresa(empresaId);
  }, [empresas, selectedYear, selectedEmpresa, validateEmpresaSelection]);

  const handleMonthChange = useCallback((month: number | undefined) => {
    console.log('Mudando mês para:', month);
    setSelectedMonth(month);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Forçando refresh da página e limpando cache local');
    
    // Limpar todo cache relacionado a análise orçamentária
    clearOldEmpresaReferences();
    
    // Forçar reload da página
    window.location.reload();
  }, []);

  const isLoading = isLoadingEmpresas || (selectedEmpresa && isLoadingAnalysis);
  const empresasParaAno = empresas.filter(e => e.ano === selectedYear);
  
  console.log('useAnaliseOrcamentariaState - Estado final:', {
    isLoading,
    hasValidData,
    empresasParaAnoCount: empresasParaAno.length,
    selectedEmpresa,
    empresasDisponiveis: empresasParaAno.map(e => ({ id: e.id, nome: e.nome }))
  });
  
  return {
    // State
    selectedYear,
    selectedEmpresa,
    selectedMonth,
    
    // Data
    empresas,
    analysisData,
    
    // Loading states
    isLoadingEmpresas,
    isLoadingAnalysis,
    isLoading,
    
    // Error states
    empresasError,
    error,
    
    // Computed states
    hasValidData,
    empresasParaAno,
    
    // Handlers
    setSelectedYear,
    handleEmpresaChange,
    handleMonthChange,
    handleRefresh
  };
}
