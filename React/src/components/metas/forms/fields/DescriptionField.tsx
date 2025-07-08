
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="descricao">Descrição (opcional)</Label>
      <Textarea
        id="descricao"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Descreva o objetivo da meta..."
        rows={3}
      />
    </div>
  );
}
