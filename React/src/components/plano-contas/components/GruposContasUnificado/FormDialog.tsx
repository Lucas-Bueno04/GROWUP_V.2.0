
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFields } from './FormFields';
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { TipoCalculo, TipoSinal } from '@/types/plano-contas.types';

type EntityType = 'grupo' | 'conta';


interface Account {
  id: number;
  cod: string;
  name: string;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  accounts: Account[];
  // ordem?: number; // Descomente se estiver usando 'ordem' para ordenação
}

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

interface FormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntity: { type: EntityType; data: any } | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  grupos: Group[];
  loading: boolean;
  onSave: () => void;
}

export function FormDialog({
  isOpen,
  onOpenChange,
  editingEntity,
  formData,
  setFormData,
  grupos,
  loading,
  onSave
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingEntity ? 
              (editingEntity.type === 'grupo' ? 'Editar Grupo' : 'Editar Conta') : 
              (formData.type === 'grupo' ? 'Novo Grupo' : 'Nova Conta')
            }
          </DialogTitle>
          <DialogDescription>
            Configure as informações do {formData.type === 'grupo' ? 'grupo' : 'conta'} do plano de contas.
          </DialogDescription>
        </DialogHeader>
        
        <FormFields
          formData={formData}
          setFormData={setFormData}
          editingEntity={editingEntity}
          grupos={grupos}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
