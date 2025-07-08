
import React from 'react';
import { EmpresaSelector } from '@/components/shared/EmpresaSelector';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Building2 } from 'lucide-react';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { usePeriodSelector } from '@/hooks/usePeriodSelector';

interface DashboardHeaderProps {
  empresaId: string | null;
  onEmpresaChange: (empresaId: string | null) => void;
}

export function DashboardHeader({ empresaId, onEmpresaChange }: DashboardHeaderProps) {
  const { selectedYear, setSelectedYear } = usePeriodSelector();
  const { data: badgeData } = useCompanyBadge(empresaId);

  // Gerar anos de 2020 até ano atual + 2
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: (currentYear + 2) - 2020 + 1 },
    (_, i) => 2020 + i
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h1>
          <p className="text-muted-foreground">
            Sistema Inteligente de Análise Empresarial
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
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
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {empresaId && badgeData?.classification && (
                <CompanyMedal 
                  classification={badgeData.classification} 
                  currentRevenue={badgeData.currentRevenue}
                  size="sm" 
                  showProgress={false}
                />
              )}
            </div>
            <EmpresaSelector 
              empresaId={empresaId}
              onEmpresaChange={onEmpresaChange}
              className="w-full sm:w-[300px]"
              includeAllOption={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
