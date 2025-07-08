
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Calendar, Clock, Users, MapPin, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgendaIntencional = () => {
  const navigate = useNavigate();

  const eventosHoje = [
    {
      id: 1,
      titulo: "Reunião de Planejamento Estratégico",
      horario: "09:00 - 10:30",
      tipo: "Reunião",
      participantes: 5,
      local: "Sala de Reuniões A"
    },
    {
      id: 2,
      titulo: "Sessão de Mentoria Individual",
      horario: "14:00 - 15:00",
      tipo: "Mentoria",
      participantes: 2,
      local: "Online - Zoom"
    },
    {
      id: 3,
      titulo: "Workshop: Gestão de Tempo",
      horario: "16:00 - 18:00",
      tipo: "Workshop",
      participantes: 12,
      local: "Auditório Principal"
    }
  ];

  const proximosEventos = [
    {
      id: 4,
      titulo: "Análise de Resultados Q1",
      data: "Amanhã",
      horario: "10:00 - 12:00",
      tipo: "Análise"
    },
    {
      id: 5,
      titulo: "Sessão de Feedback 360°",
      data: "Quinta-feira",
      horario: "15:00 - 16:00",
      tipo: "Feedback"
    },
    {
      id: 6,
      titulo: "Revisão de Metas Mensais",
      data: "Sexta-feira",
      horario: "11:00 - 12:00",
      tipo: "Revisão"
    }
  ];

  return (
    <div className="h-full">
      <Header
        title="Agenda Intencional"
        description="Seus compromissos, eventos e ações programadas no método Mach1%"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/conteudos/mach1")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        }
        badges={[
          { label: "Hoje: 3 eventos", variant: "default" },
          { label: "Esta semana: 8 eventos", variant: "outline" }
        ]}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-600" />
                  Eventos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventosHoje.map((evento) => (
                  <div key={evento.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{evento.titulo}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {evento.tipo}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {evento.horario}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {evento.participantes} participantes
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {evento.local}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Ver Detalhes</Button>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {proximosEventos.map((evento) => (
                  <div key={evento.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{evento.titulo}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{evento.data}</span>
                        <span>{evento.horario}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {evento.tipo}
                      </span>
                      <Button size="sm" variant="outline">Ver</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Semana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">8</div>
                  <div className="text-sm text-muted-foreground">eventos agendados</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mentorias</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Workshops</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reuniões</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revisões</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendário Completo
                </Button>
                <Button className="w-full" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Definir Lembretes
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Convidar Participantes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">💡 Dica Mach1%</h3>
                <p className="text-sm text-muted-foreground">
                  Planeje suas semanas com antecedência e reserve 20% do tempo para imprevistos.
                  Isso garante flexibilidade sem comprometer seus objetivos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaIntencional;
