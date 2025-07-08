import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { TipoCalculo, TipoSinal } from '@/types/plano-contas.types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FormDialog } from './FormDialog';
import { GrupoCard } from './GrupoCard';

interface GruposContasUnificadoProps {
  grupos: OrcamentoGrupo[];
  onDataChange: () => void;
}

type EntityType = 'grupo' | 'conta';

interface FormData {
  type: EntityType;
  grupoId?: string;
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo?: TipoCalculo;
  formula?: string;
  editavel_aluno: boolean;
  grupo_id?: string;
  sinal?: TipoSinal;
}

export function GruposContasUnificado({ grupos, onDataChange }: GruposContasUnificadoProps) {
  const [loading, setLoading] = useState(false);
  const [contas, setContas] = useState<OrcamentoConta[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<{ type: EntityType; data: OrcamentoGrupo | OrcamentoConta } | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    type: 'grupo',
    codigo: '',
    nome: '',
    ordem: 1,
    tipo_calculo: 'soma' as TipoCalculo,
    formula: '',
    editavel_aluno: false,
    sinal: '+' as TipoSinal,
  });

  useEffect(() => {
    fetchContas();
  }, []);

  const fetchContas = async () => {
    try {
      const { data, error } = await supabase
        .from('orcamento_contas')
        .select('*')
        .order('ordem');

      if (error) throw error;
      setContas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar contas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getContasByGrupo = (grupoId: string) => {
    return contas.filter(conta => conta.grupo_id === grupoId);
  };

  const resetForm = () => {
    setFormData({
      type: 'grupo',
      codigo: '',
      nome: '',
      ordem: 1,
      tipo_calculo: 'soma' as TipoCalculo,
      formula: '',
      editavel_aluno: false,
      sinal: '+' as TipoSinal,
    });
    setEditingEntity(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (formData.type === 'grupo') {
        if (editingEntity && editingEntity.type === 'grupo') {
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
            .eq('id', (editingEntity.data as OrcamentoGrupo).id);

          if (error) throw error;

          toast({
            title: "Grupo atualizado",
            description: "Grupo atualizado com sucesso.",
          });
        } else {
          const { error } = await supabase
            .from('orcamento_grupos')
            .insert({
              codigo: formData.codigo,
              nome: formData.nome,
              ordem: formData.ordem,
              tipo_calculo: formData.tipo_calculo,
              formula: formData.formula,
              editavel_aluno: formData.editavel_aluno,
            });

          if (error) throw error;

          toast({
            title: "Grupo criado",
            description: "Grupo criado com sucesso.",
          });
        }
      } else {
        if (editingEntity && editingEntity.type === 'conta') {
          const { error } = await supabase
            .from('orcamento_contas')
            .update({
              codigo: formData.codigo,
              nome: formData.nome,
              grupo_id: formData.grupo_id,
              ordem: formData.ordem,
              sinal: formData.sinal,
              editavel_aluno: formData.editavel_aluno,
            })
            .eq('id', (editingEntity.data as OrcamentoConta).id);

          if (error) throw error;

          toast({
            title: "Conta atualizada",
            description: "Conta atualizada com sucesso.",
          });
        } else {
          const { error } = await supabase
            .from('orcamento_contas')
            .insert({
              codigo: formData.codigo,
              nome: formData.nome,
              grupo_id: formData.grupo_id,
              ordem: formData.ordem,
              sinal: formData.sinal,
              editavel_aluno: formData.editavel_aluno,
            });

          if (error) throw error;

          toast({
            title: "Conta criada",
            description: "Conta criada com sucesso.",
          });
        }
      }

      resetForm();
      setIsDialogOpen(false);
      fetchContas();
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

  const handleEditGrupo = (grupo: OrcamentoGrupo) => {
    setEditingEntity({ type: 'grupo', data: grupo });
    setFormData({
      type: 'grupo',
      codigo: grupo.codigo,
      nome: grupo.nome,
      ordem: grupo.ordem,
      tipo_calculo: grupo.tipo_calculo,
      formula: grupo.formula || '',
      editavel_aluno: grupo.editavel_aluno,
      sinal: '+' as TipoSinal,
    });
    setIsDialogOpen(true);
  };

  const handleEditConta = (conta: OrcamentoConta) => {
    setEditingEntity({ type: 'conta', data: conta });
    setFormData({
      type: 'conta',
      codigo: conta.codigo,
      nome: conta.nome,
      grupo_id: conta.grupo_id,
      ordem: conta.ordem,
      sinal: conta.sinal,
      editavel_aluno: conta.editavel_aluno,
      tipo_calculo: 'soma' as TipoCalculo,
      formula: '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGrupo = async (id: string) => {
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

  const handleDeleteConta = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('orcamento_contas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Conta removida",
        description: "Conta removida com sucesso.",
      });

      fetchContas();
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

  const handleNewConta = (grupoId: string) => {
    setEditingEntity(null);
    setFormData({
      type: 'conta',
      codigo: '',
      nome: '',
      grupo_id: grupoId,
      ordem: 1,
      sinal: '+' as TipoSinal,
      editavel_aluno: true,
      tipo_calculo: 'soma' as TipoCalculo,
      formula: '',
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciamento da Estrutura DRE
            </CardTitle>
            <CardDescription>
              Configure grupos e contas da estrutura DRE para escritórios contábeis.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Grupo
                </Button>
              </DialogTrigger>
              <FormDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingEntity={editingEntity}
                formData={formData}
                setFormData={setFormData}
                grupos={grupos}
                loading={loading}
                onSave={handleSave}
              />
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {grupos
            .sort((a, b) => a.ordem - b.ordem)
            .map((grupo) => {
              const grupoContas = getContasByGrupo(grupo.id);
              
              return (
                <GrupoCard
                  key={grupo.id}
                  grupo={grupo}
                  contas={grupoContas}
                  onNewConta={handleNewConta}
                  onEditGrupo={handleEditGrupo}
                  onDeleteGrupo={handleDeleteGrupo}
                  onEditConta={handleEditConta}
                  onDeleteConta={handleDeleteConta}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
