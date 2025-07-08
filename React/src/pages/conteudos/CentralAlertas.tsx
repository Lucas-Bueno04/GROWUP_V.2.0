
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Bell, AlertTriangle, Info, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CentralAlertas = () => {
  const navigate = useNavigate();
  const [alertasLidos, setAlertasLidos] = useState<number[]>([]);

  const alertas = [
    {
      id: 1,
      tipo: "critico",
      titulo: "Meta em Atraso",
      descricao: "A meta 'Implementar Sistema CRM' está 3 dias em atraso",
      data: "2 horas atrás",
      categoria: "Metas",
      acao: "Ver Meta"
    },
    {
      id: 2,
      tipo: "aviso",
      titulo: "Sessão de Mentoria Amanhã",
      descricao: "Lembrete: Você tem uma sessão de mentoria agendada para amanhã às 14:00",
      data: "4 horas atrás",
      categoria: "Mentoria",
      acao: "Ver Agenda"
    },
    {
      id: 3,
      tipo: "info",
      titulo: "Novo Material Disponível",
      descricao: "Novo e-book 'Estratégias de Crescimento' foi adicionado à sua biblioteca",
      data: "1 dia atrás",
      categoria: "Recursos",
      acao: "Acessar"
    },
    {
      id: 4,
      tipo: "critico",
      titulo: "Pagamento Pendente",
      descricao: "Parcela da mentoria vence em 2 dias",
      data: "1 dia atrás",
      categoria: "Financeiro",
      acao: "Pagar Agora"
    },
    {
      id: 5,
      tipo: "sucesso",
      titulo: "Objetivo Alcançado",
      descricao: "Parabéns! Você completou 100% da Área Situacional",
      data: "2 dias atrás",
      categoria: "Progresso",
      acao: "Ver Progresso"
    }
  ];

  const marcarComoLido = (alertaId: number) => {
    setAlertasLidos(prev => [...prev, alertaId]);
  };

  const getIconeAlerta = (tipo: string) => {
    switch (tipo) {
      case "critico":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "aviso":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "sucesso":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCorFundo = (tipo: string) => {
    switch (tipo) {
      case "critico":
        return "border-l-4 border-red-500 bg-red-50";
      case "aviso":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "info":
        return "border-l-4 border-blue-500 bg-blue-50";
      case "sucesso":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  const alertasNaoLidos = alertas.filter(alerta => !alertasLidos.includes(alerta.id));
  const alertasCriticos = alertas.filter(alerta => alerta.tipo === "critico" && !alertasLidos.includes(alerta.id));

  return (
    <div className="h-full">
      <Header
        title="Central de Alertas"
        description="Notificações importantes, lembretes e atualizações do sistema"
        actions={
          <Button variant="outline" onClick={() => navigate("/conteudos/mach1")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Mach1%
          </Button>
        }
        badges={[
          { label: `${alertasNaoLidos.length} não lidos`, variant: "default" },
          { label: `${alertasCriticos.length} críticos`, variant: alertasCriticos.length > 0 ? "destructive" : "outline" }
        ]}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Alertas</p>
                  <p className="text-2xl font-bold">{alertas.length}</p>
                </div>
                <Bell className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Críticos</p>
                  <p className="text-2xl font-bold text-red-600">{alertasCriticos.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Não Lidos</p>
                  <p className="text-2xl font-bold text-blue-600">{alertasNaoLidos.length}</p>
                </div>
                <Info className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lidos</p>
                  <p className="text-2xl font-bold text-green-600">{alertasLidos.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Todos os Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertas.map((alerta) => {
              const isLido = alertasLidos.includes(alerta.id);
              return (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg ${getCorFundo(alerta.tipo)} ${isLido ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getIconeAlerta(alerta.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${isLido ? 'line-through' : ''}`}>
                            {alerta.titulo}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {alerta.categoria}
                          </Badge>
                          {!isLido && (
                            <Badge variant="destructive" className="text-xs">
                              Novo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alerta.descricao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alerta.data}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {!isLido && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => marcarComoLido(alerta.id)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Marcar como Lido
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        {alerta.acao}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Como funcionam os alertas?
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Críticos:</strong> Requerem ação imediata (metas atrasadas, pagamentos vencidos)</p>
              <p><strong>Avisos:</strong> Lembretes importantes (sessões agendadas, prazos próximos)</p>
              <p><strong>Informativos:</strong> Novidades e atualizações do sistema</p>
              <p><strong>Sucessos:</strong> Conquistas e objetivos alcançados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentralAlertas;
