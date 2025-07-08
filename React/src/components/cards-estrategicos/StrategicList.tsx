
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IndicadorEstrategico } from '@/hooks/cards-estrategicos';

interface StrategicListProps {
  indicadorEstrategico: IndicadorEstrategico;
}

export function StrategicList({ indicadorEstrategico }: StrategicListProps) {
  const { performance, tipo } = indicadorEstrategico;

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'acima':
        return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Acima</Badge>;
      case 'abaixo':
        return <Badge variant="destructive">Abaixo</Badge>;
      default:
        return <Badge variant="secondary">Meta</Badge>;
    }
  };

  const sortedMensal = [...performance.mensal].sort((a, b) => a.mes - b.mes);

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
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            tipo === 'empresa' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {tipo === 'empresa' ? 'Próprio' : 'Plano de Contas'}
          </span>
          {performance.anual.totalMeta > 0 && (
            <span className="text-xs text-muted-foreground hidden lg:inline">
              Meta Anual: {formatValue(performance.anual.totalMeta)}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4 h-[calc(100%-8rem)]">
        <div className="h-[220px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-xs">Mês</TableHead>
                <TableHead className="text-xs">Meta</TableHead>
                <TableHead className="text-xs">Realizado</TableHead>
                <TableHead className="w-16 text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMensal.length > 0 ? (
                sortedMensal.map((mensal) => (
                  <TableRow key={mensal.mes}>
                    <TableCell className="font-mono text-xs">
                      {mensal.mes.toString().padStart(2, '0')}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatValue(mensal.valorMeta)}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {formatValue(mensal.valorRealizado)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(mensal.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4 text-xs">
                    Nenhum dado mensal disponível
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo no rodapé */}
        <div className="mt-3 pt-3 border-t">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="font-medium text-green-600">
                {performance.mensal.filter(p => p.status === 'acima').length}
              </p>
              <p className="text-muted-foreground">Acima</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-blue-600">
                {performance.mensal.filter(p => p.status === 'dentro').length}
              </p>
              <p className="text-muted-foreground">Meta</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600">
                {performance.mensal.filter(p => p.status === 'abaixo').length}
              </p>
              <p className="text-muted-foreground">Abaixo</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
