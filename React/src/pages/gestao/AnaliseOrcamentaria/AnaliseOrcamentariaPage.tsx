
import React from 'react';
import { Header } from '@/components/layout/Header';
import { AnaliseOrcamentariaControls } from '@/components/analise-orcamentaria/AnaliseOrcamentariaControls';
import { AnaliseOrcamentariaContent } from './components/AnaliseOrcamentariaContent';
import { AnaliseOrcamentariaLoadingState } from './components/AnaliseOrcamentariaLoadingState';
import { AnaliseOrcamentariaErrorState } from './components/AnaliseOrcamentariaErrorState';
import { AnaliseOrcamentariaEmptyState } from './components/AnaliseOrcamentariaEmptyState';
import { AnaliseOrcamentariaProfileErrorState } from './components/AnaliseOrcamentariaProfileErrorState';
import { useAnaliseOrcamentariaState } from './hooks/useAnaliseOrcamentariaState';
import { formatCurrency, getVarianceVariant, getCumulativeData } from './utils/analiseOrcamentariaUtils';

export default function AnaliseOrcamentariaPage() {
  const {
    selectedYear,
    selectedEmpresa,
    selectedMonth,
    empresas,
    analysisData,
    isLoadingEmpresas,
    isLoadingAnalysis,
    isLoading,
    empresasError,
    error,
    hasValidData,
    empresasParaAno,
    setSelectedYear,
    handleEmpresaChange,
    handleMonthChange,
    handleRefresh
  } = useAnaliseOrcamentariaState();

  console.log('AnaliseOrcamentariaPage - Renderizando com estado:', {
    empresasCarregadas: empresas.length,
    empresasParaAno: empresasParaAno.length,
    empresaSelecionada: selectedEmpresa,
    hasValidData,
    isLoading,
    isLoadingEmpresas,
    isLoadingAnalysis,
    empresasError: empresasError?.message,
    error: error?.message
  });

  // Verificar erros específicos de perfil/autenticação
  const isProfileError = empresasError?.message?.includes('Perfil do usuário') ||
                        empresasError?.message?.includes('permission denied') ||
                        empresasError?.message?.includes('Sem permissão');

  // Estados de erro críticos primeiro
  if (empresasError) {
    console.log('Erro ao carregar empresas:', empresasError.message);
    
    // Erro específico de perfil/permissão
    if (isProfileError) {
      return (
        <div className="h-full">
          <div className="container mx-auto px-6 py-6">
            <Header 
              title="Análise Orçamentária" 
              description="Problema de autenticação"
              colorScheme="red"
            />
            <AnaliseOrcamentariaProfileErrorState
              title="Problema de Perfil de Usuário"
              description="Seu perfil não está configurado corretamente ou você não tem permissão para acessar esta funcionalidade."
              errorMessage={empresasError.message}
            />
          </div>
        </div>
      );
    }
    
    // Outros erros
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Análise Orçamentária" 
            description="Erro ao carregar empresas"
            colorScheme="red"
          />
          <AnaliseOrcamentariaErrorState
            title="Erro ao Carregar Empresas"
            description="Não foi possível carregar as empresas disponíveis."
            errorMessage={empresasError.message}
          />
        </div>
      </div>
    );
  }

  // Estado de carregamento apenas para empresas na primeira carga
  if (isLoadingEmpresas && empresas.length === 0) {
    console.log('Carregando empresas...');
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Análise Orçamentária" 
            description="Carregando..."
            colorScheme="blue"
          />
          <AnaliseOrcamentariaLoadingState message="Carregando empresas..." />
        </div>
      </div>
    );
  }

  // Estados vazios
  if (!isLoadingEmpresas && empresas.length === 0) {
    console.log('Nenhuma empresa disponível');
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Análise Orçamentária" 
            description="Nenhuma empresa disponível"
            colorScheme="blue"
          />
          <AnaliseOrcamentariaEmptyState
            title="Nenhuma Empresa Disponível"
            description="Não há empresas com orçamentos criados."
          />
        </div>
      </div>
    );
  }

  if (!isLoadingEmpresas && empresasParaAno.length === 0) {
    console.log('Nenhuma empresa para o ano:', selectedYear);
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Análise Orçamentária" 
            description={`Ano ${selectedYear}`}
            colorScheme="blue"
          />
          <AnaliseOrcamentariaEmptyState
            title={`Nenhuma Empresa para ${selectedYear}`}
            description={`Não há empresas com orçamento para o ano ${selectedYear}.`}
            additionalInfo={[
              `Anos disponíveis: ${Array.from(new Set(empresas.map(e => e.ano))).sort().join(', ')}`
            ]}
          />
        </div>
      </div>
    );
  }

  // Erro na análise só depois de ter empresa selecionada
  if (error && selectedEmpresa && !isLoadingAnalysis) {
    console.log('Erro ao carregar dados de análise:', error.message);
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Análise Orçamentária" 
            description="Erro ao carregar dados"
            colorScheme="red"
          />
          <div className="space-y-6">
            <AnaliseOrcamentariaControls
              selectedYear={selectedYear}
              selectedEmpresa={selectedEmpresa}
              selectedMonth={selectedMonth}
              empresas={empresas}
              onYearChange={setSelectedYear}
              onEmpresaChange={handleEmpresaChange}
              onMonthChange={handleMonthChange}
              onRefresh={handleRefresh}
            />
            <AnaliseOrcamentariaErrorState
              title="Erro ao Carregar Dados"
              description="Não foi possível carregar os dados da análise."
              errorMessage={error.message}
            />
          </div>
        </div>
      </div>
    );
  }

  // Calcular dados cumulativos para o header
  const isCumulative = selectedMonth !== undefined;
  const hasCumulativeData = analysisData?.receitaLiquidaOrcadaCumulativa !== undefined;
  const { receitaRealizada, varianciaPercentual, status } = getCumulativeData(analysisData, isCumulative && hasCumulativeData);

  console.log('Renderizando conteúdo principal - selectedEmpresa:', selectedEmpresa);

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header 
          title="Análise Orçamentária" 
          description="Análise da performance financeira comparando valores orçados com realizados"
          colorScheme="blue"
          badges={analysisData ? [
            { label: `Ano: ${selectedYear}`, variant: "outline" as const },
            ...(selectedMonth ? [{ label: `Até: ${selectedMonth}/${selectedYear}`, variant: "outline" as const }] : []),
            { label: `Receita Líquida: ${formatCurrency(receitaRealizada)}`, variant: "outline" as const },
            { 
              label: `Variação: ${varianciaPercentual >= 0 ? '+' : ''}${varianciaPercentual.toFixed(1)}%`, 
              variant: getVarianceVariant(status)
            }
          ] : []}
        />
        
        <div className="space-y-6">
          <AnaliseOrcamentariaControls
            selectedYear={selectedYear}
            selectedEmpresa={selectedEmpresa}
            selectedMonth={selectedMonth}
            empresas={empresas}
            onYearChange={setSelectedYear}
            onEmpresaChange={handleEmpresaChange}
            onMonthChange={handleMonthChange}
            onRefresh={handleRefresh}
          />

          {isLoadingAnalysis && selectedEmpresa ? (
            <AnaliseOrcamentariaLoadingState message="Carregando análise..." />
          ) : !selectedEmpresa ? (
            <AnaliseOrcamentariaEmptyState
              title="Selecione uma Empresa"
              description="Escolha uma empresa para visualizar a análise orçamentária."
              additionalInfo={[
                `${empresasParaAno.length} empresa(s) disponível(is) para ${selectedYear}`
              ]}
            />
          ) : !hasValidData ? (
            <AnaliseOrcamentariaEmptyState
              title="Sem Dados Orçamentários"
              description="Não foram encontrados dados suficientes para análise."
              additionalInfo={[
                'Verifique se o orçamento possui valores lançados',
                'Confirme se há dados para o ano selecionado'
              ]}
            />
          ) : (
            <AnaliseOrcamentariaContent
              selectedEmpresa={selectedEmpresa}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              analysisData={analysisData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
