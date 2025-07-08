
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { useIndicadorOperations } from '../hooks/useIndicadorOperations';

interface EditIndicadorDialogProps {
  indicador: OrcamentoIndicador;
  trigger: React.ReactNode;
  onSave: () => void;
}

export function EditIndicadorDialog({ indicador, trigger, onSave }: EditIndicadorDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateIndicador, loading } = useIndicadorOperations();
  
  const [formData, setFormData] = useState({
    codigo: indicador.codigo,
    nome: indicador.nome,
    descricao: indicador.descricao || '',
    formula: indicador.formula,
    unidade: indicador.unidade || '%',
    melhor_quando: indicador.melhor_quando || 'maior',
    ordem: indicador.ordem.toString()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await updateIndicador(indicador.id, {
      codigo: formData.codigo,
      nome: formData.nome,
      descricao: formData.descricao,
      formula: formData.formula,
      unidade: formData.unidade,
      melhor_quando: formData.melhor_quando,
      ordem: parseInt(formData.ordem)
    });

    if (success) {
      setOpen(false);
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Indicador</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              placeholder="Ex: IND001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do indicador"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição do indicador"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formula">Fórmula</Label>
            <Input
              id="formula"
              value={formData.formula}
              onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
              placeholder="Ex: (CONTA_5_4/G3)*100"
              required
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Use CONTA_X_Y para contas com ponto (ex: CONTA_5_4 para conta 5.4)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Input
                id="unidade"
                value={formData.unidade}
                onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
                placeholder="Ex: %, R$, un"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: e.target.value }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="melhor_quando">Melhor Quando</Label>
            <Select 
              value={formData.melhor_quando} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                melhor_quando: value as "maior" | "menor" 
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maior">Maior</SelectItem>
                <SelectItem value="menor">Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
