
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface OrcamentoErrorStateProps {
  error: Error;
}

export function OrcamentoErrorState({ error }: OrcamentoErrorStateProps) {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2 text-red-600">Erro ao carregar orçamentos</h3>
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro ao carregar os dados. Tente recarregar a página.
          </p>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
