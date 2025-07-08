
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, HelpCircle } from 'lucide-react';
import type { ParametrosIA } from './types';

interface IATabProps {
  parametrosIA: ParametrosIA;
  setParametrosIA: React.Dispatch<React.SetStateAction<ParametrosIA>>;
}

export function IATab({ parametrosIA, setParametrosIA }: IATabProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Parâmetros de IA
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure como a inteligência artificial gera insights<br />e recomendações para o dashboard</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Label htmlFor="insights-auto">Gerar Insights Automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar geração automática de insights e recomendações
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quando ativado, o sistema gerará automaticamente<br />insights baseados nos dados das empresas</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="insights-auto"
              checked={parametrosIA.gerarInsightsAutomatico}
              onCheckedChange={(checked) => 
                setParametrosIA(prev => ({ ...prev, gerarInsightsAutomatico: checked }))
              }
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="confianca-minima">Confiança Mínima (%)</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Apenas insights com confiança igual ou superior<br />a este valor serão exibidos no dashboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="confianca-minima"
              type="number"
              min="0"
              max="100"
              value={parametrosIA.confiancaMinima}
              onChange={(e) => 
                setParametrosIA(prev => ({ 
                  ...prev, 
                  confiancaMinima: Number(e.target.value)
                }))
              }
            />
            <p className="text-sm text-muted-foreground mt-1">
              Insights com confiança abaixo deste valor serão filtrados
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
