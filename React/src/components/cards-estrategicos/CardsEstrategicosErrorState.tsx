
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CardsEstrategicosErrorStateProps {
  error: Error;
  onRefresh: () => void;
}

export function CardsEstrategicosErrorState({ error, onRefresh }: CardsEstrategicosErrorStateProps) {
  return (
    <div className="p-4 lg:p-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Dados</h3>
            <p className="text-muted-foreground mb-4">
              {error.message || 'Não foi possível carregar os indicadores estratégicos.'}
            </p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
