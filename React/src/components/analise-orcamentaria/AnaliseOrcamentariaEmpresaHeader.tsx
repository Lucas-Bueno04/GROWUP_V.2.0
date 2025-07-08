
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { BadgeProgressIndicator } from './BadgeProgressIndicator';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { useAuth } from '@/hooks/useAuth';

interface AnaliseOrcamentariaEmpresaHeaderProps {
  empresaId: string | null;
  selectedYear: number;
}

export function AnaliseOrcamentariaEmpresaHeader({
  empresaId,
  selectedYear
}: AnaliseOrcamentariaEmpresaHeaderProps) {
  const { user } = useAuth();
  const { data: empresasOrcamento = [] } = useEmpresasOrcamento();
  const { data: orcamentosUsuario = [] } = useOrcamentoEmpresasPorUsuario();
  const { data: badgeData } = useCompanyBadge(empresaId);

  if (!empresaId) return null;

  // Get company name based on user role using correct property names
  const getCompanyName = () => {
    if (user?.role === 'mentor') {
      const empresa = empresasOrcamento.find(e => e.id === empresaId);
      return empresa ? `${empresa.nomeFantasia || empresa.nome} (${empresa.ano})` : 'Empresa não encontrada';
    } else {
      const orcamento = orcamentosUsuario.find(o => o.empresa_id === empresaId);
      return orcamento?.empresa ? `${orcamento.empresa.nome_fantasia || orcamento.empresa.nome} (${orcamento.ano})` : 'Empresa não encontrada';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Company Info with Badge - Unified Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Company Badge */}
            {badgeData?.classification && (
              <div className="flex justify-center lg:justify-start">
                <CompanyMedal 
                  classification={badgeData.classification} 
                  currentRevenue={badgeData.currentRevenue}
                  size="sm" 
                  showProgress={false}
                />
              </div>
            )}
            
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-semibold">{getCompanyName()}</h2>
              <p className="text-sm text-muted-foreground">Análise orçamentária da empresa</p>
            </div>
          </div>

          {/* Badge Progress */}
          <div className="min-w-0 lg:max-w-xs">
            {badgeData && (
              <BadgeProgressIndicator
                currentRevenue={badgeData.currentRevenue}
                nextThreshold={badgeData.nextThreshold}
                nextLevel={badgeData.nextLevel}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Additional info */}
        <div className="text-xs text-muted-foreground">
          Dados de {selectedYear} • Análise comparativa orçado vs realizado
        </div>
      </CardContent>
    </Card>
  );
}
