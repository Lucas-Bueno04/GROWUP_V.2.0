
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { getVarianceStatusIcon, getVarianceStatusBadge } from '../utils/varianceUtils';

interface DetailedAnalysisTableContentProps {
  data: any[];
  searchTerm: string;
  onSort: (field: 'nome' | 'orcado' | 'realizado' | 'variancia') => void;
}

export function DetailedAnalysisTableContent({
  data,
  searchTerm,
  onSort
}: DetailedAnalysisTableContentProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (orcado: number, realizado: number) => {
    if (orcado === 0) return '0%';
    const variance = ((realizado - orcado) / orcado) * 100;
    return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`;
  };

  const getStatusIcon = (variancia: number, orcado: number, sinal: '+' | '-') => {
    const iconName = getVarianceStatusIcon(variancia, orcado, sinal);
    
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'trending-down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (variancia: number, orcado: number, sinal: '+' | '-') => {
    const badgeInfo = getVarianceStatusBadge(variancia, orcado, sinal);
    
    return (
      <Badge variant={badgeInfo.variant} className={badgeInfo.className}>
        {badgeInfo.text}
      </Badge>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Nenhum dado encontrado</p>
        {searchTerm && (
          <p className="text-sm">Tente ajustar os filtros de busca</p>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('nome')}
          >
            <div className="flex items-center gap-1">
              Nome
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead 
            className="text-right cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('orcado')}
          >
            <div className="flex items-center justify-end gap-1">
              Orçado
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead 
            className="text-right cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('realizado')}
          >
            <div className="flex items-center justify-end gap-1">
              Realizado
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead 
            className="text-right cursor-pointer hover:bg-muted/50"
            onClick={() => onSort('variancia')}
          >
            <div className="flex items-center justify-end gap-1">
              Variação
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="hover:bg-muted/50">
            <TableCell className="font-mono text-sm">{item.id}</TableCell>
            <TableCell className="font-medium">{item.nome}</TableCell>
            <TableCell className="text-right">{formatCurrency(item.orcado)}</TableCell>
            <TableCell className="text-right">{formatCurrency(item.realizado)}</TableCell>
            <TableCell className="text-right">
              <div className="flex flex-col items-end">
                <span className={`font-medium ${
                  item.variancia > 0 ? 'text-green-600' : 
                  item.variancia < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatCurrency(item.variancia)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatPercentage(item.orcado, item.realizado)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(item.variancia, item.orcado, item.sinal || '+')}
                {getStatusBadge(item.variancia, item.orcado, item.sinal || '+')}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
