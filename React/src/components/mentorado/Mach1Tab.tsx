
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Mach1TabProps = {
  mentoradoId: string;
};

// Dados simulados para demonstração
const areaSituacional = {
  progresso: 65,
  itens: [
    { id: 1, descricao: "Análise de cenário", status: "completo", data: "10/04/2025" },
    { id: 2, descricao: "Identificação de problemas", status: "completo", data: "15/04/2025" },
    { id: 3, descricao: "Mapeamento de oportunidades", status: "em_andamento", data: "25/04/2025" },
    { id: 4, descricao: "Validação de hipóteses", status: "pendente", data: "-" },
  ],
};

const areaDesenvolvimento = {
  progresso: 40,
  itens: [
    { id: 1, descricao: "Planejamento estratégico", status: "completo", data: "05/04/2025" },
    { id: 2, descricao: "Definição de KPIs", status: "em_andamento", data: "20/04/2025" },
    { id: 3, descricao: "Estruturação de processos", status: "pendente", data: "-" },
    { id: 4, descricao: "Implementação de melhorias", status: "pendente", data: "-" },
  ],
};

const areaCompetencias = {
  progresso: 25,
  itens: [
    { id: 1, descricao: "Liderança", status: "em_andamento", data: "15/04/2025" },
    { id: 2, descricao: "Gestão financeira", status: "pendente", data: "-" },
    { id: 3, descricao: "Marketing estratégico", status: "pendente", data: "-" },
    { id: 4, descricao: "Negociação", status: "pendente", data: "-" },
  ],
};

export function Mach1Tab({ mentoradoId }: Mach1TabProps) {
  const [activeTab, setActiveTab] = useState("situacional");

  // Função para renderizar o status
  const renderStatus = (status: string) => {
    switch(status) {
      case "completo":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completo</span>;
      case "em_andamento":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Em andamento</span>;
      case "pendente":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pendente</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metodologia Mach1%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            A metodologia Mach1% acompanha o desenvolvimento do mentorado em três áreas principais, 
            ajudando a estruturar um plano de crescimento contínuo e mensurável.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Área Situacional</h3>
                <Progress value={areaSituacional.progresso} className="my-2" />
                <p className="text-sm text-muted-foreground">{areaSituacional.progresso}% concluído</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Área de Desenvolvimento</h3>
                <Progress value={areaDesenvolvimento.progresso} className="my-2" />
                <p className="text-sm text-muted-foreground">{areaDesenvolvimento.progresso}% concluído</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Área de Competências</h3>
                <Progress value={areaCompetencias.progresso} className="my-2" />
                <p className="text-sm text-muted-foreground">{areaCompetencias.progresso}% concluído</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="situacional">Área Situacional</TabsTrigger>
              <TabsTrigger value="desenvolvimento">Área de Desenvolvimento</TabsTrigger>
              <TabsTrigger value="competencias">Área de Competências</TabsTrigger>
            </TabsList>

            <TabsContent value="situacional" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaSituacional.itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{renderStatus(item.status)}</TableCell>
                      <TableCell>{item.data}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="desenvolvimento" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaDesenvolvimento.itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{renderStatus(item.status)}</TableCell>
                      <TableCell>{item.data}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="competencias" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaCompetencias.itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{renderStatus(item.status)}</TableCell>
                      <TableCell>{item.data}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
