
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface IndicadorDialogProps {
  indicador?: OrcamentoIndicador;
  onSave: () => void;
  onCancel?: () => void;
}

export function IndicadorDialog({ indicador, onSave, onCancel }: IndicadorDialogProps) {
  const [open, setOpen] = useState(!!indicador);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    formula: '',
    unidade: '%',
    melhor_quando: 'maior' as 'maior' | 'menor',
    ordem: 1,
  });

  useEffect(() => {
    if (indicador) {
      setFormData({
        codigo: indicador.codigo,
        nome: indicador.nome,
        descricao: indicador.descricao || '',
        formula: indicador.formula,
        unidade: indicador.unidade || '%',
        melhor_quando: (indicador.melhor_quando as 'maior' | 'menor') || 'maior',
        ordem: indicador.ordem,
      });
      setOpen(true);
    }
  }, [indicador]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        codigo: formData.codigo,
        nome: formData.nome,
        descricao: formData.descricao || null,
        formula: formData.formula,
        unidade: formData.unidade,
        melhor_quando: formData.melhor_quando,
        ordem: formData.ordem,
        updated_at: new Date().toISOString(),
      };

      if (indicador) {
        // Atualizar indicador existente
        const { error } = await supabase
          .from('orcamento_indicadores')
          .update(dataToSave)
          .eq('id', indicador.id);

        if (error) throw error;
        toast.success('Indicador atualizado com sucesso!');
      } else {
        // Criar novo indicador
        const { error } = await supabase
          .from('orcamento_indicadores')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Indicador criado com sucesso!');
      }

      setOpen(false);
      onSave();
      
      // Reset form for new indicators
      if (!indicador) {
        setFormData({
          codigo: '',
          nome: '',
          descricao: '',
          formula: '',
          unidade: '%',
          melhor_quando: 'maior',
          ordem: 1,
        });
      }
    } catch (error) {
      console.error('Erro ao salvar indicador:', error);
      toast.error('Erro ao salvar indicador');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!indicador && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Indicador
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {indicador ? 'Editar Indicador' : 'Novo Indicador DRE'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Ex: IND01"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ordem">Ordem *</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Margem Bruta"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição detalhada do indicador"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="formula">Fórmula *</Label>
            <Input
              id="formula"
              value={formData.formula}
              onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
              placeholder="Ex: (G5/G3)*100"
              required
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use códigos dos grupos (G1, G2, etc.) para referenciar valores
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={formData.unidade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">% (Percentual)</SelectItem>
                  <SelectItem value="R$">R$ (Reais)</SelectItem>
                  <SelectItem value="vezes">vezes (Múltiplo)</SelectItem>
                  <SelectItem value="dias">dias</SelectItem>
                  <SelectItem value="unidades">unidades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="melhor_quando">Melhor Quando</Label>
              <Select
                value={formData.melhor_quando}
                onValueChange={(value: 'maior' | 'menor') => 
                  setFormData(prev => ({ ...prev, melhor_quando: value }))}
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
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : (indicador ? 'Atualizar' : 'Criar')}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
