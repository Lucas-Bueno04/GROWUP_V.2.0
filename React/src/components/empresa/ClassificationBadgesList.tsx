
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { useClassificationBadges } from '@/hooks/useCompanyClassification';
import { formatCurrency } from '@/lib/utils';

export function ClassificationBadgesList() {
  const { data: faixas, isLoading } = useClassificationBadges();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faixas de Classificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!faixas?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faixas de Classificação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhuma faixa de classificação configurada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Faixas de Classificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {faixas.map((faixa) => (
            <div 
              key={faixa.id}
              className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-semibold">{faixa.nome}</h3>
                  <Badge variant="secondary">
                    Ordem {faixa.ordem}
                  </Badge>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Faixa de faturamento: </span>
                <span className="font-medium">
                  {formatCurrency(faixa.valor_minimo)} - {
                    faixa.valor_maximo >= 999999999999 
                      ? 'Acima de ' + formatCurrency(faixa.valor_minimo)
                      : formatCurrency(faixa.valor_maximo)
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
