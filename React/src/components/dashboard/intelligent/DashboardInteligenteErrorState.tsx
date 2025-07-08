
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardInteligenteErrorStateProps {
  onRetry: () => void;
}

export function DashboardInteligenteErrorState({ onRetry }: DashboardInteligenteErrorStateProps) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Erro ao Carregar Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500 opacity-50" />
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro ao carregar os insights inteligentes. 
            Verifique sua conexão e tente novamente.
          </p>
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
