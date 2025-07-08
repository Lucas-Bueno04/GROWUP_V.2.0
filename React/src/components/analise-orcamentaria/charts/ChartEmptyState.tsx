
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function ChartEmptyState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Dados não disponíveis para exibição dos gráficos</p>
        </div>
      </CardContent>
    </Card>
  );
}
