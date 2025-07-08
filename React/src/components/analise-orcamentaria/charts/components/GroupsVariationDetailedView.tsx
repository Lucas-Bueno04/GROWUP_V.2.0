
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GroupsVariationDetailedViewProps {
  data: any[];
}

export function GroupsVariationDetailedView({ data }: GroupsVariationDetailedViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="space-y-3 max-h-400 overflow-y-auto">
      {data.map((grupo, index) => (
        <div key={grupo.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{grupo.codigo}</span>
                <span className="text-sm text-muted-foreground">{grupo.nome}</span>
                <Badge variant="outline" className="text-xs">
                  {grupo.groupCategory || (grupo.isRevenue ? 'Receita' : 'Custo/Despesa')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Orçado</p>
                  <p className="font-medium">{formatCurrency(grupo.orcado)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Realizado</p>
                  <p className="font-medium">{formatCurrency(grupo.realizado)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Variação</p>
                  <p className={`font-medium ${grupo.variancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(grupo.variancia)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {grupo.percentualVariancia >= 0 ? '+' : ''}{grupo.percentualVariancia.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: grupo.color }}
              />
              <Badge 
                variant={grupo.status === 'Positivo' ? 'default' : grupo.status === 'Negativo' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {grupo.status}
              </Badge>
              {grupo.variancia > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
