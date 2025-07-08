
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Filter } from "lucide-react";

interface PeriodSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  availableMonths: number[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const MONTHS = [
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

export function PeriodSelector({ 
  selectedYear, 
  selectedMonth, 
  availableMonths,
  onYearChange, 
  onMonthChange 
}: PeriodSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Período de Análise:</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ano:</span>
              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Até o mês:</span>
              <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem 
                      key={month.value} 
                      value={month.value.toString()}
                      disabled={!availableMonths.includes(month.value)}
                    >
                      <div className="flex items-center gap-2">
                        {month.label}
                        {!availableMonths.includes(month.value) && (
                          <span className="text-xs text-muted-foreground">(sem dados)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
            <Filter className="h-3 w-3" />
            <span>Dados acumulados até {MONTHS.find(m => m.value === selectedMonth)?.label} de {selectedYear}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
