
import React from "react";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Define chart data interface
export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface PieChartProps {
  data: ChartData;
  height?: number;
  options?: {
    plugins?: {
      legend?: {
        display?: boolean;
        position?: "top" | "bottom" | "left" | "right";
      }
    }
  };
}

export function PieChart({ data, height = 300, options }: PieChartProps) {
  const renderLegend = options?.plugins?.legend?.display !== false;
  const legendPosition = options?.plugins?.legend?.position || "bottom";

  // Format data for Recharts
  const formattedData = React.useMemo(() => {
    if (!data || !data.labels || !data.datasets || !data.datasets[0]) {
      return [];
    }

    return data.labels.map((label, index) => ({
      name: label,
      value: data.datasets[0].data[index]
    }));
  }, [data]);

  const colors = React.useMemo(() => {
    if (!data?.datasets?.[0]?.backgroundColor) {
      return ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];
    }
    
    const bgColors = data.datasets[0].backgroundColor;
    return Array.isArray(bgColors) ? bgColors : [bgColors];
  }, [data]);

  // Convert legend position to valid Recharts values
  const getLegendVerticalAlign = (position: string) => {
    if (position === "top") return "top";
    return "bottom";
  };

  const getLegendAlign = (position: string) => {
    if (position === "left") return "left";
    if (position === "right") return "right";
    return "center";
  };

  return (
    <ChartContainer 
      config={{}} 
      className="w-full"
      style={{ height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {renderLegend && (
            <Legend 
              layout="horizontal" 
              verticalAlign={getLegendVerticalAlign(legendPosition)}
              align={getLegendAlign(legendPosition)}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border p-2 rounded-md shadow-md">
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].color }}>
          Valor: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};
