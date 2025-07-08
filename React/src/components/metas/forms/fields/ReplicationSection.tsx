
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ReplicationSectionProps {
  tipoMeta: 'mensal' | 'anual';
  replicarTodosMeses: boolean;
  onReplicarTodosMesesChange: (checked: boolean) => void;
  ano: number;
}

export function ReplicationSection({
  tipoMeta,
  replicarTodosMeses,
  onReplicarTodosMesesChange,
  ano
}: ReplicationSectionProps) {
  if (tipoMeta !== 'mensal') return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="replicar"
          checked={replicarTodosMeses}
          onCheckedChange={(checked) => onReplicarTodosMesesChange(checked === true)}
        />
        <Label htmlFor="replicar" className="text-sm">
          Replicar para todos os meses do ano
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Criará metas mensais com o mesmo valor para todos os meses de {ano}
      </p>
    </div>
  );
}
