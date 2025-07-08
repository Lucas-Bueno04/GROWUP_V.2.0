
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  height?: number;
  options?: any;
}

export function BarChart({ data, height = 300, options }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
        <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
