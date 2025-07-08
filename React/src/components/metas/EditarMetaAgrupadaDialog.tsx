
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { GroupedMeta } from './utils/metasGroupingUtils';
import { EditarMetaAgrupadaForm } from './forms/EditarMetaAgrupadaForm';

interface EditarMetaAgrupadaDialogProps {
  metaAgrupada: GroupedMeta;
  trigger?: React.ReactNode;
}

export function EditarMetaAgrupadaDialog({ metaAgrupada, trigger }: EditarMetaAgrupadaDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Editar Metas Agrupadas: {metaAgrupada.indicador.nome}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Editando {metaAgrupada.count} metas para os meses: {metaAgrupada.periodo_formatado}
          </p>
        </DialogHeader>
        
        <EditarMetaAgrupadaForm 
          metaAgrupada={metaAgrupada} 
          onClose={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
