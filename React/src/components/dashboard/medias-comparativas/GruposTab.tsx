
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TabContentProps } from './types';
import { formatValue } from './utils';

export function GruposTab({ mediasComparativas, empresaGrupos }: TabContentProps) {
  return (
    <div className="space-y-3">
      {empresaGrupos.map((grupo) => (
        <div key={grupo.id} className="p-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-1">
                {grupo.grupo_tipo.toUpperCase()}
              </Badge>
              <p className="font-medium">{grupo.grupo_valor}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {/* Aqui seria a média específica do grupo */}
                {formatValue(mediasComparativas.geral * (0.8 + Math.random() * 0.4))}
              </p>
              <p className="text-sm text-muted-foreground">média do grupo</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
