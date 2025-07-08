
import React, { useState } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { GroupedMeta } from '../utils/metasGroupingUtils';
import { useToast } from '@/hooks/use-toast';

interface EditarMetaAgrupadaFormProps {
  metaAgrupada: GroupedMeta;
  onClose: () => void;
}

export function EditarMetaAgrupadaForm({ metaAgrupada, onClose }: EditarMetaAgrupadaFormProps) {
  const { atualizarMeta, isUpdating } = useMetasIndicadores();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    valor_meta: metaAgrupada.valor_meta.toString(),
    descricao: metaAgrupada.descricao || '',
    vinculado_orcamento: false, // Para simplificar, não permitimos mudança de vinculação em lote
    aplicar_todos: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updates = {
        valor_meta: parseFloat(formData.valor_meta),
        descricao: formData.descricao || undefined
      };

      if (formData.aplicar_todos) {
        // Atualizar todas as metas do grupo
        const promises = metaAgrupada.ids.map(id =>
          atualizarMeta({
            id,
            ...updates
          })
        );

        await Promise.allSettled(promises);

        toast({
          title: "Metas atualizadas",
          description: `${metaAgrupada.count} metas foram atualizadas com sucesso.`
        });
      } else {
        // Atualizar apenas a primeira meta (para casos especiais)
        await atualizarMeta({
          id: metaAgrupada.id,
          ...updates
        });

        toast({
          title: "Meta atualizada",
          description: "Meta principal do grupo atualizada com sucesso."
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar metas:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar as metas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getUnidadeLabel = () => {
    return metaAgrupada.indicador.unidade || 'un';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Indicador */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informações do Indicador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Código</Label>
              <p className="text-sm text-muted-foreground">{metaAgrupada.indicador.codigo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Unidade</Label>
              <p className="text-sm text-muted-foreground">{getUnidadeLabel()}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Período</Label>
            <p className="text-sm text-muted-foreground">{metaAgrupada.periodo_formatado}</p>
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
        </CardContent>
      </Card>

      <Separator />

      {/* Campos de Edição */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="valor_meta">
            Valor da Meta ({getUnidadeLabel()})
          </Label>
          <Input
            id="valor_meta"
            type="number"
            step="0.01"
            value={formData.valor_meta}
            onChange={(e) => setFormData(prev => ({ ...prev, valor_meta: e.target.value }))}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-muted-foreground">
            Este valor será aplicado a todas as {metaAgrupada.count} metas do grupo
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Adicione uma descrição para as metas..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="aplicar_todos"
            checked={formData.aplicar_todos}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aplicar_todos: checked }))}
          />
          <Label htmlFor="aplicar_todos" className="text-sm">
            Aplicar alterações a todas as {metaAgrupada.count} metas do grupo
          </Label>
        </div>

        {!formData.aplicar_todos && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Apenas a meta principal será atualizada. As outras metas do grupo permanecerão inalteradas.
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isUpdating || !formData.valor_meta}
        >
          {isUpdating ? 'Salvando...' : `Salvar ${formData.aplicar_todos ? `${metaAgrupada.count} Metas` : 'Meta Principal'}`}
        </Button>
      </DialogFooter>
    </form>
  );
}
