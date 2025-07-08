
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PainelIndicadoresHeaderProps {
  onRecalcular: () => void;
  data?: any;
  isRecalculando?: boolean;
}

export function PainelIndicadoresHeader({ 
  onRecalcular, 
  data, 
  isRecalculando = false 
}: PainelIndicadoresHeaderProps) {
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para download...",
    });
    // TODO: Implementar exportação de dados
  };

  // Calcular estatísticas dos dados
  const totalEmpresas = data?.empresas?.length || 0;
  const totalIndicadores = data?.indicadoresPlano?.length || 0;
  const ultimaAtualizacao = data?.indicadoresMedias?.[0]?.updated_at 
    ? new Date(data.indicadoresMedias[0].updated_at).toLocaleDateString('pt-BR')
    : '--';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Painel de Indicadores</h1>
          <p className="text-muted-foreground">
            Análise das médias de indicadores por empresa e faixa de faturamento
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="gap-2"
            disabled={!data || totalEmpresas === 0}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Button
            onClick={onRecalcular}
            className="gap-2"
            disabled={isRecalculando}
          >
            <RefreshCw className={`h-4 w-4 ${isRecalculando ? 'animate-spin' : ''}`} />
            {isRecalculando ? 'Recalculando...' : 'Recalcular Médias'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground">
              Com dados no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicadores Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIndicadores}</div>
            <p className="text-xs text-muted-foreground">
              Do plano de contas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ultimaAtualizacao}</div>
            <p className="text-xs text-muted-foreground">
              Das médias
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
