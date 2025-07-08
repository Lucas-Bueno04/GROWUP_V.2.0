
import React, { useState } from "react";
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
import { deleteMentorado } from "@/lib/edge-functions-client";
import { useToast } from "@/components/ui/use-toast";
import { Mentorado } from "@/types/mentorado";

interface DeleteMentoradoDialogProps {
  mentorado: Mentorado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteMentoradoDialog({
  mentorado,
  open,
  onOpenChange,
  onSuccess
}: DeleteMentoradoDialogProps) {
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMentorado = async () => {
    if (!mentorado || !adminPassword) return;
    
    setIsLoading(true);
    try {
      // Em uma aplicação real, validaríamos a senha do administrador aqui
      // Esta é uma demonstração que apenas verifica se a senha foi digitada
      if (adminPassword.length < 6) {
        throw new Error("Senha inválida ou muito curta");
      }
      
      await deleteMentorado(mentorado.id);
      
      toast({
        title: "Mentorado excluído",
        description: `${mentorado.nome} foi removido com sucesso do sistema.`,
      });
      
      onSuccess();
      onOpenChange(false);
      setAdminPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao excluir mentorado",
        description: error.message || "Ocorreu um erro ao tentar excluir o mentorado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mentorado) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Mentorado</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. O mentorado <strong>{mentorado.nome}</strong> e todos os seus dados 
            serão removidos permanentemente do sistema.
            {mentorado.email && (
              <div className="mt-2">
                O usuário associado ao e-mail <strong>{mentorado.email}</strong> também será excluído.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="admin-password">Digite sua senha de administrador para confirmar esta operação</Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Senha do administrador"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAdminPassword("")}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive"
            onClick={handleDeleteMentorado}
            disabled={isLoading || !adminPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Excluindo...
              </>
            ) : "Excluir permanentemente"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
