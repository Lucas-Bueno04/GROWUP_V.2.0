
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrcamentoIndicadores } from '@/hooks/plano-contas';

interface IndicadorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function IndicadorSelector({ value, onChange }: IndicadorSelectorProps) {
  const { data: indicadores = [] } = useOrcamentoIndicadores();

  return (
    <div className="space-y-2">
      <Label htmlFor="indicador">Indicador</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um indicador" />
        </SelectTrigger>
        <SelectContent>
          {indicadores.map((indicador) => (
            <SelectItem key={indicador.id} value={indicador.id}>
              {indicador.codigo} - {indicador.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
