
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Target, Calculator } from "lucide-react";
import { MetasIndicadoresTable } from './MetasIndicadoresTable';
import { IndicadoresPropriosTable } from './IndicadoresPropriosTable';
import { MetasIndicadoresDialog } from './MetasIndicadoresDialog';
import { IndicadorProprioDialog } from './IndicadorProprioDialog';
import { MetaIndicadorCompleta, MetaIndicadorEmpresaCompleta, IndicadorEmpresa } from '@/types/metas.types';

interface MetasMainContentProps {
  empresaId: string | null;
  metasIndicadores: MetaIndicadorCompleta[];
  metasIndicadoresEmpresa: MetaIndicadorEmpresaCompleta[];
  indicadoresEmpresa: IndicadorEmpresa[];
  isLoading: boolean;
}

export function MetasMainContent({ 
  empresaId, 
  metasIndicadores, 
  metasIndicadoresEmpresa, 
  indicadoresEmpresa,
  isLoading 
}: MetasMainContentProps) {
  console.log('=== MetasMainContent ===');
  console.log('Empresa ID:', empresaId);
  console.log('Props received:', {
    metasIndicadores: metasIndicadores.length,
    metasIndicadoresEmpresa: metasIndicadoresEmpresa.length,
    indicadoresEmpresa: indicadoresEmpresa.length,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="plano-contas" className="space-y-6">
      <TabsList>
        <TabsTrigger value="plano-contas">Indicadores do Plano de Contas</TabsTrigger>
        <TabsTrigger value="proprios">Meus Indicadores</TabsTrigger>
      </TabsList>

      <TabsContent value="plano-contas">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Indicadores do Plano de Contas</h3>
            {empresaId && (
              <MetasIndicadoresDialog 
                empresaId={empresaId}
                trigger={
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Target className="h-4 w-4 mr-2" />
                    Nova Meta
                  </Button>
                }
              />
            )}
          </div>
          <MetasIndicadoresTable 
            metas={metasIndicadores}
          />
        </div>
      </TabsContent>

      <TabsContent value="proprios">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Meus Indicadores</h3>
            {empresaId && (
              <div className="flex gap-2">
                <IndicadorProprioDialog 
                  empresaId={empresaId}
                  trigger={
                    <Button variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Novo Indicador Próprio
                    </Button>
                  }
                />
                <MetasIndicadoresDialog 
                  empresaId={empresaId}
                  trigger={
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Target className="h-4 w-4 mr-2" />
                      Nova Meta
                    </Button>
                  }
                />
              </div>
            )}
          </div>
          <IndicadoresPropriosTable 
            indicadores={indicadoresEmpresa}
            metasIndicadoresProprios={metasIndicadoresEmpresa}
            empresaId={empresaId}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
