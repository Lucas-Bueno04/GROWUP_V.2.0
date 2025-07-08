
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { TipoCalculo, TipoSinal } from '@/types/plano-contas.types';

type EntityType = 'grupo' | 'conta';

interface FormData {
  type: EntityType;
  grupoId?: string;
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo?: TipoCalculo;
  formula?: string;
  editavel_aluno: boolean;
  grupo_id?: string;
  sinal?: TipoSinal;
}

interface FormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  editingEntity: { type: EntityType; data: any } | null;
  grupos: OrcamentoGrupo[];
}

export function FormFields({ formData, setFormData, editingEntity, grupos }: FormFieldsProps) {
  return (
    <div className="space-y-4">
      {!editingEntity && (
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(value: EntityType) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grupo">Grupo</SelectItem>
              <SelectItem value="conta">Conta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="codigo">Código</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
            placeholder={formData.type === 'grupo' ? "Ex: 01" : "Ex: 01.01"}
          />
        </div>
        <div>
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            id="ordem"
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          placeholder={formData.type === 'grupo' ? "Ex: RECEITA OPERACIONAL BRUTA" : "Ex: Vendas de Produtos"}
        />
      </div>

      {formData.type === 'grupo' && (
        <>
          <div>
            <Label htmlFor="tipo_calculo">Tipo de Cálculo</Label>
            <Select
              value={formData.tipo_calculo}
              onValueChange={(value: TipoCalculo) => setFormData(prev => ({ ...prev, tipo_calculo: value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="Ex: 01 - 02"
              />
            </div>
          )}
        </>
      )}

      {formData.type === 'conta' && (
        <>
          <div>
            <Label htmlFor="grupo_id">Grupo</Label>
            <Select
              value={formData.grupo_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, grupo_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                {grupos.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.codigo} - {grupo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sinal">Sinal</Label>
            <Select
              value={formData.sinal}
              onValueChange={(value: TipoSinal) => setFormData(prev => ({ ...prev, sinal: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sinal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+">+ (Positivo)</SelectItem>
                <SelectItem value="-">- (Negativo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="editavel_aluno"
          checked={formData.editavel_aluno}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, editavel_aluno: checked }))}
        />
        <Label htmlFor="editavel_aluno">Editável pelo aluno</Label>
      </div>
    </div>
  );
}
