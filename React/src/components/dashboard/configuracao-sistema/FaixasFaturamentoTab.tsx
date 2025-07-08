
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign, Plus, Trash2, HelpCircle, Loader2, Image } from 'lucide-react';

interface FaixaFaturamento {
  id: string;
  nome: string;
  valorMinimo: number;
  valorMaximo: number;
  ativa: boolean;
  imagem_url: string | null;
}

interface FaixasFaturamentoTabProps {
  faixasFaturamento: FaixaFaturamento[];
  isLoadingFaixas?: boolean;
  onAdicionarFaixa: () => void;
  onRemoverFaixa: (id: string) => void;
  onAtualizarFaixa: (id: string, campo: keyof FaixaFaturamento, valor: any) => void;
}

export function FaixasFaturamentoTab({
  faixasFaturamento,
  isLoadingFaixas,
  onAdicionarFaixa,
  onRemoverFaixa,
  onAtualizarFaixa
}: FaixasFaturamentoTabProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (isLoadingFaixas) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando faixas de faturamento...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Faixas de Faturamento
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure as faixas de faturamento para agrupar empresas<br />similares e gerar comparativos mais precisos</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure as faixas para agrupamento de empresas por faturamento
              </p>
            </div>
            <Button onClick={onAdicionarFaixa} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Faixa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faixasFaturamento.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma faixa de faturamento configurada.</p>
                <p className="text-sm">Clique em "Nova Faixa" para começar.</p>
              </div>
            ) : (
              faixasFaturamento.map((faixa) => (
                <div key={faixa.id} className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg">
                  <div className="col-span-2">
                    <Label htmlFor={`nome-${faixa.id}`}>Nome</Label>
                    <Input
                      id={`nome-${faixa.id}`}
                      value={faixa.nome}
                      onChange={(e) => onAtualizarFaixa(faixa.id, 'nome', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`min-${faixa.id}`}>Valor Mínimo</Label>
                    <Input
                      id={`min-${faixa.id}`}
                      type="number"
                      value={faixa.valorMinimo}
                      onChange={(e) => onAtualizarFaixa(faixa.id, 'valorMinimo', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`max-${faixa.id}`}>Valor Máximo</Label>
                    <Input
                      id={`max-${faixa.id}`}
                      type="number"
                      value={faixa.valorMaximo}
                      onChange={(e) => onAtualizarFaixa(faixa.id, 'valorMaximo', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`imagem-${faixa.id}`} className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      URL da Imagem
                    </Label>
                    <Input
                      id={`imagem-${faixa.id}`}
                      type="url"
                      value={faixa.imagem_url || ''}
                      placeholder="https://exemplo.com/imagem.png"
                      onChange={(e) => onAtualizarFaixa(faixa.id, 'imagem_url', e.target.value || null)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        checked={faixa.ativa}
                        onCheckedChange={(checked) => onAtualizarFaixa(faixa.id, 'ativa', checked)}
                      />
                      <Badge variant={faixa.ativa ? 'default' : 'secondary'}>
                        {faixa.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <div className="text-sm text-muted-foreground text-right">
                      <p>{formatCurrency(faixa.valorMinimo)}</p>
                      <p>até {formatCurrency(faixa.valorMaximo)}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoverFaixa(faixa.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remover esta faixa de faturamento</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
