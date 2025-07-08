
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePendingDependentes } from "@/hooks/use-pending-dependentes";
import { useDependenteActions } from "@/hooks/use-dependente-actions";
import { DependenteCard } from "./dependentes/DependenteCard";
import { RejectConfirmationDialog } from "./dependentes/RejectConfirmationDialog";
import { EmptyStateDisplay } from "./dependentes/EmptyStateDisplay";
import { LoadingStateDisplay } from "./dependentes/LoadingStateDisplay";

export function PendingDependentesApproval() {
  // Get pending dependentes data
  const {
    pendingDependentes,
    isLoading,
    fetchPendingDependentes
  } = usePendingDependentes();
  
  // Get actions for handling dependentes
  const {
    selectedPermissions,
    setSelectedPermissions,
    processingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleApprove,
    handleReject
  } = useDependenteActions(fetchPendingDependentes);

  useEffect(() => {
    fetchPendingDependentes();
  }, [fetchPendingDependentes]);

  if (isLoading) {
    return <LoadingStateDisplay />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Solicitações Pendentes de Dependentes</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchPendingDependentes}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Atualizar
        </Button>
      </div>

      {pendingDependentes.length === 0 ? (
        <EmptyStateDisplay />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingDependentes.map((dependente) => (
            <DependenteCard
              key={dependente.id}
              dependente={dependente}
              selectedPermission={selectedPermissions[dependente.id] || ""}
              onPermissionChange={(value) => {
                setSelectedPermissions(prev => ({...prev, [dependente.id]: value}));
              }}
              processingId={processingId}
              onApprove={() => handleApprove(dependente.id)}
              onReject={() => setConfirmDeleteId(dependente.id)}
            />
          ))}
        </div>
      )}

      <RejectConfirmationDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleReject(confirmDeleteId)}
        isProcessing={!!processingId && processingId === confirmDeleteId}
      />
    </div>
  );
}
