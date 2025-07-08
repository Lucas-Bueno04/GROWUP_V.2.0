
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IndicadorEmpresa } from '@/types/metas.types';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';

interface DeleteIndicadorProprioDialogProps {
  indicador: IndicadorEmpresa;
  trigger: React.ReactNode;
}

export function DeleteIndicadorProprioDialog({ indicador, trigger }: DeleteIndicadorProprioDialogProps) {
  const { excluirIndicador, isDeleting } = useIndicadoresProprios();

  const handleDelete = () => {
    excluirIndicador(indicador.id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Indicador</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o indicador "{indicador.nome}"?
            <br />
            <br />
            <strong>Esta ação não pode ser desfeita.</strong> Todas as metas associadas a este indicador também serão afetadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
