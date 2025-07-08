
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMetaIndicadorProprioForm } from '@/hooks/metas/useMetaIndicadorProprioForm';
import { MetaIndicadorProprioFormFields } from './MetaIndicadorProprioFormFields';

interface MetaIndicadorProprioFormProps {
  empresaId: string;
  indicadorId?: string;
  onSuccess: () => void;
  onCancel: () => void;
  criarMeta: (meta: any) => void;
  isCreating: boolean;
}

export function MetaIndicadorProprioForm({ 
  empresaId, 
  indicadorId, 
  onSuccess, 
  onCancel, 
  criarMeta, 
  isCreating 
}: MetaIndicadorProprioFormProps) {
  const {
    formData,
    setFormData,
    replicarTodosMeses,
    setReplicarTodosMeses,
    isProcessing,
    handleSubmit,
    user
  } = useMetaIndicadorProprioForm({
    empresaId,
    indicadorId,
    onSuccess,
    criarMeta
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <MetaIndicadorProprioFormFields
        formData={formData}
        setFormData={setFormData}
        replicarTodosMeses={replicarTodosMeses}
        setReplicarTodosMeses={setReplicarTodosMeses}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isCreating || isProcessing || (!formData.vinculado_orcamento && !formData.valor_meta) || !user?.id}
        >
          {isCreating || isProcessing ? 'Criando...' : 'Criar Meta'}
        </Button>
      </DialogFooter>
    </form>
  );
}
