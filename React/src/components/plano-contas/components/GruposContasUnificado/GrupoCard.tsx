
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Calculator } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { ContaItem } from './ContaItem';

interface GrupoCardProps {
  grupo: OrcamentoGrupo;
  contas: OrcamentoConta[];
  onNewConta: (grupoId: string) => void;
  onEditGrupo: (grupo: OrcamentoGrupo) => void;
  onDeleteGrupo: (id: string) => void;
  onEditConta: (conta: OrcamentoConta) => void;
  onDeleteConta: (id: string) => void;
}

export function GrupoCard({
  grupo,
  contas,
  onNewConta,
  onEditGrupo,
  onDeleteGrupo,
  onEditConta,
  onDeleteConta
}: GrupoCardProps) {
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

  const colorClass = getGrupoColorClass(grupo.codigo);

  return (
    <div className={`border rounded-lg ${colorClass}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold">
                  {grupo.codigo}
                </span>
                <span className="font-semibold text-sm">
                  {grupo.nome}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {grupo.tipo_calculo === 'calculado' && <Calculator className="h-3 w-3 mr-1" />}
                  {grupo.tipo_calculo}
                </Badge>
                
                {grupo.formula && (
                  <Badge variant="secondary" className="text-xs font-mono">
                    {grupo.formula}
                  </Badge>
                )}
                
                {grupo.editavel_aluno ? (
                  <Badge variant="default" className="text-xs">Editável</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Fixo</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {contas.length} conta{contas.length !== 1 ? 's' : ''}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNewConta(grupo.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditGrupo(grupo)}
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
                    Tem certeza que deseja excluir o grupo "{grupo.nome}"?
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteGrupo(grupo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {contas.length > 0 && (
          <div className="space-y-2">
            {contas
              .sort((a, b) => a.ordem - b.ordem)
              .map((conta) => (
                <ContaItem
                  key={conta.id}
                  conta={conta}
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
