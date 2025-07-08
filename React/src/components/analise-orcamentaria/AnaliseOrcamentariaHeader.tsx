
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Building2, Filter } from "lucide-react";
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { EmpresaOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';

interface AnaliseOrcamentariaHeaderProps {
  selectedYear: number;
  selectedEmpresa?: string;
  empresas: EmpresaOrcamento[];
  onYearChange: (year: number) => void;
  onEmpresaChange: (empresaId: string) => void;
}

export function AnaliseOrcamentariaHeader({
  selectedYear,
  selectedEmpresa,
  empresas,
  onYearChange,
  onEmpresaChange
}: AnaliseOrcamentariaHeaderProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(new Set(empresas.map(e => e.ano)))
    .sort((a, b) => b - a);

  const empresasForYear = empresas.filter(e => e.ano === selectedYear);
  const selectedEmpresaData = empresasForYear.find(e => e.id === selectedEmpresa);
  
  const { data: badgeData } = useCompanyBadge(selectedEmpresa || null);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filtros de Análise:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ano:</span>
                <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                  <SelectTrigger className="w-28">
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
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Empresa:</span>
                </div>
                <Select value={selectedEmpresa || ""} onValueChange={onEmpresaChange}>
                  <SelectTrigger className="w-48">
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedEmpresaData && badgeData?.classification && (
              <CompanyMedal 
                classification={badgeData.classification} 
                currentRevenue={badgeData.currentRevenue}
                size="sm" 
                showProgress={false}
              />
            )}
            <div className="text-xs text-muted-foreground">
              Dados de {selectedYear} • {empresasForYear.length} empresa(s) disponível(is)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
