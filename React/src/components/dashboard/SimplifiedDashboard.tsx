import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardInteligente } from '@/hooks/dashboard/useDashboardInteligente';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Brain, 
  Calendar,
  Building2,
  Zap,
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Mock data for demonstration
const performanceData = [
  { month: 'Jan', valor: 75 },
  { month: 'Fev', valor: 82 },
  { month: 'Mar', valor: 78 },
  { month: 'Abr', valor: 85 },
  { month: 'Mai', valor: 88 },
  { month: 'Jun', valor: 92 },
];

const moduleData = [
  { name: 'Cards Estratégicos', value: 85, color: '#8b5cf6' },
  { name: 'Análise Orçamentária', value: 78, color: '#06b6d4' },
  { name: 'Metas', value: 92, color: '#10b981' },
  { name: 'Mach1%', value: 88, color: '#f59e0b' },
  { name: 'Grow Up', value: 76, color: '#ef4444' },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function SimplifiedDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch data from all modules
  const { data: orcamentoEmpresas = [] } = useOrcamentoEmpresasPorUsuario();
  const empresaId = orcamentoEmpresas.length > 0 ? orcamentoEmpresas[0].empresa_id : null;
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardInteligente(empresaId);
  const { data: metasData = [] } = useMetasIndicadoresEmpresa(empresaId);
  const { indicadoresProprios } = useIndicadoresProprios(empresaId);

  const activeIndicators = indicadoresProprios.data?.filter(ind => ind.ativo).length || 0;
  const totalMetas = metasData.length;
  const performanceScore = dashboardData?.performanceScore || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Integrado</h1>
          <p className="text-muted-foreground">
            Visão completa do seu progresso
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Sistema Ativo
          </Badge>
        </div>
      </div>

 
        

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

           <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Dashboard em desenvolvimento. Em breve, você terá acesso a análises detalhadas e métricas de performance.
              </p>
            </div>
          </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/gestao/cards-estrategicos')}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Brain className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-sm text-center">Cards Estratégicos</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">Planejamento estratégico</p>
                <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/gestao/analise-orcamentaria')}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-sm text-center">Análise Orçamentária</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">Gestão financeira</p>
                <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/metas')}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Target className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-sm text-center">Metas</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">Objetivos e KPIs</p>
                <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/conteudos/mach1')}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="font-semibold text-sm text-center">Mach1%</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">Aceleração de resultados</p>
                <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/conteudos/grow-up')}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <TrendingUp className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="font-semibold text-sm text-center">Grow Up</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">Diagnóstico e maturidade</p>
                <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Cards Estratégicos
              </CardTitle>
              <CardDescription>
                Gerencie seus planos estratégicos e tome decisões fundamentadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground mb-4">
                  Em breve você terá acesso ao sistema completo de Cards Estratégicos
                </p>
                <Button onClick={() => navigate('/conteudos/cards-estrategicos')}>
                  Acessar Módulo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análise Orçamentária
                </CardTitle>
                <CardDescription>
                  Acompanhe seus indicadores financeiros em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance Score</span>
                    <span className="text-lg font-bold">{performanceScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={performanceScore} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{dashboardData?.resumoPerformance?.acimaGrupo || 0}</p>
                      <p className="text-xs text-muted-foreground">Acima do grupo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{dashboardData?.resumoPerformance?.totalIndicadores || 0}</p>
                      <p className="text-xs text-muted-foreground">Total indicadores</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights de IA</CardTitle>
                <CardDescription>
                  Recomendações personalizadas para seu negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.insights?.slice(0, 3).map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{insight.titulo}</p>
                        <p className="text-xs text-muted-foreground">{insight.descricao}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Processando insights...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sistema de Metas
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso das suas metas e objetivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{totalMetas}</div>
                  <p className="text-sm text-muted-foreground">Metas Ativas</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(totalMetas * 0.8)}</div>
                  <p className="text-sm text-muted-foreground">Em Progresso</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(totalMetas * 0.6)}</div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" onClick={() => navigate('/conteudos/metas')}>
                  <Target className="h-4 w-4 mr-2" />
                  Gerenciar Metas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Mach1%
                </CardTitle>
                <CardDescription>
                  Acelere seus resultados com metodologias avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aceleração de Performance</h3>
                  <p className="text-muted-foreground mb-4">
                    Metodologias para acelerar seus resultados empresariais
                  </p>
                  <Button onClick={() => navigate('/conteudos/mach1')}>
                    Acessar Mach1%
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Grow Up
                </CardTitle>
                <CardDescription>
                  Diagnóstico de maturidade empresarial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <TrendingUp className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Diagnóstico Empresarial</h3>
                  <p className="text-muted-foreground mb-4">
                    Avalie a maturidade e evolução do seu negócio
                  </p>
                  <Button onClick={() => navigate('/conteudos/grow-up')}>
                    Fazer Diagnóstico
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}