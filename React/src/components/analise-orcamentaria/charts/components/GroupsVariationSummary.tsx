
import React from 'react';

interface GroupsVariationSummaryProps {
  data: any[];
}

export function GroupsVariationSummary({ data }: GroupsVariationSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Total Analisado</p>
        <p className="font-semibold">
          {formatCurrency(data.reduce((sum, g) => sum + g.absVariancia, 0))}
        </p>
      </div>
      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Maior Variação</p>
        <p className="font-semibold">
          {data.length > 0 ? formatCurrency(data[0].absVariancia) : '-'}
        </p>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <p className="text-muted-foreground">Variações Positivas</p>
        <p className="font-semibold text-green-700">
          {data.filter(g => g.variancia > 0).length}
        </p>
      </div>
      <div className="text-center p-3 bg-red-50 rounded-lg">
        <p className="text-muted-foreground">Variações Negativas</p>
        <p className="font-semibold text-red-700">
          {data.filter(g => g.variancia < 0).length}
        </p>
      </div>
    </div>
  );
}
