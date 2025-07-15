import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { ContaItem } from './ContaItem';

interface Account {
  id: number;
  cod: string;
  name: string;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  accounts: Account[];
}

interface GrupoCardProps {
  group: Group;
  onNewConta: (grupoId: number) => void;
  onEditGrupo: (group: Group) => void;
  onDeleteGrupo: (id: number) => void;
  onEditConta: (account: Account) => void;
  onDeleteConta: (id: number) => void;
}

export function GrupoCard({
  group,
  onNewConta,
  onEditGrupo,
  onDeleteGrupo,
  onEditConta,
  onDeleteConta
}: GrupoCardProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [editCod, setEditCod] = useState(group.cod);
  const [editName, setEditName] = useState(group.name);

  useEffect(() => {
    if (isEditing) {
      setEditCod(group.cod);
      setEditName(group.name);
    }
  }, [isEditing, group.cod, group.name]);

  const getGrupoColorClass = (codigo: string) => {
    const num = parseInt(codigo);
    if (num === 1) return 'border-l-4 border-l-blue-500 bg-blue-50/50';
    if (num === 2) return 'border-l-4 border-l-red-500 bg-red-50/50';
    if (num === 3) return 'border-l-4 border-l-green-500 bg-green-50/50';
    if (num === 4) return 'border-l-4 border-l-orange-500 bg-orange-50/50';
    if (num === 5) return 'border-l-4 border-l-purple-500 bg-purple-50/50';
    if (num === 6) return 'border-l-4 border-l-yellow-500 bg-yellow-50/50';
    if (num === 7) return 'border-l-4 border-l-teal-500 bg-teal-50/50';
    if (num === 8) return 'border-l-4 border-l-pink-500 bg-pink-50/50';
    if (num === 9) return 'border-l-4 border-l-indigo-500 bg-indigo-50/50';
    if (num === 10) return 'border-l-4 border-l-gray-500 bg-gray-50/50';
    if (num === 11) return 'border-l-4 border-l-emerald-500 bg-emerald-50/50';
    return 'border-l-4 border-l-gray-300 bg-gray-50/50';
  };

  const colorClass = getGrupoColorClass(group.cod);

  return (
    <div className={`border rounded-lg ${colorClass}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold">{group.cod}</span>
                <span className="font-semibold text-sm">{group.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {group.accounts.length} conta{group.accounts.length !== 1 ? 's' : ''}
            </Badge>

            <Button variant="outline" size="sm" onClick={() => onNewConta(group.id)}>
              <Plus className="h-4 w-4" />
            </Button>

            {/* Botão de editar grupo */}
            <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-black dark:text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Editar Grupo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Altere o código ou nome do grupo e clique em "Salvar" para confirmar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cod" className="text-sm font-semibold">Código</label>
                    <input
                      id="cod"
                      type="text"
                      value={editCod}
                      onChange={(e) => setEditCod(e.target.value)}
                      className="border rounded px-3 py-2 text-sm text-black "
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold">Nome</label>
                    <input
                      id="name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-3 py-2 text-sm text-black "
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsEditing(false)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onEditGrupo({ ...group, cod: editCod, name: editName });
                      setIsEditing(false);
                    }}
                  >
                    Salvar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Botão de deletar grupo */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-black dark:text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o grupo "{group.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteGrupo(group.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {group.accounts.length > 0 && (
          <div className="space-y-2">
            {group.accounts.map((account) => (
              <ContaItem
                key={account.id}
                account={account}
                onEdit={onEditConta}
                onDelete={onDeleteConta}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
