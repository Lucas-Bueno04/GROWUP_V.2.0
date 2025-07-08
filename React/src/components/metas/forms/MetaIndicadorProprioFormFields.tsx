
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MetaIndicadorProprioFormFieldsProps {
  formData: {
    tipo_meta: 'mensal' | 'anual';
    tipo_valor: 'valor' | 'percentual';
    ano: number;
    mes: number;
    valor_meta: string;
    descricao: string;
    vinculado_orcamento: boolean;
    conta_orcamento_id: string;
    tipo_item_orcamento: 'conta' | 'grupo';
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  replicarTodosMeses: boolean;
  setReplicarTodosMeses: (value: boolean) => void;
}

export function MetaIndicadorProprioFormFields({
  formData,
  setFormData,
  replicarTodosMeses,
  setReplicarTodosMeses
}: MetaIndicadorProprioFormFieldsProps) {
  // Automaticamente definir mês para dezembro quando meta for anual
  React.useEffect(() => {
    if (formData.tipo_meta === 'anual') {
      setFormData((prev: any) => ({ ...prev, mes: 12 }));
    }
  }, [formData.tipo_meta, setFormData]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo_meta">Tipo de Meta</Label>
          <Select 
            value={formData.tipo_meta} 
            onValueChange={(value) => setFormData((prev: any) => ({ 
              ...prev, 
              tipo_meta: value as 'mensal' | 'anual' 
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_valor">Tipo de Valor</Label>
          <Select 
            value={formData.tipo_valor} 
            onValueChange={(value) => setFormData((prev: any) => ({ 
              ...prev, 
              tipo_valor: value as 'valor' | 'percentual' 
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valor">Valor Absoluto</SelectItem>
              <SelectItem value="percentual">Percentual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ano">Ano</Label>
          <Input
            id="ano"
            type="number"
            value={formData.ano}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, ano: parseInt(e.target.value) }))}
            min="2020"
            max="2030"
            required
          />
        </div>

        {formData.tipo_meta === 'mensal' && (
          <div className="space-y-2">
            <Label htmlFor="mes">Mês</Label>
            <Select 
              value={formData.mes.toString()} 
              onValueChange={(value) => setFormData((prev: any) => ({ 
                ...prev, 
                mes: parseInt(value) 
              }))}
              disabled={replicarTodosMeses}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.tipo_meta === 'anual' && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Meta Anual - Cálculo baseado no acumulado do ano
            </Label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_meta">Valor da Meta</Label>
        <Input
          id="valor_meta"
          type="number"
          step="0.01"
          value={formData.valor_meta}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, valor_meta: e.target.value }))}
          placeholder="0.00"
          required={!formData.vinculado_orcamento}
          disabled={formData.vinculado_orcamento}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, descricao: e.target.value }))}
          placeholder="Adicione uma descrição para a meta..."
          rows={3}
        />
      </div>

      {formData.tipo_meta === 'mensal' && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="replicar"
              checked={replicarTodosMeses}
              onCheckedChange={setReplicarTodosMeses}
            />
            <Label htmlFor="replicar" className="text-sm">
              Replicar para todos os meses do ano
            </Label>
          </div>
          {replicarTodosMeses && (
            <p className="text-xs text-muted-foreground">
              Criará metas mensais com o mesmo valor para todos os meses de {formData.ano}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
