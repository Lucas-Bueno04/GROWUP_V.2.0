
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface LoadingStateProps {
  isLoading: boolean;
}

export function LoadingState({ isLoading }: LoadingStateProps) {
  if (!isLoading) return null;
  
  return (
    <div className="flex justify-center items-center p-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Carregando indicadores...</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  if (!error) return null;
  
  return (
    <Card className="border-destructive">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-medium text-lg">Erro ao carregar indicadores</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </CardContent>
    </Card>
  );
}
