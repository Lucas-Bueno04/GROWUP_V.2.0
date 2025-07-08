import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { TrendingUp, ArrowLeft, Trophy, Target, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const EvolucaoPerformance = () => {
  const navigate = useNavigate();

  // Dados simulados de evolução
  const dadosEvolucaoMensal = [
    { mes: "Jan", pontuacao: 65, media: 60 },
    { mes: "Fev", pontuacao: 68, media: 62 },
    { mes: "Mar", pontuacao: 72, media: 65 },
    { mes: "Abr", pontuacao: 75, media: 67 },
    { mes: "Mai", pontuacao: 80, media: 69 },
    { mes: "Jun", pontuacao: 85, media: 72 },
  ];

  const dadosCompetencias = [
    { area: "Finanças", pontuacao: 80, mediaGrupo: 65 },
    { area: "Marketing", pontuacao: 65, mediaGrupo: 70 },
    { area: "Operações", pontuacao: 90, mediaGrupo: 75 },
    { area: "Gestão de Pessoas", pontuacao: 75, mediaGrupo: 60 },
    { area: "Estratégia", pontuacao: 85, mediaGrupo: 65 },
    { area: "Inovação", pontuacao: 70, mediaGrupo: 60 },
  ];

  const realizacoes = [
    { id: 1, titulo: "Implementação de Sistema ERP", data: "03/05/2025", pontos: 25 },
    { id: 2, titulo: "Conclusão do Módulo Financeiro", data: "15/04/2025", pontos: 15 },
    { id: 3, titulo: "Participação em Workshop de Liderança", data: "10/03/2025", pontos: 10 },
  ];

  return (
    <div className="h-full">
      <Header
        title="Evolução & Performance"
        description="Acompanhe seu progresso, métricas e desenvolvimento no método Mach1%"
        actions={
          <Button variant="outline" onClick={() => navigate("/conteudos/mach1")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Mach1%
          </Button>
        }
        badges={[
          { label: "Pontuação: 425", variant: "outline" },
          { label: "Nível: Avançado", variant: "default" },
          { label: "Ranking: #5", variant: "outline" }
        ]}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="text-muted-foreground text-sm">Pontuação Total</h3>
                <p className="text-4xl font-bold text-red-600">425</p>
                <p className="text-sm text-green-600">+45 este mês</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-muted-foreground text-sm">Nível Atual</h3>
                <p className="text-4xl font-bold">Avançado</p>
                <p className="text-sm text-blue-600">Próx. nível: 500 pts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <h3 className="text-muted-foreground text-sm">Ranking</h3>
                <p className="text-4xl font-bold text-amber-600">#5</p>
                <p className="text-sm">Entre 28 mentorados</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosEvolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pontuacao" 
                      stroke="#e11d48" 
                      strokeWidth={2} 
                      name="Sua pontuação" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="media" 
                      stroke="#9ca3af" 
                      strokeDasharray="5 5" 
                      name="Média do grupo" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Competências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={dadosCompetencias}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="area" />
                    <Radar 
                      name="Sua pontuação" 
                      dataKey="pontuacao" 
                      stroke="#e11d48" 
                      fill="#e11d48" 
                      fillOpacity={0.5} 
                    />
                    <Radar 
                      name="Média do grupo" 
                      dataKey="mediaGrupo" 
                      stroke="#9ca3af" 
                      fill="#9ca3af" 
                      fillOpacity={0.3} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              Últimas Realizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realizacoes.map(realizacao => (
                <div key={realizacao.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">{realizacao.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{realizacao.data}</p>
                  </div>
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                    +{realizacao.pontos} pts
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="outline">Ver histórico completo</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Análise de Performance
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📈 <strong>Tendência:</strong> Crescimento consistente de 5% ao mês</p>
              <p>🎯 <strong>Foco:</strong> Área de Competências precisa de mais atenção</p>
              <p>🏆 <strong>Destaque:</strong> Excelente performance em Operações (90%)</p>
              <p>⚡ <strong>Próximo objetivo:</strong> Alcançar 500 pontos até o final do mês</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvolucaoPerformance;
