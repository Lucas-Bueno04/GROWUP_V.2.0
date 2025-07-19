import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { BadgeProgressIndicator } from './BadgeProgressIndicator';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnaliseOrcamentariaEmpresaHeaderProps {
  budgetName: string | null;
  selectedYear: number;
  setMeses:(meses: string[]) => void;
}

const MESES = [
  "TODOS",
  "JANEIRO",
  "FEVEREIRO",
  "MARCO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO"
];

export function AnaliseOrcamentariaEmpresaHeader({
  budgetName,
  selectedYear,
  setMeses, 
}: AnaliseOrcamentariaEmpresaHeaderProps) {
  const [periodo, setPeriodo] = useState("TODOS");

  function getMesesSelecionados(mesSelecionado: string): string[] {
    if (mesSelecionado === "TODOS") {
      return MESES.slice(1); // Ignora "TODOS"
    }

    const index = MESES.indexOf(mesSelecionado);
    if (index === -1) return [];

    return MESES.slice(1, index + 1); // Do primeiro mês até o selecionado
  }

  useEffect(() => {
      const mesesSelecionados = getMesesSelecionados(periodo);
      console.log("Meses selecionados:", mesesSelecionados);
      setMeses(mesesSelecionados)
  
      // Aqui você pode usar os mesesSelecionados para filtrar dados, fazer requisições, etc.
  }, [periodo]);
  

  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Company Info with Badge - Unified Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
           
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-semibold">{budgetName}</h2>
              <p className="text-sm text-muted-foreground">Análise orçamentária da empresa</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
         <label className="text-sm font-medium text-muted-foreground">Período</label>
            <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map(mes => (
                      <SelectItem key={mes} value={mes}>
                        {mes}
                      </SelectItem>
                  ))}
                </SelectContent>
          </Select>
        {/* Additional info */}
        <div className="text-xs text-muted-foreground">
          Dados de {selectedYear} • Análise comparativa orçado vs realizado
        </div>
      </CardContent>
    </Card>
  );
}
