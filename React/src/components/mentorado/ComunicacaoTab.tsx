
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, AlertCircle, MessageCircle } from "lucide-react";

type ComunicacaoTabProps = {
  mentoradoId: string;
};

// Dados simulados de mensagens
const mensagens = [
  { 
    id: 1, 
    de: "mentor", 
    nome: "João Silva", 
    texto: "Olá, lembre-se que temos uma reunião agendada para amanhã às 15h para discutir as metas do segundo trimestre.", 
    data: "12/04/2025 14:30"
  },
  { 
    id: 2, 
    de: "mentorado", 
    nome: "Douglas Gomes", 
    texto: "Confirmado! Estarei presente na reunião com os materiais solicitados.", 
    data: "12/04/2025 15:45"
  },
  { 
    id: 3, 
    de: "mentor", 
    nome: "João Silva", 
    texto: "Ótimo! Precisamos revisar o progresso das metas estabelecidas no início do ano e planejar os próximos passos.", 
    data: "12/04/2025 16:20"
  },
];

const notificacoesEnviadas = [
  {
    id: 1,
    tipo: "email",
    assunto: "Confirmação da reunião trimestral",
    data: "10/04/2025 09:15",
    status: "entregue"
  },
  {
    id: 2,
    tipo: "whatsapp",
    assunto: "Lembrete de tarefas pendentes",
    data: "05/04/2025 14:30",
    status: "entregue"
  }
];

export function ComunicacaoTab({ mentoradoId }: ComunicacaoTabProps) {
  const { toast } = useToast();
  const [novaMensagem, setNovaMensagem] = useState("");
  const [assuntoNotificacao, setAssuntoNotificacao] = useState("");
  const [conteudoNotificacao, setConteudoNotificacao] = useState("");
  
  // Em uma implementação real, buscaríamos essas informações do banco de dados

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem para enviar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso."
    });
    
    setNovaMensagem("");
  };

  const handleEnviarNotificacao = () => {
    if (!assuntoNotificacao.trim() || !conteudoNotificacao.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Notificação enviada",
      description: "A notificação foi enviada com sucesso."
    });
    
    setAssuntoNotificacao("");
    setConteudoNotificacao("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comunicação com o Mentorado</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <div className="bg-muted/30 rounded-lg p-4 h-80 overflow-y-auto mb-4">
                {mensagens.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`mb-4 flex ${msg.de === 'mentor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.de === 'mentor' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{msg.nome}</span>
                        <span className="text-xs opacity-75">{msg.data}</span>
                      </div>
                      <p className="text-sm">{msg.texto}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  className="resize-none"
                />
                <Button
                  className="bg-red-600 hover:bg-red-700 self-end"
                  onClick={handleEnviarMensagem}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Essa conversa é visível apenas para mentores e para o mentorado.
              </p>
            </TabsContent>

            <TabsContent value="notificacoes">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    placeholder="Assunto da notificação"
                    value={assuntoNotificacao}
                    onChange={(e) => setAssuntoNotificacao(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div>
                  <Label htmlFor="conteudo">Conteúdo</Label>
                  <Textarea
                    id="conteudo"
                    placeholder="Conteúdo da notificação..."
                    value={conteudoNotificacao}
                    onChange={(e) => setConteudoNotificacao(e.target.value)}
                    className="mb-2"
                    rows={5}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="email" defaultChecked />
                  <Label htmlFor="email">Email</Label>
                  
                  <input type="checkbox" id="whatsapp" defaultChecked />
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  
                  <input type="checkbox" id="sistema" defaultChecked />
                  <Label htmlFor="sistema">Sistema</Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleEnviarNotificacao}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Enviar Notificação
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historico">
              <div className="space-y-4">
                <h3 className="font-medium">Notificações Enviadas</h3>
                {notificacoesEnviadas.map(notif => (
                  <div key={notif.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {notif.tipo === 'email' ? (
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        ) : notif.tipo === 'whatsapp' ? (
                          <MessageCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="font-medium">{notif.assunto}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        notif.status === 'entregue' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Enviado em: {notif.data} via {notif.tipo}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);
