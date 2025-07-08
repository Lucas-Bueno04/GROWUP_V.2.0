
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateFieldsSectionProps {
  tipoMeta: 'mensal' | 'anual';
  ano: number;
  mes: number;
  onAnoChange: (ano: number) => void;
  onMesChange: (mes: number) => void;
  replicarTodosMeses?: boolean;
}

export function DateFieldsSection({
  tipoMeta,
  ano,
  mes,
  onAnoChange,
  onMesChange,
  replicarTodosMeses = false
}: DateFieldsSectionProps) {
  const mesesDoAno = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ano">Ano</Label>
        <Input
          id="ano"
          type="number"
          value={ano}
          onChange={(e) => onAnoChange(parseInt(e.target.value))}
          min={2020}
          max={2030}
        />
      </div>
      
      {tipoMeta === 'mensal' && !replicarTodosMeses && (
        <div className="space-y-2">
          <Label htmlFor="mes">Mês</Label>
          <Select
            value={mes.toString()}
            onValueChange={(value) => onMesChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mesesDoAno.map((mes) => (
                <SelectItem key={mes.value} value={mes.value.toString()}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
