
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { FaixasFaturamentoTab } from './configuracao-sistema/FaixasFaturamentoTab';
import { CalculosTab } from './configuracao-sistema/CalculosTab';
import { IATab } from './configuracao-sistema/IATab';
import { FormulasTab } from './configuracao-sistema/FormulasTab';
import { APIsTab } from './configuracao-sistema/APIsTab';
import { useConfiguracaoSistema } from './configuracao-sistema/hooks/useConfiguracaoSistema';

export function ConfiguracaoSistema() {
  const {
    faixasFaturamento,
    configCalculos,
    parametrosIA,
    formulaTeste,
    resultadoTeste,
    testando,
    hasUnsavedChanges,
    isLoadingFaixas,
    setConfigCalculos,
    setParametrosIA,
    setFormulaTeste,
    adicionarFaixa,
    removerFaixa,
    atualizarFaixa,
    testarFormulaClick,
    salvarConfiguracoes
  } = useConfiguracaoSistema();

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Configuração do Sistema"
          description="Configure parâmetros gerais, faixas de faturamento e algoritmos do sistema"
          colorScheme="yellow"
          actions={
            <button
              onClick={salvarConfiguracoes}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                hasUnsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Salvar Configurações
            </button>
          }
        />

        <Tabs defaultValue="faturamento" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="faturamento">Faixas de Faturamento</TabsTrigger>
            <TabsTrigger value="calculos">Cálculos</TabsTrigger>
            <TabsTrigger value="ia">Parâmetros IA</TabsTrigger>
            <TabsTrigger value="formulas">Teste de Fórmulas</TabsTrigger>
            <TabsTrigger value="apis">APIs Externas</TabsTrigger>
          </TabsList>

          <TabsContent value="faturamento" className="space-y-4">
            <FaixasFaturamentoTab
              faixasFaturamento={faixasFaturamento}
              isLoadingFaixas={isLoadingFaixas}
              onAdicionarFaixa={adicionarFaixa}
              onRemoverFaixa={removerFaixa}
              onAtualizarFaixa={atualizarFaixa}
            />
          </TabsContent>

          <TabsContent value="calculos" className="space-y-4">
            <CalculosTab
              configCalculos={configCalculos}
              setConfigCalculos={setConfigCalculos}
            />
          </TabsContent>

          <TabsContent value="ia" className="space-y-4">
            <IATab
              parametrosIA={parametrosIA}
              setParametrosIA={setParametrosIA}
            />
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <FormulasTab
              formulaTeste={formulaTeste}
              setFormulaTeste={setFormulaTeste}
              resultadoTeste={resultadoTeste}
              testando={testando}
              onTestarFormula={testarFormulaClick}
            />
          </TabsContent>

          <TabsContent value="apis" className="space-y-4">
            <APIsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
