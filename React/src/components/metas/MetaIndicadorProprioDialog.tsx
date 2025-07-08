
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MetaIndicadorProprioForm } from './forms/MetaIndicadorProprioForm';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';

interface MetaIndicadorProprioDialogProps {
  trigger: React.ReactNode;
  empresaId?: string | null;
  indicadorId?: string;
}

export function MetaIndicadorProprioDialog({ trigger, empresaId, indicadorId }: MetaIndicadorProprioDialogProps) {
  const [open, setOpen] = useState(false);
  const { criarMeta, isCreating } = useMetasIndicadoresEmpresa(empresaId);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (!empresaId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Meta de Indicador Próprio</DialogTitle>
        </DialogHeader>
        
        <MetaIndicadorProprioForm
          empresaId={empresaId}
          indicadorId={indicadorId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          criarMeta={criarMeta}
          isCreating={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
}
