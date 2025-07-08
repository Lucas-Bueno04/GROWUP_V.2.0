
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CriarOrcamentoForm } from './CriarOrcamentoForm';

interface CriarOrcamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CriarOrcamentoDialog({ open, onOpenChange, onSuccess }: CriarOrcamentoDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Orçamento</DialogTitle>
          <DialogDescription>
            Configure um novo orçamento para uma empresa. Defina permissões e prazos de edição.
          </DialogDescription>
        </DialogHeader>
        <CriarOrcamentoForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
