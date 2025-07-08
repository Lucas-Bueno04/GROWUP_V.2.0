
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Calculator, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getVarianceStatusIcon, getVarianceStatusBadge, determineGroupSign, determineGroupCategory } from '../utils/varianceUtils';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { AccountRow } from './AccountRow';

interface GroupRowProps {
  grupo: any;
  isExpanded: boolean;
  onToggle: () => void;
  groupValues: {
    orcado: number;
    realizado: number;
    variancia: number;
  };
  selectedMonth: string;
  getMonthlyData: (conta: any, month: number) => { orcado: number; realizado: number };
}

export function GroupRow({ 
  grupo, 
  isExpanded, 
  onToggle, 
  groupValues, 
  selectedMonth, 
  getMonthlyData 
}: GroupRowProps) {
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

  // Use the improved function to determine group sign correctly (for variance calculations)
  const groupSinal = determineGroupSign(grupo);
  
  // Use the new function to determine group category for display
  const groupCategory = determineGroupCategory(grupo);

  // Log the group analysis for debugging
  console.log(`Group Analysis - ${grupo.nome}:`, {
    codigo: grupo.codigo,
    tipo_calculo: grupo.tipo_calculo,
    formula: grupo.formula,
    ordem: grupo.ordem,
    determinedSign: groupSinal,
    displayCategory: groupCategory,
    variancia: groupValues.variancia,
    orcado: groupValues.orcado
  });

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center w-full p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer">
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div className="font-semibold">{grupo.codigo}</div>
            <div className="font-medium">{grupo.nome}</div>
            {grupo.tipo_calculo === 'calculado' && (
              <div className="flex items-center gap-1">
                <Calculator className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">Calculado</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {groupCategory}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <div className="font-medium">{formatCurrency(groupValues.orcado)}</div>
              <div className="text-muted-foreground text-xs">Orçado</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(groupValues.realizado)}</div>
              <div className="text-muted-foreground text-xs">Realizado</div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${
                groupValues.variancia > 0 ? 'text-green-600' : 
                groupValues.variancia < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {formatCurrency(groupValues.variancia)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatPercentage(groupValues.orcado, groupValues.realizado)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(groupValues.variancia, groupValues.orcado, groupSinal)}
              {getStatusBadge(groupValues.variancia, groupValues.orcado, groupSinal)}
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="ml-6 mt-2 space-y-1">
          {grupo.contas.map((conta: any) => {
            const orcado = selectedMonth === 'all' ? conta.orcado : getMonthlyData(conta, parseInt(selectedMonth)).orcado;
            const realizado = selectedMonth === 'all' ? conta.realizado : getMonthlyData(conta, parseInt(selectedMonth)).realizado;
            const variancia = realizado - orcado;
            
            return (
              <AccountRow
                key={conta.id}
                conta={conta}
                orcado={orcado}
                realizado={realizado}
                variancia={variancia}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
