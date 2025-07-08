
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { TipoCalculo } from '@/types/plano-contas.types';

interface GrupoFormData {
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo: TipoCalculo;
  formula: string;
  editavel_aluno: boolean;
}

export function useGrupoOperations(onDataChange: () => void) {
  const [loading, setLoading] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<OrcamentoGrupo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<GrupoFormData>({
    codigo: '',
    nome: '',
    ordem: 1,
    tipo_calculo: 'soma' as TipoCalculo,
    formula: '',
    editavel_aluno: false,
  });

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      ordem: 1,
      tipo_calculo: 'soma' as TipoCalculo,
      formula: '',
      editavel_aluno: false,
    });
    setEditingGrupo(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (editingGrupo) {
        // Update existing grupo
        const { error } = await supabase
          .from('orcamento_grupos')
          .update({
            codigo: formData.codigo,
            nome: formData.nome,
            ordem: formData.ordem,
            tipo_calculo: formData.tipo_calculo,
            formula: formData.formula,
            editavel_aluno: formData.editavel_aluno,
          })
          .eq('id', editingGrupo.id);

        if (error) throw error;

        toast({
          title: "Grupo atualizado",
          description: "Grupo atualizado com sucesso.",
        });
      } else {
        // Create new grupo
        const { error } = await supabase
          .from('orcamento_grupos')
          .insert({
            codigo: formData.codigo,
            nome: formData.nome,
            ordem: formData.ordem,
            tipo_calculo: formData.tipo_calculo,
            formula: formData.formula,
            editavel_aluno: formData.editavel_aluno,
            template_id: '', // You'll need to handle template_id properly
          });

        if (error) throw error;

        toast({
          title: "Grupo criado",
          description: "Grupo criado com sucesso.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      onDataChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (grupo: OrcamentoGrupo) => {
    setEditingGrupo(grupo);
    setFormData({
      codigo: grupo.codigo,
      nome: grupo.nome,
      ordem: grupo.ordem,
      tipo_calculo: grupo.tipo_calculo,
      formula: grupo.formula || '',
      editavel_aluno: grupo.editavel_aluno,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('orcamento_grupos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Grupo removido",
        description: "Grupo removido com sucesso.",
      });

      onDataChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewGrupo = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return {
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
  };
}
