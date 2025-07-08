
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Calculator } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { ContaVisualizacaoItem } from './ContaVisualizacaoItem';
import { getDescricaoGrupo, getGrupoColorClass, getTipoCalculoBadgeVariant } from './utils';

interface GrupoVisualizacaoProps {
  grupo: OrcamentoGrupo;
  contas: OrcamentoConta[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function GrupoVisualizacao({ 
  grupo, 
  contas, 
  isExpanded, 
  onToggle 
}: GrupoVisualizacaoProps) {
  const colorClass = getGrupoColorClass(grupo.codigo);
  
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={`border rounded-lg ${colorClass}`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold">
                    {grupo.codigo}
                  </span>
                  <span className="font-medium text-sm">
                    {grupo.nome}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {getDescricaoGrupo(grupo.codigo)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={getTipoCalculoBadgeVariant(grupo.tipo_calculo)}
                className="text-xs"
              >
                {grupo.tipo_calculo === 'calculado' && <Calculator className="h-3 w-3 mr-1" />}
                {grupo.tipo_calculo}
              </Badge>
              
              {grupo.formula && (
                <Badge variant="outline" className="text-xs font-mono">
                  {grupo.formula}
                </Badge>
              )}
              
              <Badge variant="secondary" className="text-xs">
                {contas.length} conta{contas.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t bg-muted/20">
            <div className="p-4">
              {contas.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">Nenhuma conta cadastrada neste grupo</p>
                  <p className="text-xs mt-1">
                    Use o gerenciamento para adicionar contas específicas
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Contas Detalhadas:
                  </h4>
                  
                  {contas
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((conta) => (
                      <ContaVisualizacaoItem key={conta.id} conta={conta} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
