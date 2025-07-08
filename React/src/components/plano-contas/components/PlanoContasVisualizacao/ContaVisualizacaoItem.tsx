
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { OrcamentoConta } from '@/types/orcamento.types';

interface ContaVisualizacaoItemProps {
  conta: OrcamentoConta;
}

export function ContaVisualizacaoItem({ conta }: ContaVisualizacaoItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background rounded border border-muted">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground w-16">
          {conta.codigo}
        </span>
        <span className="text-sm">{conta.nome}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant={conta.sinal === '+' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {conta.sinal === '+' ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Badge>
        
        {conta.editavel_aluno ? (
          <Badge variant="outline" className="text-xs">Editável</Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">Fixo</Badge>
        )}
      </div>
    </div>
  );
}
