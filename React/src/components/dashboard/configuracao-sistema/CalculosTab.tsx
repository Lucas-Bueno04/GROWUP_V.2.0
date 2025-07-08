
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, HelpCircle } from 'lucide-react';
import type { ConfigCalculos } from './types';

interface CalculosTabProps {
  configCalculos: ConfigCalculos;
  setConfigCalculos: React.Dispatch<React.SetStateAction<ConfigCalculos>>;
}

export function CalculosTab({ configCalculos, setConfigCalculos }: CalculosTabProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configurações de Cálculo
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure como os cálculos e médias são processados no sistema</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Label htmlFor="recalcular-auto">Recálculo Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Recalcular médias automaticamente quando novos dados são inseridos
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quando ativado, as médias dos indicadores serão recalculadas<br />automaticamente sempre que novos dados orçamentários forem inseridos</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="recalcular-auto"
              checked={configCalculos.recalcularAutomatico}
              onCheckedChange={(checked) => 
                setConfigCalculos(prev => ({ ...prev, recalcularAutomatico: checked }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="frequencia">Frequência de Cálculo</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define com que frequência as médias comparativas<br />entre empresas são recalculadas</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={configCalculos.frequenciaCalculoMedias}
                onValueChange={(value: 'mensal' | 'trimestral' | 'anual') => 
                  setConfigCalculos(prev => ({ 
                    ...prev, 
                    frequenciaCalculoMedias: value
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="minimo-empresas">Mínimo de Empresas por Grupo</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número mínimo de empresas necessárias para formar<br />um grupo de comparação válido</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="minimo-empresas"
                type="number"
                min="2"
                max="50"
                value={configCalculos.minimoEmpresasPorGrupo}
                onChange={(e) => 
                  setConfigCalculos(prev => ({ 
                    ...prev, 
                    minimoEmpresasPorGrupo: Number(e.target.value)
                  }))
                }
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="precisao">Precisão Decimal</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Número de casas decimais para exibição dos resultados<br />dos indicadores calculados</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="precisao"
              type="number"
              min="0"
              max="5"
              value={configCalculos.precisaoDecimal}
              onChange={(e) => 
                setConfigCalculos(prev => ({ 
                  ...prev, 
                  precisaoDecimal: Number(e.target.value)
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
