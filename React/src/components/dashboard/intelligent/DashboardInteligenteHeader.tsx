
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function DashboardInteligenteHeader() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Dashboard Inteligente com IA
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Powered by Claude AI
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Insights e recomendações inteligentes geradas por IA baseadas nos dados da sua empresa
        </p>
      </CardHeader>
    </Card>
  );
}
