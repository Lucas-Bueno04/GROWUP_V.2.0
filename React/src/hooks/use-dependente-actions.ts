
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { approvePendingDependente, rejectPendingDependente } from "@/services/dependente.service";

export function useDependenteActions(onSuccess: () => void) {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string>>({});

  const handleApprove = async (dependenteId: string, permissionLevel?: string) => {
    setProcessingId(dependenteId);
    try {
      // Use the provided permissionLevel or get it from the state
      const effectivePermissionLevel = permissionLevel || selectedPermissions[dependenteId] || 'leitura';
      await approvePendingDependente(dependenteId, effectivePermissionLevel);
      onSuccess();
      toast({
        title: "Dependente aprovado",
        description: "O dependente foi aprovado com sucesso e receberá um email com as instruções de acesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar dependente",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (dependenteId: string) => {
    setProcessingId(dependenteId);
    try {
      await rejectPendingDependente(dependenteId);
      onSuccess();
      toast({
        title: "Dependente rejeitado",
        description: "O dependente foi rejeitado com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao rejeitar dependente",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
      setConfirmDeleteId(null);
    }
  };

  return {
    selectedPermissions,
    setSelectedPermissions,
    processingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleApprove,
    handleReject
  };
}
