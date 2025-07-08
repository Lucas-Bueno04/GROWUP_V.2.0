
import { Card, CardContent } from "@/components/ui/card";

export function EmptyStateDisplay() {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">Não há solicitações pendentes de dependentes.</p>
      </CardContent>
    </Card>
  );
}
