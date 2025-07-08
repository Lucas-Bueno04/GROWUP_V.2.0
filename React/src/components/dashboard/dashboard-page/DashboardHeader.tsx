
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Building2 } from 'lucide-react';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  isViewingAsMentor: boolean;
  onRefresh: () => void;
  empresaId?: string | null;
  empresaNome?: string;
}

export function DashboardHeader({ 
  userName, 
  userEmail, 
  isViewingAsMentor, 
  onRefresh,
  empresaId,
  empresaNome
}: DashboardHeaderProps) {
  const { data: badgeData } = useCompanyBadge(empresaId);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {userName || userEmail?.split('@')[0] || 'Usuário'}! 👋
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
          <p className="text-lg text-muted-foreground">
            Acompanhe suas métricas e benchmarks de mercado
          </p>
          {empresaId && empresaNome && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{empresaNome}</span>
              </div>
              {badgeData?.classification && (
                <CompanyMedal 
                  classification={badgeData.classification} 
                  currentRevenue={badgeData.currentRevenue}
                  size="sm" 
                  showProgress={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        {isViewingAsMentor && (
          <Button 
            onClick={() => window.location.href = '/mentor'}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Dashboard de Mentor
          </Button>
        )}
      </div>
    </div>
  );
}
