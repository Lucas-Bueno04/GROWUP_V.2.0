
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  TestTube, 
  Save, 
  Settings, 
  Database, 
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { SecureApiKeyConfig } from './components/SecureApiKeyConfig';
import { useConfiguracaoSistema } from './hooks/useConfiguracaoSistema';

export function ConfiguracaoSistemaContent() {
  const {
    faixasFaturamento,
    configCalculos,
    parametrosIA,
    formulaTeste,
    resultadoTeste,
    testando,
    hasUnsavedChanges,
    setConfigCalculos,
    setParametrosIA,
    setFormulaTeste,
    adicionarFaixa,
    removerFaixa,
    atualizarFaixa,
    testarFormulaClick,
    salvarConfiguracoes
  } = useConfiguracaoSistema();

  return (
    <div className="space-y-6">
      {/* Security and API Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Segurança e APIs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure chaves de API de forma segura e gerencie configurações de segurança do sistema.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <SecureApiKeyConfig
            keyName="CNPJ_WS"
            title="API CNPJ.ws"
            description="Configure a chave da API do CNPJ.ws para consultas automatizadas de dados empresariais."
            placeholder="Digite sua chave da API CNPJ.ws..."
          />
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Segurança:</strong> As chaves de API são armazenadas de forma criptografada e segura. 
              Nunca são expostas no frontend e são acessadas apenas por funções autorizadas no servidor.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Faixas de Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Faixas de Faturamento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure as faixas de faturamento usadas para classificação automática das empresas.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {faixasFaturamento.map((faixa) => (
            <div key={faixa.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`nome-${faixa.id}`} className="text-xs">Nome</Label>
                  <Input
                    id={`nome-${faixa.id}`}
                    value={faixa.nome}
                    onChange={(e) => atualizarFaixa(faixa.id, 'nome', e.target.value)}
                    placeholder="Nome da faixa"
                  />
                </div>
                <div>
                  <Label htmlFor={`min-${faixa.id}`} className="text-xs">Valor Mínimo</Label>
                  <Input
                    id={`min-${faixa.id}`}
                    type="number"
                    value={faixa.valorMinimo}
                    onChange={(e) => atualizarFaixa(faixa.id, 'valorMinimo', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`max-${faixa.id}`} className="text-xs">Valor Máximo</Label>
                  <Input
                    id={`max-${faixa.id}`}
                    type="number"
                    value={faixa.valorMaximo}
                    onChange={(e) => atualizarFaixa(faixa.id, 'valorMaximo', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Ativa</Label>
                    <div className="pt-2">
                      <Switch
                        checked={faixa.ativa}
                        onCheckedChange={(checked) => atualizarFaixa(faixa.id, 'ativa', checked)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removerFaixa(faixa.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button onClick={adicionarFaixa} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Nova Faixa
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Cálculos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Cálculos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure como o sistema realiza cálculos de médias e indicadores.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Recalcular Automaticamente</Label>
                <p className="text-xs text-muted-foreground">
                  Recalcula médias quando dados são alterados
                </p>
              </div>
              <Switch
                checked={configCalculos.recalcularAutomatico}
                onCheckedChange={(checked) => 
                  setConfigCalculos({ ...configCalculos, recalcularAutomatico: checked })
                }
              />
            </div>
            
            <div>
              <Label>Frequência de Cálculo</Label>
              <Select
                value={configCalculos.frequenciaCalculoMedias}
                onValueChange={(value) => 
                  setConfigCalculos({ ...configCalculos, frequenciaCalculoMedias: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Mínimo de Empresas por Grupo</Label>
              <Input
                type="number"
                min="1"
                value={configCalculos.minimoEmpresasPorGrupo}
                onChange={(e) => 
                  setConfigCalculos({ ...configCalculos, minimoEmpresasPorGrupo: Number(e.target.value) })
                }
              />
            </div>
            
            <div>
              <Label>Precisão Decimal</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={configCalculos.precisaoDecimal}
                onChange={(e) => 
                  setConfigCalculos({ ...configCalculos, precisaoDecimal: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Parâmetros de IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure como a IA gera insights e recomendações.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Confiança Mínima (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={parametrosIA.confiancaMinima}
                onChange={(e) => 
                  setParametrosIA({ ...parametrosIA, confiancaMinima: Number(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Insights com confiança abaixo deste valor não serão exibidos
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Gerar Insights Automaticamente</Label>
                <p className="text-xs text-muted-foreground">
                  IA gera insights sem intervenção manual
                </p>
              </div>
              <Switch
                checked={parametrosIA.gerarInsightsAutomatico}
                onCheckedChange={(checked) => 
                  setParametrosIA({ ...parametrosIA, gerarInsightsAutomatico: checked })
                }
              />
            </div>
          </div>
          
          <div>
            <Label>Categorias de Insights</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['oportunidade', 'alerta', 'recomendacao', 'tendencia', 'otimizacao'].map(categoria => (
                <Badge
                  key={categoria}
                  variant={parametrosIA.categoriasInsights.includes(categoria) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const novasCategorias = parametrosIA.categoriasInsights.includes(categoria)
                      ? parametrosIA.categoriasInsights.filter(c => c !== categoria)
                      : [...parametrosIA.categoriasInsights, categoria];
                    setParametrosIA({ ...parametrosIA, categoriasInsights: novasCategorias });
                  }}
                >
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teste de Fórmulas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Testador de Fórmulas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Teste fórmulas de indicadores antes de aplicá-las no sistema.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="formula-teste">Fórmula para Teste</Label>
            <Input
              id="formula-teste"
              value={formulaTeste}
              onChange={(e) => setFormulaTeste(e.target.value)}
              placeholder="Ex: (G1 - G2) / G1 * 100"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use G1, G2, etc. para grupos e C.1.1, C.1.2, etc. para contas específicas
            </p>
          </div>
          
          <Button 
            onClick={testarFormulaClick}
            disabled={testando || !formulaTeste}
            className="w-full"
          >
            {testando ? "Testando..." : "Testar Fórmula"}
          </Button>
          
          {resultadoTeste && (
            <Alert variant={resultadoTeste.sucesso ? "default" : "destructive"}>
              {resultadoTeste.sucesso ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {resultadoTeste.sucesso 
                  ? `Resultado: ${resultadoTeste.valor.toFixed(2)}`
                  : `Erro: ${resultadoTeste.erro}`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      {hasUnsavedChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  Você tem alterações não salvas
                </span>
              </div>
              <Button onClick={salvarConfiguracoes}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
