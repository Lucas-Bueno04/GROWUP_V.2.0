
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Lightbulb,
  BarChart3,
  PieChart,
  LineChart,
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Cell } from 'recharts';
import { useDashboardInteligente } from '@/hooks/dashboard/useDashboardInteligente';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';

export function AnaliseComparativaIA() {
  const { data: orcamentos } = useOrcamentoEmpresasPorUsuario();
  const empresaId = orcamentos?.[0]?.empresa_id;
  const currentYear = new Date().getFullYear();
  
  const { data, isLoading } = useDashboardInteligente(empresaId, currentYear);
  
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.indicadores || data.indicadores.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Análise Comparativa com IA</h2>
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Dados em preparação</h3>
            <p className="text-muted-foreground">
              Configure seus orçamentos e indicadores para ver análises comparativas detalhadas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { indicadores, insights, dadosGrupo } = data;

  // Preparar dados para gráficos
  const chartData = indicadores.slice(0, 8).map(item => ({
    name: item.nome.length > 15 ? item.nome.substring(0, 15) + '...' : item.nome,
    'Sua Empresa': item.valorEmpresa,
    'Grupo': item.valorGrupo,
    'Geral': item.valorGeral
  }));

  // Categorizar indicadores por tipo (simulado baseado no nome)
  const categoriasPorTipo = indicadores.reduce((acc, ind) => {
    let categoria = 'Operacional';
    if (ind.nome.toLowerCase().includes('receita') || ind.nome.toLowerCase().includes('faturamento')) {
      categoria = 'Financeiro';
    } else if (ind.nome.toLowerCase().includes('margem') || ind.nome.toLowerCase().includes('lucro')) {
      categoria = 'Rentabilidade';
    } else if (ind.nome.toLowerCase().includes('liquidez') || ind.nome.toLowerCase().includes('caixa')) {
      categoria = 'Liquidez';
    } else if (ind.nome.toLowerCase().includes('eficiência') || ind.nome.toLowerCase().includes('produtividade')) {
      categoria = 'Eficiência';
    }
    
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriaColors = {
    'Financeiro': '#3b82f6',
    'Rentabilidade': '#ef4444',
    'Eficiência': '#10b981',
    'Liquidez': '#f59e0b',
    'Operacional': '#8b5cf6'
  };

  const pieData = Object.entries(categoriasPorTipo).map(([categoria, count]) => ({
    name: categoria,
    value: count,
    color: categoriaColors[categoria as keyof typeof categoriaColors] || '#6b7280'
  }));

  const getInsightIcon = (tipo: string) => {
    switch (tipo) {
      case 'oportunidade': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'alerta': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'recomendacao': return <Target className="h-5 w-5 text-blue-500" />;
      case 'tendencia': return <LineChart className="h-5 w-5 text-purple-500" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getInsightColor = (tipo: string) => {
    switch (tipo) {
      case 'oportunidade': return 'border-green-200 bg-green-50';
      case 'alerta': return 'border-red-200 bg-red-50';
      case 'recomendacao': return 'border-blue-200 bg-blue-50';
      case 'tendencia': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Análise Comparativa com IA</h2>
        <Badge variant="secondary" className="ml-2">Beta</Badge>
        {dadosGrupo && (
          <Badge variant="outline" className="ml-2">
            Grupo: {dadosGrupo.grupoValor}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights IA
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparativo
          </TabsTrigger>
          <TabsTrigger value="categorias" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Insights em preparação</h3>
                  <p className="text-muted-foreground">
                    Os insights da IA serão gerados automaticamente conforme você adiciona mais dados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              insights.map((insight, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${getInsightColor(insight.tipo)} ${
                    activeInsight === `insight-${index}` ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setActiveInsight(activeInsight === `insight-${index}` ? null : `insight-${index}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.tipo)}
                        <div>
                          <CardTitle className="text-lg">{insight.titulo}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={insight.prioridade === 'alta' ? 'destructive' : 
                                           insight.prioridade === 'media' ? 'default' : 'secondary'}>
                              {insight.prioridade} prioridade
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Confiança: {insight.confianca}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{insight.descricao}</p>
                    
                    {activeInsight === `insight-${index}` && (
                      <div className="space-y-3 border-t pt-4">
                        <h4 className="font-semibold text-sm">Ações Recomendadas:</h4>
                        <ul className="space-y-2">
                          {insight.acoes.map((acao, acaoIndex) => (
                            <li key={acaoIndex} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              {acao}
                            </li>
                          ))}
                        </ul>
                        <Button size="sm" className="mt-3">
                          Criar Plano de Ação
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Indicadores</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparação dos seus indicadores com médias do grupo e geral
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="Sua Empresa" fill="#3b82f6" name="Sua Empresa" />
                    <Bar dataKey="Grupo" fill="#10b981" name="Média do Grupo" />
                    <Bar dataKey="Geral" fill="#6b7280" name="Média Geral" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {indicadores.slice(0, 6).map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">{item.nome}</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">
                          {item.valorEmpresa.toFixed(1)}
                          {item.unidade}
                        </div>
                        <div className="text-muted-foreground">Empresa</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {item.valorGrupo.toFixed(1)}
                          {item.unidade}
                        </div>
                        <div className="text-muted-foreground">Grupo</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {item.valorGeral.toFixed(1)}
                          {item.unidade}
                        </div>
                        <div className="text-muted-foreground">Geral</div>
                      </div>
                    </div>
                    <div className={`text-xs text-center p-1 rounded ${
                      item.performanceVsGrupo > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.performanceVsGrupo > 0 ? '+' : ''}{item.performanceVsGrupo.toFixed(1)}% vs Grupo
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoriaColors).map(([categoria, color]) => {
                    const indicadoresCategoria = indicadores.filter(item => {
                      if (categoria === 'Financeiro') return item.nome.toLowerCase().includes('receita') || item.nome.toLowerCase().includes('faturamento');
                      if (categoria === 'Rentabilidade') return item.nome.toLowerCase().includes('margem') || item.nome.toLowerCase().includes('lucro');
                      if (categoria === 'Liquidez') return item.nome.toLowerCase().includes('liquidez') || item.nome.toLowerCase().includes('caixa');
                      if (categoria === 'Eficiência') return item.nome.toLowerCase().includes('eficiência') || item.nome.toLowerCase().includes('produtividade');
                      return true; // Operacional para todos os outros
                    });
                    
                    if (indicadoresCategoria.length === 0) return null;
                    
                    const mediaPerformance = indicadoresCategoria.reduce((acc, item) => acc + item.performanceVsGrupo, 0) / indicadoresCategoria.length;

                    return (
                      <div key={categoria} className="flex justify-between items-center p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                          <span className="font-medium">{categoria}</span>
                          <Badge variant="outline" className="text-xs">
                            {indicadoresCategoria.length} indicador{indicadoresCategoria.length !== 1 ? 'es' : ''}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${mediaPerformance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {mediaPerformance > 0 ? '+' : ''}{mediaPerformance.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">vs. Grupo</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
