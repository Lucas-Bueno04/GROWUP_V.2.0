
import React from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/pages/AdminAcessos";

interface UserDialogsProps {
  selectedUser: UserProfile | null;
  resetPasswordDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
  };
  blockUserDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
  };
  deleteUserDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
    isLoading: boolean;
    adminPassword: string;
    setAdminPassword: (password: string) => void;
    onConfirm: () => void;
  };
}

export function UserDialogs({
  selectedUser,
  resetPasswordDialog,
  blockUserDialog,
  deleteUserDialog
}: UserDialogsProps) {
  return (
    <>
      {/* Reset Password Dialog */}
      <AlertDialog open={resetPasswordDialog.open} onOpenChange={resetPasswordDialog.setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir senha</AlertDialogTitle>
            <AlertDialogDescription>
              Um link de redefinição de senha será enviado para o email do usuário.
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetPasswordDialog.onConfirm}
              disabled={resetPasswordDialog.isLoading}
            >
              {resetPasswordDialog.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Enviando...
                </>
              ) : "Enviar link"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Block/Unblock User Dialog */}
      <AlertDialog open={blockUserDialog.open} onOpenChange={blockUserDialog.setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.is_blocked ? "Desbloquear usuário" : "Bloquear usuário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.is_blocked 
                ? "Esta ação permitirá que o usuário acesse novamente o sistema." 
                : "Esta ação impedirá que o usuário acesse o sistema."}
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={blockUserDialog.onConfirm}
              disabled={blockUserDialog.isLoading}
            >
              {blockUserDialog.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processando...
                </>
              ) : selectedUser?.is_blocked ? "Desbloquear" : "Bloquear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete User Dialog */}
      <AlertDialog open={deleteUserDialog.open} onOpenChange={deleteUserDialog.setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O usuário e todos os seus dados serão removidos permanentemente.
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="admin-password">Digite sua senha para confirmar esta operação</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Senha do administrador"
              value={deleteUserDialog.adminPassword}
              onChange={(e) => deleteUserDialog.setAdminPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => deleteUserDialog.setAdminPassword("")}>Cancelar</AlertDialogCancel>
            <Button 
              variant="destructive"
              onClick={deleteUserDialog.onConfirm}
              disabled={deleteUserDialog.isLoading || !deleteUserDialog.adminPassword}
            >
              {deleteUserDialog.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Excluindo...
                </>
              ) : "Excluir permanentemente"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
