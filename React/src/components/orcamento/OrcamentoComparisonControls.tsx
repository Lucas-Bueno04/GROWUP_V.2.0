
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Grid } from 'lucide-react';

interface OrcamentoComparisonControlsProps {
  viewMode: 'anual' | 'mensal';
  selectedMonth: number | null;
  onViewModeChange: (mode: 'anual' | 'mensal') => void;
  onMonthChange: (month: number) => void;
}

export function OrcamentoComparisonControls({
  viewMode,
  selectedMonth,
  onViewModeChange,
  onMonthChange
}: OrcamentoComparisonControlsProps) {
  const meses = [
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
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'anual' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('anual')}
          className="gap-2"
        >
          <Grid className="h-4 w-4" />
          Visão Anual
        </Button>
        <Button
          variant={viewMode === 'mensal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('mensal')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Visão Mensal
        </Button>
      </div>

      {viewMode === 'mensal' && (
        <Select
          value={selectedMonth?.toString() || '1'}
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {meses.map((mes) => (
              <SelectItem 
                key={mes.value} 
                value={mes.value.toString()}
                className="text-gray-200 focus:bg-gray-700 focus:text-gray-100"
              >
                {mes.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
