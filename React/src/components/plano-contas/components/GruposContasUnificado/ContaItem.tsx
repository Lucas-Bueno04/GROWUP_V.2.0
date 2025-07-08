
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { OrcamentoConta } from '@/types/orcamento.types';

interface ContaItemProps {
  conta: OrcamentoConta;
  onEdit: (conta: OrcamentoConta) => void;
  onDelete: (id: string) => void;
}

export function ContaItem({ conta, onEdit, onDelete }: ContaItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background/80 rounded border border-muted ml-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground w-16">
          {conta.codigo}
        </span>
        <span className="text-sm">{conta.nome}</span>
        <Badge 
          variant={conta.sinal === '+' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {conta.sinal}
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(conta)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a conta "{conta.nome}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(conta.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
