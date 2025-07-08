
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mentorado } from "@/types/mentorado";
import { MentoradoHeader } from "./MentoradoHeader";
import { InfoTab } from "./tabs/InfoTab";
import { MetasTab } from "./tabs/MetasTab";
import { FinanceiroTab } from "./tabs/FinanceiroTab";
import { KPIsTab } from "./tabs/KPIsTab";
import { DependentesTab } from "./DependentesTab";
import { Loader2 } from "lucide-react";

interface MentoradoDetailsProps {
  mentoradoSelecionado: Mentorado | null;
  isLoading: boolean;
  onMentoradoDeleted?: () => void;
  onMentoradoUpdated?: () => void;
}

export function MentoradoDetails({ 
  mentoradoSelecionado, 
  isLoading, 
  onMentoradoDeleted,
  onMentoradoUpdated 
}: MentoradoDetailsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mentoradoSelecionado) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Selecione um mentorado para visualizar os detalhes
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MentoradoHeader 
        mentorado={mentoradoSelecionado} 
        onMentoradoDeleted={onMentoradoDeleted}
        onMentoradoUpdated={onMentoradoUpdated}
      />
      
      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="dependentes">Dependentes</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informacoes" className="mt-6">
          <InfoTab mentorado={mentoradoSelecionado} />
        </TabsContent>
        
        <TabsContent value="dependentes" className="mt-6">
          <DependentesTab mentoradoId={mentoradoSelecionado.id} />
        </TabsContent>
        
        <TabsContent value="metas" className="mt-6">
          <MetasTab mentoradoId={mentoradoSelecionado.id} />
        </TabsContent>
        
        <TabsContent value="financeiro" className="mt-6">
          <FinanceiroTab mentoradoId={mentoradoSelecionado.id} />
        </TabsContent>
        
        <TabsContent value="kpis" className="mt-6">
          <KPIsTab mentoradoId={mentoradoSelecionado.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
