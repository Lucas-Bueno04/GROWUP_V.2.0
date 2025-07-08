
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, Clock, TrendingUp, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CompanyMedal } from "@/components/empresa/CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";

interface CompanyStatusProps {
  empresas: any[];
}

export function CompanyStatus({ empresas }: CompanyStatusProps) {
  const navigate = useNavigate();

  console.log('CompanyStatus - empresas received:', empresas);

  if (!empresas || empresas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Suas Empresas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma empresa vinculada ainda.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Cadastre suas empresas para começar a gerenciar orçamentos e metas.
            </p>
            <Button onClick={() => navigate('/empresas')}>
              <Building2 className="h-4 w-4 mr-2" />
              Cadastrar Empresa
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inativo': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo': return <TrendingUp className="h-3 w-3" />;
      case 'inativo': return <Clock className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Suas Empresas ({empresas.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/empresas')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Gerenciar
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {empresas.slice(0, 3).map((empresa) => (
          <CompanyItem key={empresa.id} empresa={empresa} navigate={navigate} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
        ))}
        
        {empresas.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/empresas')}>
              Ver mais {empresas.length - 3} empresa(s)
            </Button>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/empresas')}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Empresa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyItem({ empresa, navigate, getStatusColor, getStatusIcon }: { 
  empresa: any; 
  navigate: (path: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  const { data: badgeData } = useCompanyBadge(empresa.id);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
         onClick={() => navigate(`/empresas`)}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">{empresa.nome}</h4>
          {badgeData?.classification && (
            <CompanyMedal 
              classification={badgeData.classification} 
              currentRevenue={badgeData.currentRevenue}
              size="sm" 
              showProgress={false}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {empresa.nome_fantasia || 'Sem nome fantasia'}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Setor: {empresa.setor}</span>
          {empresa.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(empresa.created_at), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge className={`${getStatusColor(empresa.status)} flex items-center gap-1`} variant="secondary">
          {getStatusIcon(empresa.status)}
          {empresa.status || 'Indefinido'}
        </Badge>
        <div className="text-xs text-muted-foreground">
          Porte: {empresa.porte}
        </div>
      </div>
    </div>
  );
}
