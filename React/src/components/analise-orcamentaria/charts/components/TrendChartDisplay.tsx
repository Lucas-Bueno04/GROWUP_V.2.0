import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { LineChart as LineChartIcon } from "lucide-react";

interface TrendChartDisplayProps {
  chartData: any[];
  getLineColor: (type: 'Orçado' | 'Realizado') => string;
  selectedGroup: string;
  getLineLabel: (type: 'Orçado' | 'Realizado') => string;
  formatCurrency: (value: number) => string;
}

export function TrendChartDisplay({
  chartData,
  getLineColor,
  selectedGroup,
  getLineLabel,
  formatCurrency
}: TrendChartDisplayProps) {
  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <LineChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Nenhum dado disponível para o grupo selecionado</p>
      </div>
    );
  }

  const orcadoKey = `${selectedGroup} Orçado`;
  const realizadoKey = `${selectedGroup} Realizado`;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes"  angle={-45} textAnchor='end' height={60}/>
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey={orcadoKey}
          stroke={getLineColor('Orçado')}
          name={getLineLabel('Orçado')}
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey={realizadoKey}
          stroke={getLineColor('Realizado')}
          name={getLineLabel('Realizado')}
          strokeWidth={3}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
