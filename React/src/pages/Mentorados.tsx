
import { useState } from "react";
import { useMentorados } from "@/hooks/use-mentorados";
import { NovoMentoradoDialog } from "@/components/mentorado/NovoMentoradoDialog";
import { useToast } from "@/components/ui/use-toast";
import { MentoradosPageHeader } from "@/components/mentorado/MentoradosPageHeader";
import { MentoradoListPanel } from "@/components/mentorado/MentoradoListPanel";
import { MentoradoDetails } from "@/components/mentorado/MentoradoDetails";
import { Mentorado } from "@/types/mentorado";
import { DiagnosticInfo } from "@/components/shared/DiagnosticInfo";
import { usePendingDependentes } from "@/hooks/use-pending-dependentes";

const Mentorados = () => {
  const [selectedMentoradoId, setSelectedMentoradoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { todosMentorados, isLoading, isError } = useMentorados();
  
  // Buscar informações de dependentes pendentes
  const { mentoradosWithPending } = usePendingDependentes();
  
  // Garantir que temos dados antes de tentar selecionar um mentorado
  const mentoradosData = todosMentorados.data || [];
  
  // Selecionar automaticamente o primeiro mentorado quando os dados são carregados
  // e não há nenhum mentorado selecionado
  if (mentoradosData.length > 0 && !selectedMentoradoId && !isLoading) {
    setSelectedMentoradoId(mentoradosData[0].id);
  }

  // Usar o ID selecionado para buscar detalhes do mentorado
  const { data: mentoradoSelecionado, isLoading: isLoadingMentorado } = 
    useMentorados().getMentoradoPorId(selectedMentoradoId || '');
  
  const handleSelectMentorado = (mentorado: Mentorado | null) => {
    if (mentorado) {
      setSelectedMentoradoId(mentorado.id);
    }
  };

  const handleCadastrarMentorado = () => {
    setIsDialogOpen(true);
  };
  
  const handleMentoradoDeleted = () => {
    // Recarregar a lista de mentorados
    todosMentorados.refetch();
    // Resetar a seleção
    setSelectedMentoradoId(null);
    toast({
      title: "Mentorado excluído",
      description: "O mentorado foi excluído com sucesso."
    });
  };

  // Contagem de mentorados ativos
  const mentoradosAtivos = mentoradosData?.filter(m => m.status === "ativo").length || 0;

  // Log de diagnóstico
  console.log("Mentorados page - mentoradosWithPending:", mentoradosWithPending);

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <MentoradosPageHeader 
          totalMentorados={mentoradosData.length}
          mentoradosAtivos={mentoradosAtivos}
          onCadastrarMentorado={handleCadastrarMentorado}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MentoradoListPanel 
              isLoading={isLoading}
              isError={isError}
              mentoradosData={mentoradosData}
              selectedMentorado={mentoradoSelecionado || null}
              onSelectMentorado={handleSelectMentorado}
              mentoradosWithPending={mentoradosWithPending}
            />
          </div>

          <div className="lg:col-span-2">
            <MentoradoDetails 
              mentoradoSelecionado={mentoradoSelecionado}
              isLoading={isLoadingMentorado}
              onMentoradoDeleted={handleMentoradoDeleted}
            />
          </div>
        </div>
        
        {/* Dialog de cadastro de novo mentorado */}
        <NovoMentoradoDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            // Recarregar a lista de mentorados
            todosMentorados.refetch();
          }}
        />

        {/* Componente de diagnóstico para depuração em desenvolvimento */}
        <DiagnosticInfo show={import.meta.env.DEV} />
      </div>
    </div>
  );
};

export default Mentorados;
