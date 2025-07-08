
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { EditarMetaIndicadorProprioForm } from './forms/EditarMetaIndicadorProprioForm';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';

interface EditarMetaIndicadorProprioDialogProps {
  meta: MetaIndicadorEmpresaCompleta;
  trigger?: React.ReactNode;
}

export function EditarMetaIndicadorProprioDialog({ meta, trigger }: EditarMetaIndicadorProprioDialogProps) {
  const [open, setOpen] = useState(false);
  const { atualizarValorRealizado, isUpdating } = useMetasIndicadoresEmpresa();

  const handleAtualizarValorRealizado = (id: string, valor: number) => {
    atualizarValorRealizado({
      id,
      valor_realizado: valor
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Editar Meta: {meta.indicador_empresa?.nome}
          </DialogTitle>
        </DialogHeader>
        
        <EditarMetaIndicadorProprioForm 
          meta={meta} 
          onClose={() => setOpen(false)}
          atualizarValorRealizado={handleAtualizarValorRealizado}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
