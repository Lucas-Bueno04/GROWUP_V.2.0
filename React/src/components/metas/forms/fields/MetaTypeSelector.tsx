
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MetaTypeSelectorProps {
  value: 'mensal' | 'anual';
  onChange: (value: 'mensal' | 'anual') => void;
  onReplicarReset?: () => void;
}

export function MetaTypeSelector({ value, onChange, onReplicarReset }: MetaTypeSelectorProps) {
  const handleChange = (newValue: 'mensal' | 'anual') => {
    onChange(newValue);
    onReplicarReset?.();
  };

  return (
    <div className="space-y-2">
      <Label>Tipo de Meta</Label>
      <RadioGroup
        value={value}
        onValueChange={handleChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mensal" id="mensal" />
          <Label htmlFor="mensal">Mensal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="anual" id="anual" />
          <Label htmlFor="anual">Anual</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
