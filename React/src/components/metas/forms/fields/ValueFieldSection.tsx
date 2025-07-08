
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ValueFieldSectionProps {
  vinculadoOrcamento: boolean;
  tipoValor: 'valor' | 'percentual';
  tipoMeta: 'mensal' | 'anual';
  valorMeta: string;
  onValorMetaChange: (value: string) => void;
  indicadorUnidade?: string;
}

export function ValueFieldSection({
  vinculadoOrcamento,
  tipoValor,
  tipoMeta,
  valorMeta,
  onValorMetaChange,
  indicadorUnidade
}: ValueFieldSectionProps) {
  const getLabel = () => {
    const suffix = tipoMeta === 'anual' ? ' (Meta para o ano todo)' : '';
    const unit = tipoValor === 'percentual' ? '%' : (indicadorUnidade || 'un');
    return `Valor da Meta${suffix} (${unit})`;
  };

  return (
    <>
      {!vinculadoOrcamento && (
        <div className="space-y-2">
          <Label htmlFor="valor_meta">
            {getLabel()}
          </Label>
          <Input
            id="valor_meta"
            type="number"
            step="0.01"
            value={valorMeta}
            onChange={(e) => onValorMetaChange(e.target.value)}
            placeholder="0.00"
          />
        </div>
      )}

      {vinculadoOrcamento && valorMeta && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <Label className="text-sm font-medium text-blue-800">
            Valor obtido do orçamento: {valorMeta} {tipoValor === 'percentual' ? '%' : (indicadorUnidade || 'un')}
          </Label>
        </div>
      )}
    </>
  );
}
