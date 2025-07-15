import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Account {
  id: number;
  cod: string;
  name: string;
}

interface ContaItemProps {
  account: Account;
  onEdit: (conta: Account) => void;
  onDelete: (id: number) => void;
}

export function ContaItem({ account, onEdit, onDelete }: ContaItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCod, setEditCod] = useState(account.cod);
  const [editName, setEditName] = useState(account.name);

  return (
    <div className="flex items-center justify-between p-3 bg-background/80 rounded border border-muted ml-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground w-16">
          {account.cod}
        </span>
        <span className="text-sm">{account.name}</span>
      </div>

      <div className="flex gap-2">
        {/* Botão de editar com formulário */}
        <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditCod(account.cod);
                setEditName(account.name);
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Conta</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="cod" className="text-sm font-semibold">Código</label>
                <input
                  id="cod"
                  type="text"
                  value={editCod}
                  onChange={(e) => setEditCod(e.target.value)}
                  className="border rounded px-3 py-2 text-sm text-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-3 py-2 text-sm text-black"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsEditing(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onEdit({ ...account, cod: editCod, name: editName });
                  setIsEditing(false);
                }}
              >
                Salvar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Botão de deletar */}
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
                Tem certeza que deseja excluir a conta "{account.name}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(account.id)}
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
