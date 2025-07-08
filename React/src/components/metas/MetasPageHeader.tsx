
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { AlertCircle } from "lucide-react";

interface MetasPageHeaderProps {
  totalMetas: number;
  indicadoresAtivos: number;
  indicadoresPlanoContasCount: number;
  hasErrors: boolean;
  onReload: () => void;
}

export function MetasPageHeader({
  totalMetas,
  indicadoresAtivos,
  indicadoresPlanoContasCount,
  hasErrors,
  onReload
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
            onClick={onReload}
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
      badges={[
        { label: `Total de Metas: ${totalMetas}`, variant: "outline" },
        { label: `Indicadores Próprios: ${indicadoresAtivos}`, variant: "outline" },
        { label: `Indicadores Plano de Contas: ${indicadoresPlanoContasCount}`, variant: "outline" }
      ]}
    />
  );
}
