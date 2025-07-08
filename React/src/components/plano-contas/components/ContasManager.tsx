
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { TipoSinal } from '@/types/plano-contas.types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface ContasManagerProps {
  grupos: OrcamentoGrupo[];
  onDataChange: () => void;
}

export function ContasManager({ grupos, onDataChange }: ContasManagerProps) {
  const [loading, setLoading] = useState(false);
  const [contas, setContas] = useState<OrcamentoConta[]>([]);
  const [editingConta, setEditingConta] = useState<OrcamentoConta | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    grupo_id: '',
    ordem: 1,
    sinal: '+' as TipoSinal,
    editavel_aluno: true,
  });

  React.useEffect(() => {
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

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      grupo_id: '',
      ordem: 1,
      sinal: '+' as TipoSinal,
      editavel_aluno: true,
    });
    setEditingConta(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (editingConta) {
        // Update existing conta
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
          .eq('id', editingConta.id);

        if (error) throw error;

        toast({
          title: "Conta atualizada",
          description: "Conta atualizada com sucesso.",
        });
      } else {
        // Create new conta
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

  const handleEdit = (conta: OrcamentoConta) => {
    setEditingConta(conta);
    setFormData({
      codigo: conta.codigo,
      nome: conta.nome,
      grupo_id: conta.grupo_id,
      ordem: conta.ordem,
      sinal: conta.sinal,
      editavel_aluno: conta.editavel_aluno,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
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

  const getGrupoNome = (grupoId: string) => {
    const grupo = grupos.find(g => g.id === grupoId);
    return grupo ? grupo.nome : 'Grupo não encontrado';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Contas do Plano de Contas</CardTitle>
            <CardDescription>
              Gerencie as contas que compõem cada grupo do plano de contas.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingConta ? 'Editar Conta' : 'Nova Conta'}
                </DialogTitle>
                <DialogDescription>
                  Configure as informações da conta do plano de contas.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                      placeholder="Ex: 01.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ordem">Ordem</Label>
                    <Input
                      id="ordem"
                      type="number"
                      value={formData.ordem}
                      onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Vendas de Produtos"
                  />
                </div>
                
                <div>
                  <Label htmlFor="grupo_id">Grupo</Label>
                  <Select
                    value={formData.grupo_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, grupo_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id}>
                          {grupo.codigo} - {grupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sinal">Sinal</Label>
                  <Select
                    value={formData.sinal}
                    onValueChange={(value: TipoSinal) => setFormData(prev => ({ ...prev, sinal: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sinal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+ (Positivo)</SelectItem>
                      <SelectItem value="-">- (Negativo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editavel_aluno"
                    checked={formData.editavel_aluno}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, editavel_aluno: checked }))}
                  />
                  <Label htmlFor="editavel_aluno">Editável pelo aluno</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Sinal</TableHead>
              <TableHead>Editável</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contas.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell className="font-mono">{conta.codigo}</TableCell>
                <TableCell>{conta.nome}</TableCell>
                <TableCell>{getGrupoNome(conta.grupo_id)}</TableCell>
                <TableCell>
                  <Badge variant={conta.sinal === '+' ? 'default' : 'destructive'}>
                    {conta.sinal}
                  </Badge>
                </TableCell>
                <TableCell>
                  {conta.editavel_aluno ? (
                    <Badge variant="default">Sim</Badge>
                  ) : (
                    <Badge variant="secondary">Não</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(conta)}
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
                            onClick={() => handleDelete(conta.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
