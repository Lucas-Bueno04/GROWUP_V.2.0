
import React, { useState } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GroupedMetaEmpresa } from '../utils/metasGroupingUtils';

interface EditarMetaPropriaAgrupadaFormProps {
  metaAgrupada: GroupedMetaEmpresa;
  onClose: () => void;
  atualizarValorRealizado: (id: string, valor: number) => void;
  isUpdating: boolean;
}

export function EditarMetaPropriaAgrupadaForm({ 
  metaAgrupada, 
  onClose, 
  atualizarValorRealizado, 
  isUpdating 
}: EditarMetaPropriaAgrupadaFormProps) {
  const [formData, setFormData] = useState({
    valor_realizado: '0',
    aplicar_todos: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.aplicar_todos) {
      // Atualizar todas as metas do grupo
      const promises = metaAgrupada.ids.map(id =>
        atualizarValorRealizado(id, parseFloat(formData.valor_realizado))
      );
      await Promise.allSettled(promises);
    } else {
      // Atualizar apenas a meta principal
      atualizarValorRealizado(metaAgrupada.id, parseFloat(formData.valor_realizado));
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Meta</Label>
            <p className="text-sm text-muted-foreground">{metaAgrupada.valor_meta}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Período</Label>
            <p className="text-sm text-muted-foreground">{metaAgrupada.periodo_formatado}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Meses incluídos</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {metaAgrupada.meses.map(mes => (
              <Badge key={mes} variant="outline" className="text-xs">
                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][mes - 1]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_realizado">Valor Realizado</Label>
          <Input
            id="valor_realizado"
            type="number"
            step="0.01"
            value={formData.valor_realizado}
            onChange={(e) => setFormData(prev => ({ ...prev, valor_realizado: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="aplicar_todos"
            checked={formData.aplicar_todos}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aplicar_todos: checked }))}
          />
          <Label htmlFor="aplicar_todos" className="text-sm">
            Aplicar a todas as {metaAgrupada.count} metas do grupo
          </Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Salvando...' : `Salvar ${formData.aplicar_todos ? `${metaAgrupada.count} Metas` : 'Meta Principal'}`}
        </Button>
      </DialogFooter>
    </form>
  );
}
