
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

export function MetasIndicadoresEmptyState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma meta definida</h3>
          <p className="text-muted-foreground mb-4">
            Comece definindo metas para os indicadores disponíveis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
