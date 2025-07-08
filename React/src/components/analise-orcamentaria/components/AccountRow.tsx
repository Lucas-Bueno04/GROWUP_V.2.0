
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getVarianceStatusIcon, getVarianceStatusBadge } from '../utils/varianceUtils';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface AccountRowProps {
  conta: any;
  orcado: number;
  realizado: number;
  variancia: number;
}

export function AccountRow({ conta, orcado, realizado, variancia }: AccountRowProps) {
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

  return (
    <div className="flex items-center p-2 rounded hover:bg-muted/30">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-4"></div>
        <div className="text-sm font-mono">{conta.codigo}</div>
        <div className="text-sm">{conta.nome}</div>
        <Badge variant="outline" className="text-xs">
          {conta.sinal === '+' ? 'Positivo' : 'Negativo'}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="text-right w-24">
          {formatCurrency(orcado)}
        </div>
        <div className="text-right w-24">
          {formatCurrency(realizado)}
        </div>
        <div className={`text-right w-24 ${
          variancia > 0 ? 'text-green-600' : 
          variancia < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {formatCurrency(variancia)}
        </div>
        <div className="text-right w-16 text-xs text-muted-foreground">
          {formatPercentage(orcado, realizado)}
        </div>
        <div className="flex items-center gap-2 w-20">
          {getStatusIcon(variancia, orcado, conta.sinal)}
          {getStatusBadge(variancia, orcado, conta.sinal)}
        </div>
      </div>
    </div>
  );
}
