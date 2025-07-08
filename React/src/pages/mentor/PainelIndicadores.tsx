
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { TabelaIndicadoresPorEmpresa } from '@/components/painel-indicadores/TabelaIndicadoresPorEmpresa';
import { TabelaIndicadoresPorFaixa } from '@/components/painel-indicadores/TabelaIndicadoresPorFaixa';
import { usePainelIndicadoresUltraSimplified } from '@/hooks/painel-indicadores/usePainelIndicadoresUltraSimplified';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PainelIndicadores() {
  console.log('🎯 PainelIndicadores - Using ULTRA SIMPLIFIED hook');
  
  const { data, isLoading, error, recalcularMedias, isRecalculando } = usePainelIndicadoresUltraSimplified();

  console.log('🎯 PainelIndicadores - Ultra simplified hook state:', { 
    hasData: !!data, 
    isLoading, 
    hasError: !!error,
    isRecalculando,
    dataStructure: data ? {
      empresas: data.empresas?.length,
      faixas: data.faixasFaturamento?.length,
      indicadores: data.indicadoresPlano?.length
    } : null
  });

  if (isLoading) {
    console.log('⏳ ULTRA SIMPLIFIED - Showing loading state');
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header
            title="Painel de Indicadores"
            description="Análise das médias de indicadores por empresa e faixa de faturamento"
            colorScheme="yellow"
          />
          
          <div className="space-y-6">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Carregando Painel Ultra Simplificado</h3>
                  <p className="text-muted-foreground">
                    Processando apenas indicadores percentuais...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('💥 ULTRA SIMPLIFIED - Error state:', error);
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header
            title="Painel de Indicadores"
            description="Erro no carregamento dos dados"
            colorScheme="yellow"
          />
          
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Erro no Painel Ultra Simplificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">Erro crítico no carregamento:</p>
                <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded">
                  {error.message}
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    console.warn('⚠️ ULTRA SIMPLIFIED - No data available');
    return (
      <div className="h-full">
        <div className="container mx-auto px-6 py-6">
          <Header
            title="Painel de Indicadores"
            description="Nenhum dado disponível"
            colorScheme="yellow"
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Nenhum dado disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Falha crítica: nenhum dado foi gerado pelo sistema ultra simplificado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  console.log('✅ ULTRA SIMPLIFIED - Rendering main content:', {
    empresasCount: data.empresas?.length,
    faixasCount: data.faixasFaturamento?.length,
    indicadoresCount: data.indicadoresPlano?.length,
    firstEmpresaIndicadores: data.empresas?.[0]?.indicadores?.length,
    firstFaixaIndicadores: data.faixasFaturamento?.[0]?.indicadores?.length
  });

  // Calculate last update date
  const ultimaAtualizacao = data?.indicadoresMedias?.[0]?.updated_at 
    ? new Date(data.indicadoresMedias[0].updated_at).toLocaleDateString('pt-BR')
    : '--';

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Painel de Indicadores"
          description="Análise das médias de indicadores por empresa e faixa de faturamento"
          colorScheme="yellow"
          actions={
            <Button
              onClick={() => recalcularMedias()}
              className="gap-2"
              disabled={isRecalculando}
            >
              <RefreshCw className={`h-4 w-4 ${isRecalculando ? 'animate-spin' : ''}`} />
              {isRecalculando ? 'Recalculando...' :  'Recalcular Médias'}
            </Button>
          }
          badges={[
            { label: `Empresas: ${data.empresas?.length || 0}`, variant: "outline" },
            { label: `Indicadores: ${data.indicadoresPlano?.length || 0}`, variant: "outline" },
            { label: `Última atualização: ${ultimaAtualizacao}`, variant: "outline" }
          ]}
        />
        
        <div className="space-y-6">
          <Tabs defaultValue="empresas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="empresas">Médias por Empresa ({data.empresas?.length || 0})</TabsTrigger>
              <TabsTrigger value="faixas">Médias por Faixa de Faturamento ({data.faixasFaturamento?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="empresas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Percentuais por Empresa</CardTitle>
                </CardHeader>
                <CardContent>
                  <TabelaIndicadoresPorEmpresa data={data} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faixas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Percentuais por Faixa de Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <TabelaIndicadoresPorFaixa data={data} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
