
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { GroupedMetaEmpresa } from './utils/metasGroupingUtils';
import { EditarMetaPropriaAgrupadaForm } from './forms/EditarMetaPropriaAgrupadaForm';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';

interface EditarMetaPropriaAgrupadaDialogProps {
  metaAgrupada: GroupedMetaEmpresa;
  trigger?: React.ReactNode;
}

export function EditarMetaPropriaAgrupadaDialog({ metaAgrupada, trigger }: EditarMetaPropriaAgrupadaDialogProps) {
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
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Editar Metas Agrupadas: {metaAgrupada.indicador_empresa?.nome}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Editando {metaAgrupada.count} metas para os meses: {metaAgrupada.periodo_formatado}
          </p>
        </DialogHeader>
        
        <EditarMetaPropriaAgrupadaForm 
          metaAgrupada={metaAgrupada} 
          onClose={() => setOpen(false)}
          atualizarValorRealizado={handleAtualizarValorRealizado}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
