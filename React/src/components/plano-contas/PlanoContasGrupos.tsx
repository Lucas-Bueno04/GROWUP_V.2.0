
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { GrupoDialog } from './components/GrupoDialog';
import { GruposTable } from './components/GruposTable';
import { useGrupoOperations } from './hooks/useGrupoOperations';

interface PlanoContasGruposProps {
  grupos: OrcamentoGrupo[];
  onDataChange: () => void;
}

export function PlanoContasGrupos({ grupos, onDataChange }: PlanoContasGruposProps) {
  const {
    loading,
    editingGrupo,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    handleSave,
    handleEdit,
    handleDelete,
    handleNewGrupo,
  } = useGrupoOperations(onDataChange);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Grupos do Plano de Contas</CardTitle>
            <CardDescription>
              Gerencie os grupos que compõem o plano de contas DRE.
            </CardDescription>
          </div>
          <Button onClick={handleNewGrupo}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Grupo
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <GruposTable 
          grupos={grupos} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </CardContent>

      <GrupoDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingGrupo={editingGrupo}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSave}
        loading={loading}
      />
    </Card>
  );
}
