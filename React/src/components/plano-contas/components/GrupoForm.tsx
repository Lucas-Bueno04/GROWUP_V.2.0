
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TipoCalculo } from '@/types/plano-contas.types';

interface GrupoFormData {
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo: TipoCalculo;
  formula: string;
  editavel_aluno: boolean;
}

interface GrupoFormProps {
  formData: GrupoFormData;
  onFormDataChange: (data: GrupoFormData) => void;
}

export function GrupoForm({ formData, onFormDataChange }: GrupoFormProps) {
  const updateFormData = (updates: Partial<GrupoFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="codigo">Código</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => updateFormData({ codigo: e.target.value })}
            placeholder="Ex: 01"
          />
        </div>
        <div>
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            id="ordem"
            type="number"
            value={formData.ordem}
            onChange={(e) => updateFormData({ ordem: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => updateFormData({ nome: e.target.value })}
          placeholder="Ex: RECEITA OPERACIONAL BRUTA"
        />
      </div>
      
      <div>
        <Label htmlFor="tipo_calculo">Tipo de Cálculo</Label>
        <Select
          value={formData.tipo_calculo}
          onValueChange={(value: TipoCalculo) => updateFormData({ tipo_calculo: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de cálculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soma">Soma</SelectItem>
            <SelectItem value="calculado">Calculado</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.tipo_calculo === 'calculado' && (
        <div>
          <Label htmlFor="formula">Fórmula</Label>
          <Textarea
            id="formula"
            value={formData.formula}
            onChange={(e) => updateFormData({ formula: e.target.value })}
            placeholder="Ex: 01 - 02"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="editavel_aluno"
          checked={formData.editavel_aluno}
          onCheckedChange={(checked) => updateFormData({ editavel_aluno: checked })}
        />
        <Label htmlFor="editavel_aluno">Editável pelo aluno</Label>
      </div>
    </div>
  );
}
