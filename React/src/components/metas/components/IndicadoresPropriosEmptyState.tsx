
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export function IndicadoresPropriosEmptyState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum indicador próprio</h3>
          <p className="text-muted-foreground mb-4">
            Crie seus próprios indicadores personalizados para acompanhar métricas específicas do seu negócio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
