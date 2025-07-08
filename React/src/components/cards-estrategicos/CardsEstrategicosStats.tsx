
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CardsEstrategicosStatsProps {
  stats: {
    total: number;
    acima: number;
    dentro: number;
    abaixo: number;
  };
}

export function CardsEstrategicosStats({ stats }: CardsEstrategicosStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.acima}</p>
            <p className="text-sm text-muted-foreground">Acima da Meta</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.dentro}</p>
            <p className="text-sm text-muted-foreground">Na Meta</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.abaixo}</p>
            <p className="text-sm text-muted-foreground">Abaixo da Meta</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total de Indicadores</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
