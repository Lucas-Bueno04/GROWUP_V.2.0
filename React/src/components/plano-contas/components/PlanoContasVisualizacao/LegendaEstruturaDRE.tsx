
import React from 'react';
import { Calculator } from "lucide-react";

export function LegendaEstruturaDRE() {
  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
      <h4 className="font-semibold text-sm mb-2">Legenda da Estrutura DRE:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Receitas Operacionais</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Deduções</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Custos dos Serviços</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Despesas Operacionais</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span>Resultado Final</span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="h-3 w-3" />
          <span>Valores Calculados</span>
        </div>
      </div>
    </div>
  );
}
