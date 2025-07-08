
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { EmpresaSelector } from '@/components/shared/EmpresaSelector';

interface MetasControlsProps {
  empresaId: string | null;
  onEmpresaChange: (empresaId: string | null) => void;
  onRefresh?: () => void;
}

export function MetasControls({
  empresaId,
  onEmpresaChange,
  onRefresh
}: MetasControlsProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Company Selector - Centered */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Empresa:</span>
            <EmpresaSelector
              empresaId={empresaId}
              onEmpresaChange={onEmpresaChange}
              includeAllOption={false}
              className="w-full max-w-xs border-gray-200 focus:border-gray-400"
            />
          </div>

          {/* Helper text when no company selected */}
          {!empresaId && (
            <p className="text-sm text-muted-foreground lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              Selecione uma empresa para gerenciar suas metas
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
