
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: any[];
  height?: number;
  options?: any;
}

export function LineChart({ data, height = 300, options }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip formatter={(value: any) => 
          new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(value)
        } />
        <Legend />
        <Line type="monotone" dataKey="orcado" stroke="#3b82f6" name="Orçado" />
        <Line type="monotone" dataKey="realizado" stroke="#f59e0b" name="Realizado" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
