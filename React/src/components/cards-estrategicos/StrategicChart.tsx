
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IndicadorEstrategico } from '@/hooks/cards-estrategicos';

interface StrategicChartProps {
  indicadorEstrategico: IndicadorEstrategico;
}

export function StrategicChart({ indicadorEstrategico }: StrategicChartProps) {
  const { performance, tipo } = indicadorEstrategico;

  const chartData = performance.mensal.map(p => ({
    mes: `M${p.mes}`,
    mesCompleto: `Mês ${p.mes}`,
    meta: p.valorMeta,
    realizado: p.valorRealizado,
    status: p.status
  }));

  const formatValue = (value: number) => {
    if (indicadorEstrategico.unidade === '%') {
      return `${value.toFixed(1)}%`;
    } else if (indicadorEstrategico.unidade === 'R$') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toFixed(2);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Mês ${label.replace('M', '')}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'meta' ? 'Meta' : 'Realizado'}: ${formatValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="h-[380px] w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 min-h-[2.5rem]">
            {tipo === 'empresa' && (
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            )}
            {tipo === 'plano-contas' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            )}
            <span className="line-clamp-2">{indicadorEstrategico.nome}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Não há dados mensais para exibir
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[380px] w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 space-y-2">
        <CardTitle className="text-sm line-clamp-2 flex items-start gap-2 min-h-[2.5rem]">
          {tipo === 'empresa' && (
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" title="Indicador Próprio"></div>
          )}
          {tipo === 'plano-contas' && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" title="Plano de Contas"></div>
          )}
          <span className="line-clamp-2">{indicadorEstrategico.nome}</span>
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Meta vs Realizado</span>
          {performance.anual.totalMeta > 0 && (
            <span className="font-medium hidden lg:inline">
              Meta Anual: {formatValue(performance.anual.totalMeta)}
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs ${
            tipo === 'empresa' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {tipo === 'empresa' ? 'Próprio' : 'Plano de Contas'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 h-[calc(100%-8rem)]">
        <div className="h-[200px] w-full mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="mes" 
                fontSize={10}
                className="fill-muted-foreground"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                fontSize={10}
                className="fill-muted-foreground"
                tickFormatter={(value) => {
                  if (indicadorEstrategico.unidade === 'R$') {
                    return new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact',
                      maximumFractionDigits: 0
                    }).format(value);
                  } else if (indicadorEstrategico.unidade === '%') {
                    return `${value.toFixed(0)}%`;
                  }
                  return value.toFixed(0);
                }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                iconSize={8}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#6b7280" 
                strokeDasharray="5 5"
                name="Meta"
                dot={{ r: 2, fill: '#6b7280' }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="realizado" 
                stroke={tipo === 'empresa' ? "#10b981" : "#2563eb"}
                name="Realizado"
                dot={{ r: 3, fill: tipo === 'empresa' ? "#10b981" : "#2563eb" }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-green-50 rounded dark:bg-green-900/20">
            <p className="text-green-600 font-medium text-sm">
              {performance.mensal.filter(p => p.status === 'acima').length}
            </p>
            <p className="text-muted-foreground">Acima</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded dark:bg-blue-900/20">
            <p className="text-blue-600 font-medium text-sm">
              {performance.mensal.filter(p => p.status === 'dentro').length}
            </p>
            <p className="text-muted-foreground">Meta</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded dark:bg-red-900/20">
            <p className="text-red-600 font-medium text-sm">
              {performance.mensal.filter(p => p.status === 'abaixo').length}
            </p>
            <p className="text-muted-foreground">Abaixo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
