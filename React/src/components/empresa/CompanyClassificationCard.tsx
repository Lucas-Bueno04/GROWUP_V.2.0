
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Award, RefreshCw } from 'lucide-react';
import { useCompanyClassification, useReclassifyCompany } from '@/hooks/useCompanyClassification';
import { formatCurrency } from '@/lib/utils';

interface CompanyClassificationCardProps {
  empresaId: string;
}

export function CompanyClassificationCard({ empresaId }: CompanyClassificationCardProps) {
  const { data: classificationData, isLoading, refetch } = useCompanyClassification(empresaId);
  const reclassifyCompany = useReclassifyCompany();

  const handleReclassify = async () => {
    try {
      await reclassifyCompany(empresaId);
      refetch();
    } catch (error) {
      console.error('Error reclassifying company:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classificação da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!classificationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classificação da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Dados de classificação não disponíveis.</p>
        </CardContent>
      </Card>
    );
  }

  const { current_classification, current_revenue, growth_percentage, badges } = classificationData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Classificação da Empresa</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReclassify}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reclassificar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Classification */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Classificação Atual:</h3>
            {current_classification && (
              <Badge variant="outline" className="text-sm">
                {current_classification}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Faturamento Atual: <span className="font-medium text-foreground">
                {formatCurrency(current_revenue)}
              </span>
            </p>
            
            {growth_percentage !== null && (
              <div className="flex items-center gap-1 text-sm">
                {growth_percentage >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {growth_percentage > 0 ? '+' : ''}{growth_percentage.toFixed(1)}% vs. ano anterior
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4" />
              Faixas Conquistadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((award) => (
                <Badge 
                  key={award.id} 
                  variant="secondary"
                  className="gap-1"
                >
                  <span>{award.faixa?.nome}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
