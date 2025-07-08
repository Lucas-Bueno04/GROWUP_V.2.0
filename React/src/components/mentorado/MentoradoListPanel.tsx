
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Mentorado } from "@/types/mentorado";
import { MentoradoList } from "./MentoradoList";
import { MentoradoWithPending } from "@/types/dependente";

interface MentoradoListPanelProps {
  mentoradosData: Mentorado[];
  selectedMentorado: Mentorado | null;
  isLoading: boolean;
  isError: boolean;
  onSelectMentorado: (mentorado: Mentorado) => void;
  mentoradosWithPending?: MentoradoWithPending[];
}

export function MentoradoListPanel({
  mentoradosData,
  selectedMentorado,
  isLoading,
  isError,
  onSelectMentorado,
  mentoradosWithPending = []
}: MentoradoListPanelProps) {
  // Debug log
  useEffect(() => {
    console.log("MentoradoListPanel - mentoradosWithPending:", mentoradosWithPending);
    console.log("MentoradoListPanel - selected mentorado:", selectedMentorado);
  }, [mentoradosWithPending, selectedMentorado]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">
            Erro ao carregar mentorados. Tente novamente mais tarde.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <MentoradoList
      mentorados={mentoradosData}
      selectedMentorado={selectedMentorado}
      onSelectMentorado={onSelectMentorado}
      mentoradosWithPending={mentoradosWithPending}
    />
  );
}
