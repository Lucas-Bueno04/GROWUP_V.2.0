import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Trash2, ArrowLeft } from 'lucide-react';

const months = [
  "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL",
  "MAIO", "JUNHO", "JULHO", "AGOSTO",
  "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

// MOCK
const mockGroups = [
  {
    id: 1,
    name: "Grupo Financeiro",
    accounts: [
      { id: 3, name: "Receita de Vendas" },
      { id: 4, name: "Despesas Operacionais" }
    ]
  },
  {
    id: 2,
    name: "Grupo Administrativo",
    accounts: [
      { id: 5, name: "Salários" },
      { id: 6, name: "Manutenção" }
    ]
  }
];

const mockBudgetData = {
  id: 'orc-01',
  nome: 'Orçamento Anual 2025',
  empresa: { nome: 'Empresa Exemplo Ltda.' },
  ano: 2025,
  year: 2025,
  enterpriseId: 7,
  months: months.map(month => ({
    month,
    values: [
      { accountId: 3, valueType: "BUDGETED", value: 1000.0 },
      { accountId: 4, valueType: "CARRIED", value: 800.0 },
      { accountId: 5, valueType: "BUDGETED", value: 1500.0 },
      { accountId: 6, valueType: "CARRIED", value: 600.0 }
    ]
  }))
};

export default function BudgetEditor() {
  const [data, setData] = useState(mockBudgetData);

  const getValue = (accountId, month, type) => {
    const monthData = data.months.find(m => m.month === month);
    if (!monthData) return '';
    const valueEntry = monthData.values.find(
      v => v.accountId === accountId && v.valueType === type
    );
    return valueEntry ? valueEntry.value : '';
  };

  const handleChange = (accountId, month, value, type) => {
    const newData = { ...data };
    const monthData = newData.months.find(m => m.month === month);
    if (!monthData) return;

    const index = monthData.values.findIndex(
      v => v.accountId === accountId && v.valueType === type
    );

    if (index >= 0) {
      monthData.values[index].value = parseFloat(value);
    } else {
      monthData.values.push({
        accountId,
        valueType: type,
        value: parseFloat(value)
      });
    }

    setData(newData);
  };

  // Paleta de cores suave
  const styleMap = {
    BUDGETED: {
      bg: 'bg-gray-900/40',
      border: 'border-gray-700',
      text: 'text-gray-300',
      inputBorder: 'border-blue-500',
      groupBg: 'bg-gray-800/70',
      triggerBg: 'bg-blue-600/30',
      triggerText: 'text-blue-300'
    },
    CARRIED: {
      bg: 'bg-gray-900/40',
      border: 'border-gray-700',
      text: 'text-gray-300',
      inputBorder: 'border-green-500',
      groupBg: 'bg-gray-800/70',
      triggerBg: 'bg-green-600/30',
      triggerText: 'text-green-300'
    }
  };

  const renderTable = (type) => {
    const style = styleMap[type];

    return (
      <div className="overflow-auto rounded-md border border-gray-700">
        <table className="min-w-[1000px] w-full border-collapse text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="sticky left-0 bg-gray-800 text-left text-gray-200 font-semibold p-3 border-r border-gray-700 w-[260px]">
                Grupo / Conta
              </th>
              {months.map(month => (
                <th
                  key={month}
                  className="text-center text-gray-200 font-semibold p-2 border-r border-gray-700 w-[120px]"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockGroups.map(group => (
              <React.Fragment key={group.id}>
                <tr className={`bg-gray-800/80 border-b ${style.border}`}>
                  <td colSpan={months.length + 1} className="sticky left-0 p-2 font-bold text-gray-100">
                    {group.name}
                  </td>
                </tr>
                {group.accounts.map(account => (
                  <tr
                    key={account.id}
                    className="bg-gray-900 hover:bg-gray-800 text-gray-300"
                  >
                    <td className="sticky left-0 bg-gray-900 p-2 border-r border-gray-700">
                      {account.name}
                    </td>
                    {months.map(month => (
                      <td key={month} className="p-1 border-r border-gray-700 text-center">
                        <input
                          type="number"
                          step="0.01"
                          value={getValue(account.id, month, type)}
                          onChange={e =>
                            handleChange(account.id, month, e.target.value, type)
                          }
                          className={`w-24 px-2 py-1 rounded bg-gray-800 text-right text-gray-100 border border-white/30 focus:outline-none focus:ring-1 focus:ring-white/50`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Função para excluir orçamento (exemplo simples)
  const handleDelete = () => {
    if (confirm(`Deseja realmente excluir o orçamento "${data.nome}"?`)) {
      alert('Orçamento excluído (simulação).');
      // Aqui você pode implementar lógica real para exclusão
    }
  };

  return (
    <>
      {/* Botão de retornar (sem função) */}
      <Button
        variant="outline"
        className="mb-4 flex items-center gap-2 w-max"
      >
        <ArrowLeft className="h-4 w-4" />
        Retornar
      </Button>

      <div className="space-y-6">
        {/* Área do resumo do orçamento */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-100">{data.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col space-y-2 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  <span>{data.empresa?.nome || 'Empresa não encontrada'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>Ano {data.ano}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Orçamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Área das abas e tabelas */}
        <Tabs defaultValue="BUDGETED" className="w-full">
          <TabsList className="grid grid-cols-2 bg-gray-800 border border-gray-700 rounded overflow-hidden">
            <TabsTrigger
              value="BUDGETED"
              className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 text-gray-400 font-semibold"
            >
              Orçado
            </TabsTrigger>
            <TabsTrigger
              value="CARRIED"
              className="data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300 text-gray-400 font-semibold"
            >
              Realizado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="BUDGETED" className="mt-4">
            {renderTable("BUDGETED")}
          </TabsContent>

          <TabsContent value="CARRIED" className="mt-4">
            {renderTable("CARRIED")}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
