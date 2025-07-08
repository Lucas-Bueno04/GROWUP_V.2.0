
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { useIndicadoresMedios } from '@/hooks/indicadores-medios';

interface IndicadorSelectorProps {
  selectedIndicador: string;
  onIndicadorChange: (indicador: string) => void;
  empresaId?: string | null;
  ano?: number;
}

export function IndicadorSelector({ 
  selectedIndicador, 
  onIndicadorChange,
  empresaId,
  ano 
}: IndicadorSelectorProps) {
  const currentYear = ano || new Date().getFullYear();
  const { data: indicadoresMedios, isLoading } = useIndicadoresMedios(currentYear);
  const { data: badgeData } = useCompanyBadge(empresaId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
        <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (!indicadoresMedios || indicadoresMedios.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum indicador disponível para {currentYear}
      </div>
    );
  }

  const selectedIndicadorData = indicadoresMedios.find(
    ind => ind.indicador_codigo === selectedIndicador
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium whitespace-nowrap">Indicador:</span>
      <Select value={selectedIndicador} onValueChange={onIndicadorChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione um indicador">
            <div className="flex items-center gap-2">
              <span>{selectedIndicadorData?.indicador_nome || selectedIndicador}</span>
              {selectedIndicadorData && (
                <Badge variant="outline" className="text-xs">
                  {selectedIndicadorData.total_empresas} empresas
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {indicadoresMedios.map((indicador) => (
            <SelectItem key={indicador.id} value={indicador.indicador_codigo}>
              <div className="flex items-center justify-between w-full">
                <span>{indicador.indicador_nome}</span>
                <Badge variant="outline" className="text-xs ml-2">
                  {indicador.total_empresas}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {empresaId && badgeData?.classification && (
        <div className="flex items-center gap-2 ml-4">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <CompanyMedal 
            classification={badgeData.classification} 
            currentRevenue={badgeData.currentRevenue}
            size="sm" 
            showProgress={false}
          />
        </div>
      )}
    </div>
  );
}
