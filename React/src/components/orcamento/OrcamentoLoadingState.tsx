
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function OrcamentoLoadingState() {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center text-muted-foreground">
          Carregando orçamentos...
        </div>
      </CardContent>
    </Card>
  );
}
