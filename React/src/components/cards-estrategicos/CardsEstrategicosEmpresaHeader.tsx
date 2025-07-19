import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CardsEstrategicosEmpresaHeaderProps {
  budgetName: string;
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

export function CardsEstrategicosEmpresaHeader({ budgetName,setMeses}: CardsEstrategicosEmpresaHeaderProps) {
  const [periodo, setPeriodo] = useState("TODOS");
  const [status, setStatus] = useState("todos");

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold">{budgetName}</h2>
            <p className="text-sm text-muted-foreground">Indicadores estratégicos do Orçamento</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Período */}
          <div className="space-y-2">
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
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
