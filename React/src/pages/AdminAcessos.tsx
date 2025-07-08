import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { resetUserPassword, toggleUserBlock, deleteUser } from "@/lib/edge-functions-client";
import { UserTable } from "@/components/admin/UserTable";
import { UserDialogs } from "@/components/admin/UserDialogs";
import { DatabaseInstructions } from "@/components/admin/DatabaseInstructions";

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  is_blocked?: boolean;
}

export default function AdminAcessos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [blockUserDialogOpen, setBlockUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  // Buscar todos os perfis de usuários - usando a função get_all_profiles configurada para segurança
  const { data, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      console.log("Buscando perfis de usuários");
      
      // Usando rpc para chamar uma função que contornará as políticas RLS para evitar recursão
      const { data, error } = await supabase
        .rpc('get_all_profiles');
      
      if (error) {
        console.error("Erro ao buscar perfis:", error);
        // Mostrar instruções se houver erro com a função
        setShowInstructions(true);
        throw new Error(error.message);
      }
      
      console.log("Perfis obtidos:", data);
      
      // Se os dados estiverem em formato JSON string, parseie-os
      let profilesData = data;
      if (typeof data === 'string') {
        try {
          profilesData = JSON.parse(data);
        } catch (e) {
          console.error("Erro ao parsear dados JSON:", e);
        }
      }
      
      // Certifica-se que os dados estão em formato de array
      const profiles = Array.isArray(profilesData) ? profilesData : [profilesData];
      
      // Formata os dados para o formato esperado
      const usersWithProfiles = profiles.map(profile => {
        return {
          id: profile.id,
          email: profile.email || "",
          nome: profile.nome || "Usuário sem nome",
          role: profile.role || "aluno",
          created_at: profile.created_at,
          last_sign_in_at: profile.last_sign_in_at || null,
          is_blocked: profile.user_metadata?.banned || false
        };
      });
      
      return usersWithProfiles;
    },
    refetchInterval: 10000 // Refetch a cada 10 segundos para manter a lista atualizada
  });

  // Mutation para resetar senha usando a Edge Function
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const result = await resetUserPassword(email);
      
      if (!result.success) {
        throw new Error("Falha ao enviar link de redefinição de senha");
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Link de redefinição enviado",
        description: "Um link para redefinição de senha foi enviado para o email do usuário.",
      });
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao resetar senha",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation para bloquear/desbloquear usuário usando a Edge Function
  const toggleBlockUserMutation = useMutation({
    mutationFn: async ({ userId, block }: { userId: string; block: boolean }) => {
      const result = await toggleUserBlock(userId, block);
      
      if (!result.success) {
        throw new Error(`Falha ao ${block ? 'bloquear' : 'desbloquear'} usuário`);
      }
      
      return { blocked: block };
    },
    onSuccess: (data, variables) => {
      toast({
        title: data.blocked ? "Usuário bloqueado" : "Usuário desbloqueado",
        description: `A operação foi concluída com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setBlockUserDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na operação",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation para excluir usuário usando a Edge Function
  const deleteUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await deleteUser(userId);
      
      if (!result.success) {
        throw new Error("Falha ao excluir usuário");
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso do sistema.",
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setDeleteDialogOpen(false);
      setAdminPassword("");
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filtrar usuários baseado na busca
  const filteredUsers = data?.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers para as ações de usuário
  const handleResetPassword = (user: UserProfile) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };
  
  const handleToggleBlockUser = (user: UserProfile) => {
    setSelectedUser(user);
    setBlockUserDialogOpen(true);
  };
  
  const handleDeleteUser = (user: UserProfile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gestão de Acessos"
          description="Gerencie os acessos dos usuários ao sistema"
          colorScheme="yellow"
          badges={[
            { label: `Total de Usuários: ${data?.length || 0}`, variant: "outline" }
          ]}
        />
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="w-full md:w-72">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <UserTable 
              users={filteredUsers || []} 
              isLoading={isLoading}
              error={error as Error}
              onResetPassword={handleResetPassword}
              onToggleBlock={handleToggleBlockUser}
              onDelete={handleDeleteUser}
            />
          </CardContent>
        </Card>

        {/* Mostrar instruções apenas se houver um erro */}
        {showInstructions && <DatabaseInstructions />}
      </div>
      
      <UserDialogs 
        selectedUser={selectedUser}
        resetPasswordDialog={{
          open: resetPasswordDialogOpen,
          setOpen: setResetPasswordDialogOpen,
          isLoading: resetPasswordMutation.isPending,
          onConfirm: () => selectedUser && resetPasswordMutation.mutate({ email: selectedUser.email })
        }}
        blockUserDialog={{
          open: blockUserDialogOpen,
          setOpen: setBlockUserDialogOpen,
          isLoading: toggleBlockUserMutation.isPending,
          onConfirm: () => {
            if (selectedUser) {
              toggleBlockUserMutation.mutate({ 
                userId: selectedUser.id, 
                block: !selectedUser.is_blocked 
              });
            }
          }
        }}
        deleteUserDialog={{
          open: deleteDialogOpen,
          setOpen: setDeleteDialogOpen,
          isLoading: deleteUserMutation.isPending,
          adminPassword,
          setAdminPassword,
          onConfirm: () => {
            if (selectedUser) {
              deleteUserMutation.mutate({ userId: selectedUser.id });
            }
          }
        }}
      />
    </div>
  );
}
