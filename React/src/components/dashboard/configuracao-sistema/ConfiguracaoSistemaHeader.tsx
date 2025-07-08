
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, AlertCircle } from 'lucide-react';

interface ConfiguracaoSistemaHeaderProps {
  onSalvarConfiguracoes: () => void;
  hasUnsavedChanges?: boolean;
}

export function ConfiguracaoSistemaHeader({ 
  onSalvarConfiguracoes, 
  hasUnsavedChanges = false 
}: ConfiguracaoSistemaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Configuração do Sistema</h2>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Alterações não salvas
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Configure parâmetros globais do dashboard inteligente</p>
        </div>
      </div>
      <Button 
        onClick={onSalvarConfiguracoes} 
        className={`gap-2 ${hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
        variant={hasUnsavedChanges ? "default" : "default"}
      >
        <Save className="h-4 w-4" />
        {hasUnsavedChanges ? 'Salvar Alterações' : 'Salvar Configurações'}
      </Button>
    </div>
  );
}
