
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
              isLoadingFaixas={isLoadingFaixas}
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
