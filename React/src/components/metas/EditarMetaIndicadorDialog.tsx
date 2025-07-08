
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { MetaIndicadorCompleta } from '@/types/metas.types';
import { EditarMetaIndicadorForm } from './forms/EditarMetaIndicadorForm';

interface EditarMetaIndicadorDialogProps {
  meta: MetaIndicadorCompleta;
  trigger?: React.ReactNode;
}

export function EditarMetaIndicadorDialog({ meta, trigger }: EditarMetaIndicadorDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Editar Meta: {meta.indicador.nome}
          </DialogTitle>
        </DialogHeader>
        
        <EditarMetaIndicadorForm 
          meta={meta} 
          onClose={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
