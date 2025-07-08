
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function CardsEstrategicosLoadingState() {
  return (
    <div className="p-4 lg:p-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium">Calculando indicadores estratégicos</p>
            <p className="text-muted-foreground">Processando metas e performance...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
