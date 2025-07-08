
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { HierarchicalAccountSelector } from '../HierarchicalAccountSelector';

interface BudgetLinkSectionProps {
  vinculadoOrcamento: boolean;
  onVinculadoOrcamentoChange: (checked: boolean) => void;
  contaOrcamentoId: string;
  onContaOrcamentoIdChange: (value: string) => void;
  onValorMetaClear?: () => void;
}

export function BudgetLinkSection({
  vinculadoOrcamento,
  onVinculadoOrcamentoChange,
  contaOrcamentoId,
  onContaOrcamentoIdChange,
  onValorMetaClear
}: BudgetLinkSectionProps) {
  const handleVinculadoChange = (checked: boolean) => {
    onVinculadoOrcamentoChange(checked);
    if (!checked) {
      onContaOrcamentoIdChange('');
      onValorMetaClear?.();
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="vinculado_orcamento"
            checked={vinculadoOrcamento}
            onCheckedChange={(checked) => handleVinculadoChange(checked === true)}
          />
          <Label htmlFor="vinculado_orcamento" className="text-sm font-medium">
            Vinculada ao Orçamento
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Quando marcado, os valores da meta são obtidos automaticamente do orçamento
        </p>
      </div>

      {vinculadoOrcamento && (
        <HierarchicalAccountSelector
          value={contaOrcamentoId}
          onValueChange={onContaOrcamentoIdChange}
          label="Conta ou Grupo do Orçamento"
          placeholder="Selecione uma conta ou grupo do orçamento"
        />
      )}
    </>
  );
}
