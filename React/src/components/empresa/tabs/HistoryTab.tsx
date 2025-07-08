
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { RegistrarHistoricoDialog } from "@/components/empresa/RegistrarHistoricoDialog";

interface HistoryEntry {
  id: string | number;
  data_registro: string;
  descricao: string;
}

interface HistoryTabProps {
  empresaId: string;
  historico: HistoryEntry[];
  onHistoryUpdate: () => void;
}

export function HistoryTab({ empresaId, historico, onHistoryUpdate }: HistoryTabProps) {
  // Formatar data do registro para exibição mais amigável
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dataString;
    }
  };

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Histórico da Empresa</h3>
        <RegistrarHistoricoDialog 
          empresaId={empresaId}
          onSuccess={onHistoryUpdate}
          trigger={
            <Button className="flex items-center gap-1">
              <PlusCircle size={16} />
              Novo registro
            </Button>
          }
        />
      </div>
      {historico.length > 0 ? (
        <div className="space-y-4">
          {historico.map((registro) => (
            <div key={registro.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{formatarData(registro.data_registro)}</h4>
              </div>
              <p className="text-sm mt-1">{registro.descricao}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum registro de histórico disponível
        </div>
      )}
    </>
  );
}
