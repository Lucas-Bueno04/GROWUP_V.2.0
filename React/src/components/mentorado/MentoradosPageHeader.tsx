
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MentoradosPageHeaderProps {
  totalMentorados: number;
  mentoradosAtivos: number;
  onCadastrarMentorado: () => void;
}

export function MentoradosPageHeader({
  totalMentorados,
  mentoradosAtivos,
  onCadastrarMentorado
}: MentoradosPageHeaderProps) {
  const { toast } = useToast();

  const handleFiltrosClick = () => {
    toast({
      title: "Filtros", 
      description: "Filtros avançados estarão disponíveis em breve."
    });
  };

  return (
    <Header
      title="Gestão de Mentorados"
      description="Acompanhe e oriente seus mentorados de forma personalizada"
      colorScheme="yellow"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFiltrosClick}>
            Filtros
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onCadastrarMentorado}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Mentorado
          </Button>
        </div>
      }
      badges={[
        { label: "Total: " + totalMentorados, variant: "outline" },
        { label: "Ativos: " + mentoradosAtivos, variant: "default" }
      ]}
    />
  );
}
