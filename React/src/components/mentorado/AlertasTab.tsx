
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type AlertasTabProps = {
  mentoradoId: string;
};

export function AlertasTab({ mentoradoId }: AlertasTabProps) {
  const [alertas, setAlertas] = useState([
    {
      id: '1',
      type: 'meta_estagnada',
      priority: 'alta',
      title: 'Meta de Vendas Estagnada',
      description: 'A meta de vendas está sem progresso há mais de 15 dias.',
      date: '10/04/2025',
      isRead: false
    },
    {
      id: '2',
      type: 'aniversario',
      priority: 'baixa',
      title: 'Aniversário',
      description: 'O aniversário do mentorado será em 3 dias.',
      date: '12/04/2025',
      isRead: true
    },
    {
      id: '3',
      type: 'pagamento_pendente',
      priority: 'media',
      title: 'Pagamento Pendente',
      description: 'Existe uma parcela de pagamento com vencimento próximo.',
      date: '15/04/2025',
      isRead: false
    },
  ]);

  const [filtro, setFiltro] = useState('todos');

  const alertasFiltrados = filtro === 'todos' 
    ? alertas 
    : filtro === 'nao_lidos' 
      ? alertas.filter(alerta => !alerta.isRead)
      : alertas.filter(alerta => alerta.type === filtro);

  const marcarComoLido = (alertaId: string) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === alertaId 
        ? { ...alerta, isRead: true } 
        : alerta
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return "bg-green-100 text-green-800";
      case 'media': return "bg-yellow-100 text-yellow-800";
      case 'alta': return "bg-orange-100 text-orange-800";
      case 'critica': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alertas e Notificações</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltro('todos')}
            className={filtro === 'todos' ? "border-red-500" : ""}
          >
            Todos
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltro('nao_lidos')}
            className={filtro === 'nao_lidos' ? "border-red-500" : ""}
          >
            Não lidos
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltro('meta_estagnada')}
            className={filtro === 'meta_estagnada' ? "border-red-500" : ""}
          >
            Metas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alertasFiltrados.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum alerta encontrado
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {alertasFiltrados.map((alerta) => (
                <div 
                  key={alerta.id}
                  className={`p-4 border rounded-lg ${alerta.isRead ? 'bg-background' : 'bg-muted/30'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle 
                        className={`h-5 w-5 ${
                          alerta.priority === 'alta' || alerta.priority === 'critica' 
                            ? 'text-red-500' 
                            : alerta.priority === 'media' 
                              ? 'text-yellow-500' 
                              : 'text-green-500'
                        }`} 
                      />
                      <h3 className="font-medium">{alerta.title}</h3>
                    </div>
                    <Badge className={getPriorityColor(alerta.priority)}>
                      {alerta.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alerta.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Data: {alerta.date}</span>
                    {!alerta.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 p-0 px-2"
                        onClick={() => marcarComoLido(alerta.id)}
                      >
                        <Check className="h-3 w-3 mr-1" /> Marcar como lido
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
