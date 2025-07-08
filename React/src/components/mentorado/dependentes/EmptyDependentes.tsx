
import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EmptyDependentesProps {
  isPendingLoading?: boolean;
  hasPendingDependentes?: boolean;
}

export function EmptyDependentes({ 
  isPendingLoading = false, 
  hasPendingDependentes = false 
}: EmptyDependentesProps) {
  
  if (isPendingLoading) {
    return (
      <div className="flex justify-center items-center p-4 text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Verificando dependentes pendentes...
      </div>
    );
  }
  
  if (hasPendingDependentes) {
    return (
      <Card className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-400">Dependentes aguardando aprovação</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Você tem dependentes aguardando aprovação do seu mentor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-muted-foreground">
      Nenhum dependente cadastrado para este mentorado.
    </div>
  );
}
