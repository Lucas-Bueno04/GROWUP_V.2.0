
import React, { useState } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { MetaIndicadorCompleta } from '@/types/metas.types';
import { useToast } from '@/hooks/use-toast';
import { EditarMetaIndicadorFormFields } from './EditarMetaIndicadorFormFields';

interface EditarMetaIndicadorFormProps {
  meta: MetaIndicadorCompleta;
  onClose: () => void;
}

export function EditarMetaIndicadorForm({ meta, onClose }: EditarMetaIndicadorFormProps) {
  const { atualizarMeta, criarMeta, isUpdating } = useMetasIndicadores();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo_meta: meta.tipo_meta,
    tipo_valor: meta.tipo_valor,
    ano: meta.ano,
    mes: meta.mes,
    valor_meta: meta.valor_meta.toString(),
    descricao: meta.descricao || '',
    vinculado_orcamento: meta.vinculado_orcamento || false,
    conta_orcamento_id: meta.conta_orcamento_id || '',
    tipo_item_orcamento: meta.tipo_item_orcamento || 'conta'
  });
  const [replicarTodosMeses, setReplicarTodosMeses] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vinculado_orcamento && !formData.valor_meta) return;

    try {
      // Atualizar a meta atual
      await atualizarMeta({
        id: meta.id,
        tipo_meta: formData.tipo_meta,
        tipo_valor: formData.tipo_valor,
        ano: formData.ano,
        mes: formData.mes,
        valor_meta: parseFloat(formData.valor_meta),
        descricao: formData.descricao || undefined,
        vinculado_orcamento: formData.vinculado_orcamento,
        conta_orcamento_id: formData.vinculado_orcamento ? formData.conta_orcamento_id : undefined,
        tipo_item_orcamento: formData.vinculado_orcamento ? formData.tipo_item_orcamento : undefined
      });

      // Se marcou para replicar e é meta anual, criar metas mensais
      if (replicarTodosMeses && formData.tipo_meta === 'anual') {
        const promises = [];
        
        for (let mes = 1; mes <= 12; mes++) {
          // Pular o mês atual se for o mesmo
          if (mes === formData.mes) continue;
          
          promises.push(
            criarMeta({
              usuario_id: meta.usuario_id,
              indicador_id: meta.indicador_id,
              empresa_id: meta.empresa_id,
              tipo_meta: 'mensal',
              tipo_valor: formData.tipo_valor,
              ano: formData.ano,
              mes,
              valor_meta: parseFloat(formData.valor_meta),
              descricao: formData.descricao || undefined,
              vinculado_orcamento: formData.vinculado_orcamento,
              conta_orcamento_id: formData.vinculado_orcamento ? formData.conta_orcamento_id : undefined,
              tipo_item_orcamento: formData.vinculado_orcamento ? formData.tipo_item_orcamento : undefined
            })
          );
        }

        await Promise.allSettled(promises);
        
        toast({
          title: "Meta replicada",
          description: `Meta atualizada e replicada para todos os meses de ${formData.ano}.`
        });
      } else {
        toast({
          title: "Meta atualizada",
          description: "Meta atualizada com sucesso."
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a meta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EditarMetaIndicadorFormFields
        formData={formData}
        setFormData={setFormData}
        replicarTodosMeses={replicarTodosMeses}
        setReplicarTodosMeses={setReplicarTodosMeses}
        indicadorUnidade={meta.indicador.unidade}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isUpdating || (!formData.vinculado_orcamento && !formData.valor_meta)}
        >
          {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogFooter>
    </form>
  );
}
