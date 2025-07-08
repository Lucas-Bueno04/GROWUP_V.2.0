
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Building2 } from "lucide-react";

export function DashboardInteligenteEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Dashboard Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Selecione uma Empresa</h3>
          <p className="text-sm max-w-sm mx-auto">
            Escolha uma empresa no seletor acima para visualizar insights inteligentes 
            baseados em dados reais do orçamento empresarial.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
