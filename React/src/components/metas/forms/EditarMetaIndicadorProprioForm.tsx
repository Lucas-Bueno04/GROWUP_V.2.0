
import React, { useState } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';

interface EditarMetaIndicadorProprioFormProps {
  meta: MetaIndicadorEmpresaCompleta;
  onClose: () => void;
  atualizarValorRealizado: (id: string, valor: number) => void;
  isUpdating: boolean;
}

export function EditarMetaIndicadorProprioForm({ 
  meta, 
  onClose, 
  atualizarValorRealizado, 
  isUpdating 
}: EditarMetaIndicadorProprioFormProps) {
  const [formData, setFormData] = useState({
    valor_realizado: meta.valor_realizado?.toString() || '0',
    descricao: meta.descricao || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    atualizarValorRealizado(meta.id, parseFloat(formData.valor_realizado));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Meta</Label>
            <p className="text-sm text-muted-foreground">{meta.valor_meta}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Período</Label>
            <p className="text-sm text-muted-foreground">
              {meta.mes}/{meta.ano}
            </p>
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

        <div className="space-y-2">
          <Label htmlFor="descricao">Observações</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Adicione observações sobre esta meta..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}
