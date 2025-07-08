
import React from 'react';
import { TabContentProps } from './types';

export function InsightsTab({ mediasComparativas }: TabContentProps) {
  return (
    <div className="space-y-4">
      {mediasComparativas.minhaEmpresa && (
        <div className="p-4 rounded-lg border">
          <h4 className="font-medium mb-2">Análise de Performance</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {mediasComparativas.minhaEmpresa > mediasComparativas.geral ? (
              <p className="text-green-600">
                ✓ Sua empresa está {((mediasComparativas.minhaEmpresa / mediasComparativas.geral - 1) * 100).toFixed(1)}% 
                acima da média geral do mercado.
              </p>
            ) : (
              <p className="text-orange-600">
                ⚠ Sua empresa está {((1 - mediasComparativas.minhaEmpresa / mediasComparativas.geral) * 100).toFixed(1)}% 
                abaixo da média geral do mercado.
              </p>
            )}
            
            {mediasComparativas.meuGrupoPorte && (
              <p>
                Em relação a empresas do mesmo porte: {
                  mediasComparativas.minhaEmpresa > mediasComparativas.meuGrupoPorte 
                    ? `${((mediasComparativas.minhaEmpresa / mediasComparativas.meuGrupoPorte - 1) * 100).toFixed(1)}% acima`
                    : `${((1 - mediasComparativas.minhaEmpresa / mediasComparativas.meuGrupoPorte) * 100).toFixed(1)}% abaixo`
                }
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 rounded-lg border bg-muted/50">
        <h4 className="font-medium mb-2">Recomendações</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Monitore regularmente seus indicadores</li>
          <li>• Compare com empresas similares do seu setor</li>
          <li>• Estabeleça metas baseadas nos benchmarks</li>
          <li>• Identifique oportunidades de melhoria</li>
        </ul>
      </div>
    </div>
  );
}
