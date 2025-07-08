
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from 'lucide-react';
import { EmpresaOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';

interface AnaliseOrcamentariaControlsProps {
  selectedYear: number;
  selectedEmpresa?: string;
  selectedMonth?: number;
  empresas: EmpresaOrcamento[];
  onYearChange: (year: number) => void;
  onEmpresaChange: (empresaId: string) => void;
  onMonthChange?: (month: number | undefined) => void;
  onRefresh?: () => void;
}

export function AnaliseOrcamentariaControls({
  selectedYear,
  selectedEmpresa,
  selectedMonth,
  empresas,
  onYearChange,
  onEmpresaChange,
  onMonthChange,
  onRefresh
}: AnaliseOrcamentariaControlsProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(new Set(empresas.map(e => e.ano)))
    .sort((a, b) => b - a);

  const empresasForYear = empresas.filter(e => e.ano === selectedYear);

  const months = [
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
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Filters Section - Centered */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ano:</span>
              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                <SelectTrigger className="w-28 border-gray-200 focus:border-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.length > 0 ? (
                    availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={currentYear.toString()}>
                      {currentYear}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Empresa:</span>
              <Select value={selectedEmpresa || ""} onValueChange={onEmpresaChange}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-gray-400">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasForYear.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia || empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {onMonthChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Até o mês:</span>
                <Select 
                  value={selectedMonth?.toString() || ""} 
                  onValueChange={(value) => onMonthChange(value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger className="w-36 border-gray-200 focus:border-gray-400">
                    <SelectValue placeholder="Ano completo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ano-completo">Ano completo</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Helper text when no company selected */}
          {!selectedEmpresa && (
            <p className="text-sm text-muted-foreground lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              Selecione uma empresa para análise orçamentária
            </p>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <div className="flex justify-center lg:justify-end w-full lg:w-auto">
              <Button 
                onClick={onRefresh} 
                variant="outline" 
                size="sm" 
                className="shrink-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
