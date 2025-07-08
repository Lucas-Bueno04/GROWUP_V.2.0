
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Calendar, Bell, TrendingUp, Target, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mach1Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <Header
        title="Metodologia Mach1%"
        description="Sua agenda intencional e incremental para desenvolvimento contínuo"
        badges={[
          { label: "Área Situacional: 65%", variant: "outline" },
          { label: "Desenvolvimento: 40%", variant: "default" },
          { label: "Competências: 25%", variant: "outline" }
        ]}
      />

      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Bem-vindo ao Mach1%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              A metodologia Mach1% é seu sistema de desenvolvimento incremental, 
              focado em pequenos avanços consistentes que geram grandes resultados ao longo do tempo.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                1% melhor a cada dia = 37x melhor em 1 ano
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/conteudos/mach1/agenda")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agenda Intencional</h3>
              <p className="text-muted-foreground text-sm">
                Seus compromissos, eventos e ações programadas
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-muted-foreground">eventos hoje</div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/conteudos/mach1/alertas")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Bell className="h-8 w-8 text-red-600" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Central de Alertas</h3>
              <p className="text-muted-foreground text-sm">
                Notificações importantes e lembretes
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-muted-foreground">alertas pendentes</div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/conteudos/mach1/evolucao")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Evolução & Performance</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe seu progresso e métricas
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-green-600">425</div>
                <div className="text-sm text-muted-foreground">pontos totais</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-purple-600" />
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Recursos de Mentoria</h3>
              <p className="text-muted-foreground text-sm">
                Materials, sessões e suporte
              </p>
              <div className="mt-4">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-muted-foreground">recursos disponíveis</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso das Áreas Mach1%</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Área Situacional</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Área de Desenvolvimento</span>
                  <span>40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Área de Competências</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Revisão de Metas Trimestrais</p>
                  <p className="text-sm text-muted-foreground">Hoje, 14:00</p>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Workshop de Liderança</p>
                  <p className="text-sm text-muted-foreground">Amanhã, 09:00</p>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Análise de Indicadores</p>
                  <p className="text-sm text-muted-foreground">Sexta, 16:00</p>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Última Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-2 border-green-500 pl-4">
                <p className="font-medium">Meta concluída</p>
                <p className="text-sm text-muted-foreground">Implementação do sistema ERP</p>
                <p className="text-xs text-muted-foreground">2 horas atrás</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="font-medium">Sessão de mentoria</p>
                <p className="text-sm text-muted-foreground">Revisão de estratégias de marketing</p>
                <p className="text-xs text-muted-foreground">1 dia atrás</p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-4">
                <p className="font-medium">Curso iniciado</p>
                <p className="text-sm text-muted-foreground">Gestão Financeira Avançada</p>
                <p className="text-xs text-muted-foreground">3 dias atrás</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mach1Dashboard;
