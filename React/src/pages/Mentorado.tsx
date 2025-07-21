
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { InfoTab } from "@/components/mentorado/tabs/InfoTab";
import { MetasTab } from "@/components/mentorado/tabs/MetasTab";
import { FinanceiroTab } from "@/components/mentorado/tabs/FinanceiroTab";
import { KPIsTab } from "@/components/mentorado/tabs/KPIsTab";
import { EmpresasMentorado } from "@/components/mentorado/EmpresasMentorado";
import { EditarPerfilPrincipalDialog } from "@/components/mentorado/dependentes/EditarPerfilPrincipalDialog";
import { fetchMentoradoPorEmail } from "@/api/mentorado-api";
import type { Mentorado as MentoradoType } from "@/types/mentorado";
import { Loader2, Edit } from "lucide-react";

const Mentorado = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("informacoes");
  const { user } = useAuth();
  const [mentoradoData, setMentoradoData] = useState<MentoradoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPerfil, setEditingPerfil] = useState(false);

  

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Meu Perfil de Mentorado"
          description="Visualize e gerencie suas informações pessoais, empresas e metas"
          colorScheme="blue"
        />

        <div className="space-y-6">
          <Card className="bg-blue-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle>Bem-vindo ao Grow Up Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Este é seu espaço centralizado para gerenciar seu perfil, empresas vinculadas e acompanhar
                sua evolução dentro do programa de mentoria.
              </p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="mt-6">
              <InfoTab/>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
};

export default Mentorado;
