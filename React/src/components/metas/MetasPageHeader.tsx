
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { AlertCircle } from "lucide-react";

interface MetasPageHeaderProps {
  hasErrors: boolean;
}

export function MetasPageHeader({
  hasErrors,
}: MetasPageHeaderProps) {
  if (hasErrors) {
    return (
      <Header 
        title="Metas de Indicadores" 
        description="Erro ao carregar dados das metas"
        colorScheme="red"
        actions={
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Recarregar Página
          </Button>
        }
      />
    );
  }

  return (
    <Header 
      title="Metas de Indicadores" 
      description="Defina e acompanhe suas metas para indicadores do plano de contas e indicadores personalizados"
      colorScheme="red"
    />
  );
}
