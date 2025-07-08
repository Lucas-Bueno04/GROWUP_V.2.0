
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { GroupsVariationTooltip } from './GroupsVariationTooltip';

interface GroupsVariationBarChartProps {
  data: any[];
}

export function GroupsVariationBarChart({ data }: GroupsVariationBarChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="codigo" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          fontSize={12}
        />
        <Tooltip content={<GroupsVariationTooltip />} />
        <Bar dataKey="absVariancia" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
