
import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDependentes } from "@/hooks/use-dependentes";
import { usePendingDependentes } from "@/hooks/use-pending-dependentes";
import { useDependenteActions } from "@/hooks/use-dependente-actions";
import { NovoDependenteDialog } from "./NovoDependenteDialog";
import { DependentesList } from "./dependentes/DependentesList";
import { EmptyDependentes } from "./dependentes/EmptyDependentes";
import { DeleteDependenteDialog } from "./dependentes/DeleteDependenteDialog";
import { useAuth } from "@/hooks/useAuth";
import { PendingDependentesList } from "./dependentes/PendingDependentesList";

interface DependentesTabProps {
  mentoradoId: string;
}

export function DependentesTab({ mentoradoId }: DependentesTabProps) {
  const { 
    dependentes,
    isLoading,
    error,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDeleteDependente,
    confirmDeleteDependente,
    fetchDependentes
  } = useDependentes(mentoradoId);

  const {
    pendingForMentorado,
    isLoading: isPendingLoading,
    hasPendingForMentorado,
    fetchPendingDependentes
  } = usePendingDependentes(mentoradoId);

  // Get the approve/reject actions for pending dependentes
  const {
    handleApprove,
    handleReject
  } = useDependenteActions(fetchPendingDependentes);

  const { user } = useAuth();
  const isMentor = user?.role === 'mentor';
  const [openNovoDependenteDialog, setOpenNovoDependenteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando dependentes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erro ao carregar dependentes: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpenNovoDependenteDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Dependente
        </Button>
      </div>

      {/* Exibe dependentes pendentes se for o mentor visualizando */}
      {isMentor && (
        <PendingDependentesList
          pendingDependentes={pendingForMentorado}
          isLoading={isPendingLoading}
          onApproveDependente={handleApprove}
          onRejectDependente={handleReject}
        />
      )}

      {/* Mostra o componente EmptyDependentes com informação sobre pendentes */}
      {dependentes.length === 0 ? (
        <EmptyDependentes
          isPendingLoading={isPendingLoading}
          hasPendingDependentes={hasPendingForMentorado && !isMentor}
        />
      ) : (
        <DependentesList
          dependentes={dependentes}
          onDeleteDependente={handleDeleteDependente}
          onEditSuccess={fetchDependentes}
        />
      )}

      <NovoDependenteDialog
        open={openNovoDependenteDialog}
        onOpenChange={setOpenNovoDependenteDialog}
        onSuccess={fetchDependentes}
        mentoradoId={mentoradoId}
      />

      <DeleteDependenteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirmDelete={confirmDeleteDependente}
      />
    </div>
  );
}
