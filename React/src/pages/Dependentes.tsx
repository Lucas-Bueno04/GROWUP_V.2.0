import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, User, PlusCircle, UserCog, UserX, UserCheck, UserMinus, AlertTriangle, Edit } from "lucide-react";
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { NovoDependenteDialog } from "@/components/mentorado/NovoDependenteDialog";
import { EditarDependentePerfilDialog } from "@/components/mentorado/dependentes/EditarDependentePerfilDialog";
import { EditarPerfilPrincipalDialog } from "@/components/mentorado/dependentes/EditarPerfilPrincipalDialog";
import { deleteDependente } from "@/lib/edge-functions/dependente-operations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Dependente {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  user_id: string | null;
  active: boolean;
  tipo_dependente?: "mentoria" | "operacional";
}

interface Mentorado {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  empresa?: string;
}

const Dependentes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [mentorado, setMentorado] = useState<Mentorado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openNovoDependenteDialog, setOpenNovoDependenteDialog] = useState(false);
  const [deleteDependenteId, setDeleteDependenteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [alterarStatusId, setAlterarStatusId] = useState<string | null>(null);
  const [openAlterarStatusDialog, setOpenAlterarStatusDialog] = useState(false);
  const [statusAtual, setStatusAtual] = useState<boolean>(true);
  const [editingDependente, setEditingDependente] = useState<Dependente | null>(null);
  const [editingPerfil, setEditingPerfil] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      fetchMentoradoData();
    }
  }, [user]);

  const fetchMentoradoData = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.email) return;

      console.log("Buscando dados do mentorado para:", user.email);

      // Buscar dados do mentorado pelo email
      const { data: mentoradoData, error: mentoradoError } = await supabase
        .from("mentorados")
        .select("*")
        .eq("email", user.email)
        .single();

      if (mentoradoError) {
        console.error("Erro ao buscar mentorado:", mentoradoError);
        throw new Error(`Erro ao buscar mentorado: ${mentoradoError.message}`);
      }

      if (!mentoradoData) {
        console.warn("Mentorado não encontrado para email:", user.email);
        throw new Error("Mentorado não encontrado");
      }

      console.log("Mentorado encontrado:", mentoradoData);
      setMentorado(mentoradoData);
      
      // Buscar dependentes associados ao mentorado
      console.log("Buscando dependentes para mentorado ID:", mentoradoData.id);
      const { data: dependentesData, error: dependentesError } = await supabase
        .from("dependents")
        .select("*")
        .eq("mentorado_id", mentoradoData.id);

      if (dependentesError) {
        console.error("Erro ao buscar dependentes:", dependentesError);
        throw new Error(`Erro ao buscar dependentes: ${dependentesError.message}`);
      }

      console.log("Dependentes encontrados:", dependentesData?.length || 0);
      setDependentes(dependentesData || []);
      setError(null);
    } catch (err: any) {
      console.error("Erro na busca de dados:", err);
      setError(err.message || "Ocorreu um erro ao carregar os dados");
      toast({
        title: "Erro",
        description: err.message || "Ocorreu um erro ao carregar os dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNovoDependente = () => {
    if (!mentorado) {
      toast({
        title: "Erro",
        description: "É necessário ter um perfil de mentorado para adicionar dependentes",
        variant: "destructive",
      });
      return;
    }
    setOpenNovoDependenteDialog(true);
  };

  const handleDeleteDependente = (dependenteId: string) => {
    setDeleteDependenteId(dependenteId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteDependente = async () => {
    if (!deleteDependenteId) return;

    try {
      console.log("Excluindo dependente:", deleteDependenteId);
      const result = await deleteDependente(deleteDependenteId);

      if (!result.success) {
        console.error("Erro ao excluir dependente:", result.message);
        throw new Error(result.message || "Erro ao excluir dependente");
      }

      toast({
        title: "Dependente excluído",
        description: "O dependente foi excluído com sucesso.",
      });
      setOpenDeleteDialog(false);
      setDeleteDependenteId(null);
      fetchMentoradoData(); // Atualiza a lista de dependentes
    } catch (error: any) {
      console.error("Erro ao confirmar exclusão:", error);
      toast({
        title: "Erro ao excluir dependente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAlterarStatus = (dependenteId: string, statusAtual: boolean) => {
    setAlterarStatusId(dependenteId);
    setStatusAtual(statusAtual);
    setOpenAlterarStatusDialog(true);
  };

  const confirmAlterarStatus = async () => {
    if (!alterarStatusId) return;

    try {
      // Atualizar status do dependente
      const { error } = await supabase
        .from("dependents")
        .update({ active: !statusAtual })
        .eq("id", alterarStatusId);

      if (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
      }

      toast({
        title: "Status atualizado",
        description: `O dependente foi ${!statusAtual ? "ativado" : "suspenso"} com sucesso.`,
      });
      
      setOpenAlterarStatusDialog(false);
      setAlterarStatusId(null);
      fetchMentoradoData(); // Atualiza a lista de dependentes
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditDependente = (dependente: Dependente) => {
    setEditingDependente(dependente);
  };

  const handleEditSuccess = () => {
    setEditingDependente(null);
    setEditingPerfil(false);
    fetchMentoradoData();
  };

  const getPermissionLevelLabel = (permissionLevel: string) => {
    switch (permissionLevel) {
      case "leitura":
        return "Leitura";
      case "escrita_basica":
        return "Escrita Básica";
      case "escrita_completa":
        return "Escrita Completa";
      case "admin":
        return "Admin";
      default:
        return "Desconhecido";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gestão de Dependentes"
          description="Gerencie os usuários dependentes associados ao seu perfil"
          colorScheme="blue"
          actions={
            <Button onClick={handleNovoDependente}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Dependente
            </Button>
          }
          badges={[
            { label: `Total: ${dependentes.length}`, variant: "outline" },
            { label: `Ativos: ${dependentes.filter(d => d.active).length}`, variant: "default" }
          ]}
        />

        <div className="space-y-6">
          {error && (
            <Card className="bg-red-50 border-red-300">
              <CardContent className="p-6">
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {!mentorado ? (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Perfil não encontrado</h3>
                <p className="text-muted-foreground">
                  É necessário ter um perfil de mentorado para gerenciar dependentes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Card de Informações do Mentorado */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Meu Perfil</h3>
                      <p className="text-muted-foreground mb-2">{mentorado.email}</p>
                      <Badge variant="outline">{mentorado.nome}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-500 hover:text-white hover:bg-blue-500"
                        onClick={() => setEditingPerfil(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                      <Badge className="bg-green-500">Perfil Principal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Dependentes */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Dependentes</h3>

                  {dependentes.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <UserMinus className="h-12 w-12 mx-auto mb-4" />
                      <p>Nenhum dependente cadastrado</p>
                      <p className="text-sm">Clique no botão "Novo Dependente" para adicionar</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dependentes.map((dependente) => (
                            <TableRow key={dependente.id} className={!dependente.active ? "bg-muted/50" : ""}>
                              <TableCell className="font-medium">{dependente.nome}</TableCell>
                              <TableCell>{dependente.email}</TableCell>
                              <TableCell>{dependente.cargo || "N/A"}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {dependente.tipo_dependente === "mentoria" 
                                    ? "Participante da Mentoria"
                                    : "Operacional"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {dependente.active ? (
                                  <Badge className="bg-green-500">Ativo</Badge>
                                ) : (
                                  <Badge variant="secondary">Suspenso</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditDependente(dependente)}
                                  className="text-blue-500 hover:text-white hover:bg-blue-500"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAlterarStatus(dependente.id, dependente.active)}
                                >
                                  {dependente.active ? (
                                    <UserMinus className="h-4 w-4 mr-2" />
                                  ) : (
                                    <UserCheck className="h-4 w-4 mr-2" />
                                  )}
                                  {dependente.active ? "Suspender" : "Ativar"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteDependente(dependente.id)}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Excluir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Diálogos */}
          {mentorado && (
            <>
              <NovoDependenteDialog
                open={openNovoDependenteDialog}
                onOpenChange={setOpenNovoDependenteDialog}
                onSuccess={fetchMentoradoData}
                mentoradoId={mentorado.id}
              />

              <EditarPerfilPrincipalDialog
                open={editingPerfil}
                onOpenChange={setEditingPerfil}
                mentorado={mentorado}
                onSuccess={handleEditSuccess}
              />
            </>
          )}

          {editingDependente && (
            <EditarDependentePerfilDialog
              dependente={editingDependente}
              open={!!editingDependente}
              onOpenChange={(open) => !open && setEditingDependente(null)}
              onSuccess={handleEditSuccess}
            />
          )}

          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Dependente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja excluir este dependente? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteDependenteId(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteDependente}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={openAlterarStatusDialog} onOpenChange={setOpenAlterarStatusDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {statusAtual ? "Suspender Dependente" : "Ativar Dependente"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {statusAtual 
                    ? "Tem certeza de que deseja suspender o acesso deste dependente? Ele não poderá acessar o sistema até que seja reativado."
                    : "Tem certeza de que deseja reativar o acesso deste dependente?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAlterarStatusId(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmAlterarStatus}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Dependentes;
