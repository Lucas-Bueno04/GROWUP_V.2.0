
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, Calendar, MessageSquare } from "lucide-react";

// Simulação de dados de mentoria
const proximasMentorias = [
  {
    id: 1,
    titulo: "Análise Trimestral de Performance",
    data: "15/06/2025",
    horario: "14:00 - 15:30",
    tipo: "Individual",
    status: "agendada"
  },
  {
    id: 2,
    titulo: "Workshop de Estratégias de Marketing",
    data: "28/06/2025",
    horario: "09:00 - 12:00",
    tipo: "Grupo",
    status: "agendada"
  }
];

const historicoMentorias = [
  {
    id: 3,
    titulo: "Revisão de Metas do Q1",
    data: "10/04/2025",
    horario: "14:00 - 15:30",
    tipo: "Individual",
    status: "realizada"
  },
  {
    id: 4,
    titulo: "Definição de Indicadores Financeiros",
    data: "15/03/2025",
    horario: "10:00 - 11:30",
    tipo: "Individual",
    status: "realizada"
  },
  {
    id: 5,
    titulo: "Workshop de Liderança",
    data: "25/02/2025",
    horario: "09:00 - 12:00",
    tipo: "Grupo",
    status: "realizada"
  }
];

const recursos = [
  {
    id: 1,
    titulo: "Planilha de Orçamento Empresarial",
    tipo: "planilha",
    data: "10/01/2025"
  },
  {
    id: 2,
    titulo: "Guia Completo de Estratégia de Preços",
    tipo: "ebook",
    data: "05/02/2025"
  },
  {
    id: 3,
    titulo: "Template de Plano de Ação",
    tipo: "documento",
    data: "20/03/2025"
  }
];

export function MinhaMentoria() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Minha Mentoria</h2>
      
      <Tabs defaultValue="sessoes">
        <TabsList>
          <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessoes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} className="text-red-600" />
                  Próximas Mentorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {proximasMentorias.length > 0 ? (
                  <div className="space-y-4">
                    {proximasMentorias.map(mentoria => (
                      <div key={mentoria.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{mentoria.titulo}</h3>
                            <div className="flex items-center gap-4 text-sm mt-2">
                              <p>📅 {mentoria.data}</p>
                              <p>⏰ {mentoria.horario}</p>
                              <p className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{mentoria.tipo}</p>
                            </div>
                          </div>
                          <Button size="sm">Acessar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nenhuma mentoria agendada.</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Histórico de Mentorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicoMentorias.map(mentoria => (
                    <div key={mentoria.id} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{mentoria.titulo}</h3>
                          <div className="flex items-center gap-4 text-sm mt-2">
                            <p>📅 {mentoria.data}</p>
                            <p>⏰ {mentoria.horario}</p>
                            <p className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{mentoria.tipo}</p>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileText size={14} />
                            Anotações
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recursos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book size={20} className="text-red-600" />
                Material de Apoio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recursos.map(recurso => (
                  <div key={recurso.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {recurso.tipo === "planilha" && <FileText size={20} className="text-green-600" />}
                        {recurso.tipo === "ebook" && <Book size={20} className="text-blue-600" />}
                        {recurso.tipo === "documento" && <FileText size={20} className="text-amber-600" />}
                        <div>
                          <h3 className="font-medium">{recurso.titulo}</h3>
                          <p className="text-sm text-muted-foreground">Adicionado em {recurso.data}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button className="w-full" variant="outline">Solicitar Material</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} className="text-red-600" />
                Suporte e Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Precisa de ajuda ou quer solicitar uma mentoria adicional? Entre em contato:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2 justify-center">
                  <MessageSquare size={16} />
                  Chat com Mentor
                </Button>
                <Button variant="outline" className="flex items-center gap-2 justify-center">
                  <Calendar size={16} />
                  Solicitar Mentoria
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
