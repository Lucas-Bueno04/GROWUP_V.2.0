
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface CardsEstrategicosEmptyStateProps {
  empresaId: string | null;
  onEmpresaChange: (empresaId: string | null) => void;
  onRefresh: () => void;
  metasIndicadoresCount: number;
  metasIndicadoresEmpresaCount: number;
  indicadoresEmpresaCount: number;
  showDebugInfo?: boolean;
  ano: number;
}

export function CardsEstrategicosEmptyState({
  empresaId,
  onEmpresaChange,
  onRefresh,
  metasIndicadoresCount,
  metasIndicadoresEmpresaCount,
  indicadoresEmpresaCount,
  showDebugInfo = false,
  ano
}: CardsEstrategicosEmptyStateProps) {
  return (
    <div className="space-y-6">
      {/* Debug Information */}
      {showDebugInfo && (
        <Card className="border-dashed border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-400 mb-2">Debug Info</h4>
            <div className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
              <div>Empresa selecionada: {empresaId || 'Todas'}</div>
              <div>Ano: {ano}</div>
              <div>Metas Plano de Contas: {metasIndicadoresCount}</div>
              <div>Metas Próprias: {metasIndicadoresEmpresaCount}</div>
              <div>Indicadores Próprios: {indicadoresEmpresaCount}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Indicador Estratégico</h3>
            <p className="text-muted-foreground mb-4">
              Para visualizar os cards estratégicos, é necessário:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground mb-6">
              <li>• Ter indicadores criados no Plano de Contas ou indicadores próprios</li>
              <li>• Definir metas para esses indicadores</li>
              <li>• Ter dados realizados para comparação</li>
            </ul>
            
            {/* Diagnostic info */}
            <div className="text-sm text-muted-foreground">
              <p>Diagnóstico atual:</p>
              <p>- Metas do Plano de Contas: {metasIndicadoresCount}</p>
              <p>- Metas Próprias: {metasIndicadoresEmpresaCount}</p>
              <p>- Indicadores Próprios: {indicadoresEmpresaCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
