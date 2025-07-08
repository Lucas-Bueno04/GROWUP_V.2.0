
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "lucide-react";
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as ReBarChart, Bar } from "recharts";

// Dados simulados para gráficos financeiros
const dadosFinanceiros = [
  { mes: "Jan", faturamento: 95000, despesas: 82000, lucro: 13000 },
  { mes: "Fev", faturamento: 88000, despesas: 79000, lucro: 9000 },
  { mes: "Mar", faturamento: 105000, despesas: 85000, lucro: 20000 },
  { mes: "Abr", faturamento: 112000, despesas: 88000, lucro: 24000 },
  { mes: "Mai", faturamento: 118000, despesas: 91000, lucro: 27000 },
  { mes: "Jun", faturamento: 127000, despesas: 93000, lucro: 34000 },
];

const indicadores = [
  { nome: "Faturamento Mensal", valor: "R$ 127.000,00", variacao: "+7.6%", status: "positivo" },
  { nome: "Despesas Operacionais", valor: "R$ 93.000,00", variacao: "+2.2%", status: "negativo" },
  { nome: "Lucro Líquido", valor: "R$ 34.000,00", variacao: "+26%", status: "positivo" },
  { nome: "Margem de Lucro", valor: "26.8%", variacao: "+4.7pp", status: "positivo" },
];

export function FinanceiroMentorado() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Panorama Financeiro</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicadores.map((indicador, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{indicador.nome}</p>
              <h3 className="text-2xl font-bold">{indicador.valor}</h3>
              <p className={`text-sm ${indicador.status === "positivo" ? "text-green-500" : "text-red-500"}`}>
                {indicador.variacao} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="faturamento">
        <TabsList>
          <TabsTrigger value="faturamento" className="flex items-center gap-2">
            <LineChart size={16} />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="flex items-center gap-2">
            <BarChart size={16} />
            Comparativo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faturamento">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={dadosFinanceiros}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="faturamento" 
                      stroke="#e11d48" 
                      strokeWidth={2} 
                      name="Faturamento" 
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparativo">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento x Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={dadosFinanceiros}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="faturamento" fill="#e11d48" name="Faturamento" />
                    <Bar dataKey="despesas" fill="#6b7280" name="Despesas" />
                    <Bar dataKey="lucro" fill="#10b981" name="Lucro" />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
