
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useEmpresas } from "@/hooks/use-empresas";
import { Loader2, AlertCircle, Eye, FileText, Check, X, RefreshCw, PauseCircle, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetalhesEmpresaCompleto } from "@/components/empresa/DetalhesEmpresaCompleto";
import { NovaEmpresaAdminDialog } from "@/components/empresa/NovaEmpresaAdminDialog";
import { useCNPJApi } from "@/hooks/use-cnpj-api";
import { Badge } from "@/components/ui/badge";
import { AdminPasswordDialog } from "@/components/admin/AdminPasswordDialog";

const GestaoCNPJ = () => {
  console.log("GestaoCNPJ - Component rendering start");
  
  // Debug marker to help identify if component mounts
  useEffect(() => {
    console.log("GestaoCNPJ - Component mounted");
    
    // Debug message after render
    setTimeout(() => {
      console.log("GestaoCNPJ - Component did render");
      console.log("GestaoCNPJ - Document body:", document.body.innerHTML.includes("Gestão de CNPJs"));
    }, 100);
    
    return () => console.log("GestaoCNPJ - Component unmounted");
  }, []);

  const { 
    empresasAguardando, 
    empresasAtivas, 
    autorizarEmpresa, 
    recusarEmpresa,
    atualizarEmpresaCNPJ,
    suspenderEmpresa,
    excluirEmpresa,
    isLoading,
    isAutorizando,
    isRecusando,
    isAtualizando,
    isSuspendendo,
    isExcluindo
  } = useEmpresas();
  console.log("GestaoCNPJ - useEmpresas hook loaded:", !!empresasAtivas);
  
  const { consultarCNPJ } = useCNPJApi();
  const [empresaParaExcluir, setEmpresaParaExcluir] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Debug - check data
  useEffect(() => {
    console.log("GestaoCNPJ - empresasAguardando:", empresasAguardando);
    console.log("GestaoCNPJ - empresasAtivas:", empresasAtivas);
  }, [empresasAguardando, empresasAtivas]);

  const handleAutorizar = async (id: string) => {
    try {
      await autorizarEmpresa(id);
    } catch (error) {
      console.error("Erro ao autorizar empresa:", error);
    }
  };

  const handleRecusar = async (id: string) => {
    try {
      await recusarEmpresa(id);
    } catch (error) {
      console.error("Erro ao recusar empresa:", error);
    }
  };

  const handleAtualizarCNPJ = async (id: string, cnpj: string) => {
    try {
      toast({
        title: "Atualizando empresa",
        description: "Buscando dados atualizados do CNPJ...",
      });
      await atualizarEmpresaCNPJ(id, cnpj);
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
    }
  };

  const handleSuspender = async (id: string) => {
    try {
      await suspenderEmpresa(id);
    } catch (error) {
      console.error("Erro ao suspender empresa:", error);
    }
  };

  const handleExcluirEmpresa = (id: string) => {
    setEmpresaParaExcluir(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (password: string) => {
    if (!empresaParaExcluir) return;
    
    try {
      await excluirEmpresa(empresaParaExcluir, password);
      setEmpresaParaExcluir(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ativo') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Ativa</Badge>;
    } else if (status === 'suspenso') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Suspensa</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  // Log before render
  console.log("GestaoCNPJ - About to render UI");

  return (
    <div className="h-full" data-testid="gestao-cnpj-page">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gestão de CNPJs"
          description="Gerencie todas as empresas do sistema, autorize novas solicitações e visualize dados das empresas cadastradas"
          colorScheme="yellow"
          actions={<NovaEmpresaAdminDialog />}
        />

        {/* Debug marker to help identify if tab content is being rendered */}
        <div className="hidden">Marker: GestaoCNPJ Component Content</div>

        <Tabs defaultValue="autorizadas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="autorizadas">
              Empresas Autorizadas
            </TabsTrigger>
            <TabsTrigger value="pendentes" className="relative">
              Aguardando Autorização
              {empresasAguardando.data && empresasAguardando.data.length > 0 && (
                <Badge className="ml-2 bg-red-500 hover:bg-red-600">{empresasAguardando.data.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="autorizadas" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : empresasAtivas.data && empresasAtivas.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {empresasAtivas.data.map((empresa) => (
                  <Card key={empresa.id} className="border border-slate-300 h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{empresa.nome_fantasia}</h4>
                            <p className="text-sm text-muted-foreground">
                              {empresa.nome}
                            </p>
                          </div>
                          {getStatusBadge(empresa.status || 'ativo')}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          CNPJ: {empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Usuários: {empresa.usuarios_autorizados}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Setor: {empresa.setor}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Porte: {empresa.porte}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2">
                        <Button variant="outline" className="flex items-center gap-2"
                          onClick={() => handleAtualizarCNPJ(empresa.id, empresa.cnpj)}
                          disabled={isAtualizando}
                        >
                          <RefreshCw size={16} className={isAtualizando ? "animate-spin" : ""} />
                          Atualizar CNPJ
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2"
                          onClick={() => handleSuspender(empresa.id)}
                          disabled={isSuspendendo}
                        >
                          <PauseCircle size={16} />
                          {empresa.status === 'suspenso' ? 'Reativar' : 'Suspender'}
                        </Button>
                        <DetalhesEmpresaCompleto
                          empresaId={empresa.id}
                          trigger={
                            <Button variant="outline" className="flex items-center gap-2">
                              <FileText size={16} />
                              Detalhes
                            </Button>
                          }
                        />
                        <Button variant="destructive" className="flex items-center gap-2"
                          onClick={() => handleExcluirEmpresa(empresa.id)}
                          disabled={isExcluindo}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-slate-300">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhuma empresa autorizada</p>
                  <p className="text-muted-foreground">
                    Não há empresas autorizadas no sistema. Quando você autorizar uma solicitação,
                    ela aparecerá aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pendentes" className="space-y-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : empresasAguardando.data && empresasAguardando.data.length > 0 ? (
                empresasAguardando.data.map((empresa) => (
                  <Card key={empresa.id} className="border border-slate-300">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{empresa.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            CNPJ: {empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Nome Fantasia: {empresa.nome_fantasia}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Solicitado por: {empresa.solicitado_por} em {empresa.data_solicitacao}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Usuários autorizados: {empresa.usuarios_autorizados}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row">
                          <DetalhesEmpresaCompleto
                            empresaId={empresa.id}
                            trigger={
                              <Button variant="outline" className="flex items-center gap-2">
                                <Eye size={16} />
                                Visualizar
                              </Button>
                            }
                          />
                          <Button
                            onClick={() => handleAtualizarCNPJ(empresa.id, empresa.cnpj)}
                            variant="outline"
                            disabled={isAtualizando}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw size={16} className={isAtualizando ? "animate-spin" : ""} />
                            Atualizar CNPJ
                          </Button>
                          <Button
                            onClick={() => handleRecusar(empresa.id)}
                            variant="destructive"
                            disabled={isRecusando}
                            className="flex items-center gap-2"
                          >
                            <X size={16} />
                            Recusar
                          </Button>
                          <Button
                            onClick={() => handleAutorizar(empresa.id)}
                            disabled={isAutorizando}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          >
                            <Check size={16} />
                            Autorizar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border border-slate-300">
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Nenhuma solicitação pendente</p>
                    <p className="text-muted-foreground">
                      Todas as solicitações de empresas foram processadas. Quando um mentorado solicitar uma nova empresa, 
                      ela aparecerá aqui para sua aprovação.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <AdminPasswordDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Excluir Empresa"
          description="Esta ação é irreversível. Digite sua senha de administrador para confirmar a exclusão da empresa."
        />
      </div>
    </div>
  );
};

export default GestaoCNPJ;
