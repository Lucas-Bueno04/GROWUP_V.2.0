
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon } from "lucide-react";

interface TrendChartDisplayProps {
  chartData: any[];
  getLineColor: (selection: string) => string;
  getLineLabel: (selection: string) => string;
  selectedGroup1: string;
  selectedGroup2: string;
  formatCurrency: (value: number) => string;
}

export function TrendChartDisplay({
  chartData,
  getLineColor,
  getLineLabel,
  selectedGroup1,
  selectedGroup2,
  formatCurrency
}: TrendChartDisplayProps) {
  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <LineChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Nenhum dado disponível para o período selecionado</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={getLineLabel(selectedGroup1)}
          stroke={getLineColor(selectedGroup1)}
          name={getLineLabel(selectedGroup1)}
          strokeWidth={3} 
        />
        <Line 
          type="monotone" 
          dataKey={getLineLabel(selectedGroup2)}
          stroke={getLineColor(selectedGroup2)}
          name={getLineLabel(selectedGroup2)}
          strokeWidth={3}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
