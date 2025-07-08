
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

  const loadMentoradoData = async () => {
    if (user && user.email) {
      setLoading(true);
      try {
        const data = await fetchMentoradoPorEmail(user.email);
        if (data) {
          setMentoradoData(data);
        } else {
          console.error("No mentorado data found for email:", user.email);
          setMentoradoData({
            id: user.id || "user-id",
            nome: user.nome || user.user_metadata?.nome || user.email.split('@')[0],
            email: user.email,
            cpf: "",
            telefone: "",
            dataNascimento: "",
            status: "ativo",
            empresa: ""
          });
          toast({
            title: "Dados incompletos",
            description: "Alguns dados do seu perfil podem estar incompletos.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error loading mentorado data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados de mentorado.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMentoradoData();
  }, [user, toast]);

  const handleEditSuccess = () => {
    setEditingPerfil(false);
    loadMentoradoData();
    toast({
      title: "Perfil atualizado",
      description: "As informações foram atualizadas com sucesso!",
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Meu Perfil de Mentorado"
          description="Visualize e gerencie suas informações pessoais, empresas e metas"
          colorScheme="blue"
          actions={
            <Button 
              onClick={() => setEditingPerfil(true)} 
              className="bg-red-600 hover:bg-red-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          }
          badges={[
            { label: `Pontuação: 425`, variant: "outline" },
            { label: "Nível: Avançado", variant: "default" },
            { label: `Ranking: #5`, variant: "outline" }
          ]}
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
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="metas">Metas</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="mt-6">
              <InfoTab mentorado={mentoradoData} />
            </TabsContent>
            
            <TabsContent value="empresas" className="mt-6">
              <EmpresasMentorado />
            </TabsContent>
            
            <TabsContent value="metas" className="mt-6">
              <MetasTab mentoradoId={mentoradoData?.id || ""} />
            </TabsContent>
            
            <TabsContent value="financeiro" className="mt-6">
              <FinanceiroTab mentoradoId={mentoradoData?.id || ""} />
            </TabsContent>
            
            <TabsContent value="kpis" className="mt-6">
              <KPIsTab mentoradoId={mentoradoData?.id || ""} />
            </TabsContent>
          </Tabs>

          {mentoradoData && (
            <EditarPerfilPrincipalDialog
              open={editingPerfil}
              onOpenChange={setEditingPerfil}
              mentorado={mentoradoData}
              onSuccess={handleEditSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentorado;
