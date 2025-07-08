
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GrupoForm } from './GrupoForm';
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { TipoCalculo } from '@/types/plano-contas.types';

interface GrupoFormData {
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo: TipoCalculo;
  formula: string;
  editavel_aluno: boolean;
}

interface GrupoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingGrupo: OrcamentoGrupo | null;
  formData: GrupoFormData;
  onFormDataChange: (data: GrupoFormData) => void;
  onSave: () => void;
  loading: boolean;
}

export function GrupoDialog({
  isOpen,
  onOpenChange,
  editingGrupo,
  formData,
  onFormDataChange,
  onSave,
  loading
}: GrupoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingGrupo ? 'Editar Grupo' : 'Novo Grupo'}
          </DialogTitle>
          <DialogDescription>
            Configure as informações do grupo do plano de contas.
          </DialogDescription>
        </DialogHeader>
        
        <GrupoForm formData={formData} onFormDataChange={onFormDataChange} />
        
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
