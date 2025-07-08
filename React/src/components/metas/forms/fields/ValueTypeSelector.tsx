
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ValueTypeSelectorProps {
  value: 'valor' | 'percentual';
  onChange: (value: 'valor' | 'percentual') => void;
}

export function ValueTypeSelector({ value, onChange }: ValueTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Tipo do Valor</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="valor" id="valor" />
          <Label htmlFor="valor">Valor</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="percentual" id="percentual" />
          <Label htmlFor="percentual">Percentual</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
