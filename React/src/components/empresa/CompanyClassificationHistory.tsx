
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useCompanyClassification } from '@/hooks/useCompanyClassification';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompanyClassificationHistoryProps {
  empresaId: string;
}

export function CompanyClassificationHistory({ empresaId }: CompanyClassificationHistoryProps) {
  const { data: classificationData, isLoading } = useCompanyClassification(empresaId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Classificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!classificationData?.history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Classificação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum histórico de classificação disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Classificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classificationData.history.map((entry) => (
            <div key={entry.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entry.previous_classification && (
                    <>
                      <Badge variant="outline">{entry.previous_classification}</Badge>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge variant="default">{entry.new_classification}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(entry.classification_date), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Faturamento anterior: </span>
                  <span className="font-medium">
                    {entry.previous_revenue ? formatCurrency(entry.previous_revenue) : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Faturamento atual: </span>
                  <span className="font-medium">{formatCurrency(entry.current_revenue)}</span>
                </div>
              </div>

              {entry.growth_percentage !== null && (
                <div className="flex items-center gap-2 text-sm">
                  {entry.growth_percentage >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={entry.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                    Crescimento: {entry.growth_percentage > 0 ? '+' : ''}{entry.growth_percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
