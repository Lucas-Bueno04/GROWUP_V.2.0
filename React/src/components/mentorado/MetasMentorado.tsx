
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Calendar, Plus } from "lucide-react";

type Meta = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: "pessoal" | "profissional" | "financeira";
  prazo: string;
  progresso: number;
  prioridade: "alta" | "media" | "baixa";
};

// Simulação de dados das metas
const mockMetas: Meta[] = [
  {
    id: 1,
    titulo: "Aumentar faturamento em 20%",
    descricao: "Atingir crescimento no faturamento através de novas estratégias de marketing",
    tipo: "financeira",
    prazo: "31/12/2025",
    progresso: 45,
    prioridade: "alta"
  },
  {
    id: 2,
    titulo: "Concluir curso de gestão financeira",
    descricao: "Finalizar o curso online para aprimorar habilidades em gestão",
    tipo: "profissional",
    prazo: "30/06/2025",
    progresso: 70,
    prioridade: "media"
  },
  {
    id: 3,
    titulo: "Praticar mindfulness diariamente",
    descricao: "Reservar 15 minutos por dia para meditação e concentração",
    tipo: "pessoal",
    prazo: "Contínuo",
    progresso: 60,
    prioridade: "media"
  },
  {
    id: 4,
    titulo: "Reduzir custos operacionais em 15%",
    descricao: "Identificar ineficiências e implementar melhorias",
    tipo: "financeira",
    prazo: "30/09/2025",
    progresso: 30,
    prioridade: "alta"
  }
];

export function MetasMentorado() {
  const [metas] = useState(mockMetas);
  const [tipoFiltro, setTipoFiltro] = useState<"todas" | "pessoal" | "profissional" | "financeira">("todas");

  const metasFiltradas = tipoFiltro === "todas" 
    ? metas 
    : metas.filter(meta => meta.tipo === tipoFiltro);

  const getPrioridadeClasse = (prioridade: string) => {
    switch(prioridade) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minhas Metas</h2>
        <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
          <Plus size={16} />
          Nova Meta
        </Button>
      </div>

      <Tabs defaultValue="todas" onValueChange={(v) => setTipoFiltro(v as any)}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pessoal">Pessoais</TabsTrigger>
          <TabsTrigger value="profissional">Profissionais</TabsTrigger>
          <TabsTrigger value="financeira">Financeiras</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metasFiltradas.map(meta => (
          <Card key={meta.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-red-600" />
                  <CardTitle className="text-lg">{meta.titulo}</CardTitle>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadeClasse(meta.prioridade)}`}>
                  {meta.prioridade}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{meta.descricao}</p>
              
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Progresso: {meta.progresso}%</span>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Prazo: {meta.prazo}</span>
                </div>
              </div>
              
              <Progress value={meta.progresso} className="h-2" />
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">Atualizar</Button>
                <Button variant="outline" size="sm">Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
