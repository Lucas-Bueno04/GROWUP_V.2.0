
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TestTube, HelpCircle, Info } from 'lucide-react';

interface FormulasTabProps {
  formulaTeste: string;
  setFormulaTeste: (formula: string) => void;
  resultadoTeste: any;
  testando: boolean;
  onTestarFormula: () => void;
}

export function FormulasTab({
  formulaTeste,
  setFormulaTeste,
  resultadoTeste,
  testando,
  onTestarFormula
}: FormulasTabProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Teste de Fórmulas
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Teste fórmulas de indicadores com dados simulados<br />para validar se estão funcionando corretamente</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Teste fórmulas de indicadores com dados simulados
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Formato das Fórmulas</h4>
                <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• <strong>Grupos:</strong> Use G1, G2, G3... (ex: G1 + G2)</li>
                  <li>• <strong>Contas analíticas:</strong> Use CONTA_X_Y (ex: CONTA_5_4)</li>
                  <li>• <strong>Operadores:</strong> +, -, *, /, (), abs()</li>
                  <li>• <strong>Exemplo:</strong> (G1 - G2) / G1 * 100</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="formula-teste">Fórmula para Teste</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Digite uma fórmula usando o formato correto:<br />G(número) para grupos e CONTA_X_Y para contas analíticas</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="formula-teste"
              value={formulaTeste}
              onChange={(e) => setFormulaTeste(e.target.value)}
              placeholder="Ex: (G1 - G2) / G1 * 100 ou CONTA_3_1 / CONTA_4_1 * 100"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use G(número) para grupos e CONTA_X_Y para contas analíticas
            </p>
          </div>

          <Button onClick={onTestarFormula} disabled={testando} className="gap-2">
            <TestTube className="h-4 w-4" />
            {testando ? 'Testando...' : 'Testar Fórmula'}
          </Button>

          {resultadoTeste && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Resultado do Teste</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sucesso:</span>
                  <Badge variant={resultadoTeste.sucesso ? 'default' : 'destructive'}>
                    {resultadoTeste.sucesso ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                {resultadoTeste.sucesso ? (
                  <>
                    <div className="flex justify-between">
                      <span>Valor Calculado:</span>
                      <span className="font-bold">{resultadoTeste.valor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fórmula Processada:</span>
                      <span className="font-mono text-xs">{resultadoTeste.detalhes?.formula_usada}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variáveis Encontradas:</span>
                      <span>{resultadoTeste.detalhes?.variaveis_encontradas.length || 0}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Erro:</span>
                    <span className="text-destructive">{resultadoTeste.erro}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
