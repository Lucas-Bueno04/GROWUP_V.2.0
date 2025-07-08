
import React, { useState, useEffect } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { useIndicadorProprioValidation } from '@/hooks/useIndicadorProprioValidation';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface IndicadorProprioFormProps {
  empresaId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function IndicadorProprioForm({ empresaId, onSuccess, onCancel }: IndicadorProprioFormProps) {
  const { user } = useAuth();
  const { criarIndicador, isCreating } = useIndicadoresProprios(empresaId);
  const { validateIndicador, getNextAvailablePosition, suggestAlternativeCode } = useIndicadorProprioValidation(empresaId);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    formula: '',
    unidade: '%',
    melhor_quando: 'maior' as 'maior' | 'menor',
    ordem: '',
    tipo_visualizacao: 'card' as 'card' | 'chart' | 'list'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Definir posição inicial quando o componente carrega
  useEffect(() => {
    if (!formData.ordem) {
      const nextPosition = getNextAvailablePosition();
      setFormData(prev => ({ ...prev, ordem: nextPosition.toString() }));
    }
  }, [getNextAvailablePosition, formData.ordem]);

  // Validar em tempo real quando código ou ordem mudam
  useEffect(() => {
    if (formData.codigo && formData.ordem) {
      const validation = validateIndicador(formData.codigo, parseInt(formData.ordem));
      setValidationErrors(validation.errors);
      setShowSuggestions(validation.errors.length > 0);
    } else {
      setValidationErrors([]);
      setShowSuggestions(false);
    }
  }, [formData.codigo, formData.ordem, validateIndicador]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;

    // Validação final antes de enviar
    const validation = validateIndicador(formData.codigo, parseInt(formData.ordem));
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    criarIndicador({
      empresa_id: empresaId,
      usuario_id: user.id,
      codigo: formData.codigo,
      nome: formData.nome,
      descricao: formData.descricao,
      formula: formData.formula,
      unidade: formData.unidade,
      melhor_quando: formData.melhor_quando,
      ordem: parseInt(formData.ordem),
      tipo_visualizacao: formData.tipo_visualizacao,
      ativo: true
    });

    onSuccess();
  };

  const handleUseAlternativeCode = () => {
    const alternative = suggestAlternativeCode(formData.codigo);
    setFormData(prev => ({ ...prev, codigo: alternative }));
  };

  const handleUseAlternativePosition = () => {
    const nextPosition = getNextAvailablePosition();
    setFormData(prev => ({ ...prev, ordem: nextPosition.toString() }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
              {showSuggestions && (
                <div className="mt-3 space-y-2">
                  <p className="font-medium">Sugestões:</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseAlternativeCode}
                    >
                      Usar código: {suggestAlternativeCode(formData.codigo)}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseAlternativePosition}
                    >
                      Usar posição: {getNextAvailablePosition()}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="codigo">Código</Label>
        <Input
          id="codigo"
          value={formData.codigo}
          onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
          placeholder="Ex: IND001"
          required
          className={validationErrors.some(error => error.includes('código')) ? 'border-red-500' : ''}
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
          <Label htmlFor="ordem">Posição</Label>
          <Input
            id="ordem"
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData(prev => ({ ...prev, ordem: e.target.value }))}
            min="1"
            required
            className={validationErrors.some(error => error.includes('posição')) ? 'border-red-500' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="tipo_visualizacao">Tipo de Visualização</Label>
          <Select 
            value={formData.tipo_visualizacao} 
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              tipo_visualizacao: value as "card" | "chart" | "list" 
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="chart">Gráfico</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isCreating || validationErrors.length > 0}
        >
          {isCreating ? 'Criando...' : 'Criar Indicador'}
        </Button>
      </DialogFooter>
    </form>
  );
}
