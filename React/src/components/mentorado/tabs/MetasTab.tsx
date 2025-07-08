
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Calculator, Plus } from "lucide-react";
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { MetasIndicadoresDialog } from '@/components/metas/MetasIndicadoresDialog';
import { IndicadorProprioDialog } from '@/components/metas/IndicadorProprioDialog';
import { MetasIndicadoresTable } from '@/components/metas/MetasIndicadoresTable';
import { IndicadoresPropriosTable } from '@/components/metas/IndicadoresPropriosTable';

type MetasTabProps = {
  mentoradoId: string;
};

export function MetasTab({ mentoradoId }: MetasTabProps) {
  // Use hooks directly instead of useMetas
  const metasIndicadores = useMetasIndicadores(mentoradoId);
  const metasIndicadoresEmpresa = useMetasIndicadoresEmpresa(mentoradoId);
  const indicadoresEmpresa = useIndicadoresProprios(mentoradoId);

  const isLoading = metasIndicadores.isLoading || metasIndicadoresEmpresa.isLoading || indicadoresEmpresa.isLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando metas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestão de Metas</h3>
        <div className="flex gap-2">
          <IndicadorProprioDialog 
            empresaId={mentoradoId}
            trigger={
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Novo Indicador
              </Button>
            }
          />
          <MetasIndicadoresDialog 
            empresaId={mentoradoId}
            trigger={
              <Button className="bg-red-600 hover:bg-red-700">
                <Target className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            }
          />
        </div>
      </div>

      <Tabs defaultValue="metas-mentor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metas-mentor">Metas dos Indicadores</TabsTrigger>
          <TabsTrigger value="indicadores-proprios">Meus Indicadores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metas-mentor" className="space-y-4">
          <MetasIndicadoresTable metas={metasIndicadores.data || []} />
        </TabsContent>
        
        <TabsContent value="indicadores-proprios" className="space-y-4">
          <IndicadoresPropriosTable 
            indicadores={indicadoresEmpresa.indicadoresProprios.data || []}
            metasIndicadoresProprios={metasIndicadoresEmpresa.data || []}
            empresaId={mentoradoId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
