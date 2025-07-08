
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GroupsVariationTooltip } from './GroupsVariationTooltip';

interface GroupsVariationPieChartProps {
  data: any[];
  showPercentages: boolean;
}

export function GroupsVariationPieChart({ data, showPercentages }: GroupsVariationPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showPercentages ? ({ displayName, percentage }) => `${displayName} ${percentage}` : false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="absVariancia"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<GroupsVariationTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value, entry: any) => (
            <span style={{ color: entry.color }}>
              {entry.payload.codigo}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
