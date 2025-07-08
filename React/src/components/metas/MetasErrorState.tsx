
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface MetasErrorStateProps {
  onReload: () => void;
}

export function MetasErrorState({ onReload }: MetasErrorStateProps) {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Dados</h3>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro ao carregar as informações das metas. Por favor, recarregue a página.
            </p>
            <Button 
              onClick={onReload}
              className="mt-4"
            >
              Recarregar Página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
