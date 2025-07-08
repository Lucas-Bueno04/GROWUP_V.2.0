
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IndicadorProprioForm } from './forms/IndicadorProprioForm';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';

interface IndicadorProprioDialogProps {
  trigger: React.ReactNode;
  empresaId?: string | null;
}

export function IndicadorProprioDialog({ trigger, empresaId }: IndicadorProprioDialogProps) {
  const [open, setOpen] = useState(false);
  const { indicadoresProprios } = useIndicadoresProprios(empresaId);

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
          <DialogTitle>Novo Indicador Próprio</DialogTitle>
        </DialogHeader>
        
        <IndicadorProprioForm
          empresaId={empresaId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
