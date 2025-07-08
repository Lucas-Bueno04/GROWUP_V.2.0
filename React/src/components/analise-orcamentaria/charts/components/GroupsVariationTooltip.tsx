
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface GroupsVariationTooltipProps {
  active?: boolean;
  payload?: any[];
}

export function GroupsVariationTooltip({ active, payload }: GroupsVariationTooltipProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-sm">{data.codigo} - {data.nome}</p>
        <div className="space-y-1 text-xs">
          <p>Orçado: <span className="font-medium">{formatCurrency(data.orcado)}</span></p>
          <p>Realizado: <span className="font-medium">{formatCurrency(data.realizado)}</span></p>
          <p>Variação: <span className={`font-medium ${data.variancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.variancia)} ({data.percentualVariancia >= 0 ? '+' : ''}{data.percentualVariancia.toFixed(1)}%)
          </span></p>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {data.groupCategory || (data.isRevenue ? 'Receita' : 'Custo/Despesa')}
            </Badge>
            <Badge variant={data.status === 'Positivo' ? 'default' : data.status === 'Negativo' ? 'destructive' : 'secondary'} className="text-xs">
              {data.status}
            </Badge>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
