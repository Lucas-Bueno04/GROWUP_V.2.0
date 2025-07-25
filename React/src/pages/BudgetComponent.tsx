// BudgetEditor.tsx
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Trash2, ArrowLeft, Copy, Pencil, Trash } from 'lucide-react';
import { JwtService } from "@/components/auth/GetAuthParams";
import { Group } from '@/components/interfaces/Group';
import { Budget } from '@/components/interfaces/Budget';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Enterprise } from '@/components/interfaces/Enterprise';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();
const months = ["JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '0,00';

  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BudgetEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<Budget | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await jwtService.getToken();
      const email = await jwtService.getClaim("sub") as string;
      const groupsData = await axios.get(`${API_KEY}/group`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data);

      const budgetData = await axios.get(`${API_KEY}/budget/by-email-id/${email}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data);

      setGroups(groupsData);
      setData(budgetData);

      if (budgetData.enterpriseId) {
        const enterpriseData = await axios.get(`${API_KEY}/enterprise/by-enterpriseId/${budgetData.enterpriseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.data);
        setEnterprise(enterpriseData);
      }
    };

    if (id) fetchData();
  }, [id]);

  const getValue = (accountId: number, month: string, type: string) => {
    const m = (data?.months || []).find(m => m.month === month);
    const val = (m?.values || []).find(v => v.accountId === accountId && v.valueType === type);
    return val?.value ?? '';
  };

  const getTotalValueByAccount = (accountId: number, type: string) => {
    return (data?.months || []).reduce((sum, month) => {
      const val = (month.values || []).find(v => v.accountId === accountId && v.valueType === type);
      return sum + (val?.value || 0);
    }, 0);
  };

  const handleChange = (accountId: number, month: string, value: string, type: string) => {
    if (!data) return;
    const newData = structuredClone(data);
    const m = (newData.months || []).find(m => m.month === month);
    if (!m) return;

    const existing = (m.values || []).find(v => v.accountId === accountId && v.valueType === type);
    if (existing) {
      existing.value = parseFloat(value);
    } else {
      m.values.push({ accountId, valueType: type, value: parseFloat(value) });
    }

    setData(newData);
  };

  const handleCopyColumn = (month: string, type: string) => {
    if (!data) return;
    const idx = months.indexOf(month);
    if (idx === -1) return;

    const newData = structuredClone(data);
    const source = (newData.months || []).find(m => m.month === month);
    if (!source) return;

    for (let i = idx + 1; i < months.length; i++) {
      const target = (newData.months || []).find(m => m.month === months[i]);
      if (!target) continue;

      (source.values || []).forEach(src => {
        if (src.valueType !== type) return;
        const dest = (target.values || []).find(v => v.accountId === src.accountId && v.valueType === type);
        if (dest) {
          dest.value = src.value;
        } else {
          target.values.push({ accountId: src.accountId, valueType: type, value: src.value });
        }
      });
    }

    setData(newData);
  };

  const handleSave = async () => {
    try {
      const token = await jwtService.getToken();
      await axios.put(`${API_KEY}/budget/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Orçamento salvo com sucesso" });
    } catch (error) {
      toast({ title: "Erro ao salvar orçamento", description: String(error) });
    }
  };

  const handleDelete = async () => {
    try {
      const token = await jwtService.getToken();
      await axios.delete(`${API_KEY}/budget/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Orçamento excluído com sucesso" });
      navigate("/orcamentos");
    } catch (error) {
      toast({ title: "Erro ao excluir orçamento", description: String(error) });
    }
  };

  
  const renderTable = (type: 'BUDGETED' | 'CARRIED') => {
    const getGroupMonthlyTotal = (groupId: number, month: string, type: string) => {
      const group = groups.find(g => g.id === groupId);
      if (!group) return 0;

      return group.accounts.reduce((sum, account) => {
        const m = (data?.months || []).find(m => m.month === month);
        const val = (m?.values || []).find(v => v.accountId === account.id && v.valueType === type);
        return sum + (val?.value || 0);
      }, 0);
    };

    const getGroupTotalAnnual = (groupId: number, type: string) => {
      return months.reduce((sum, month) => sum + getGroupMonthlyTotal(groupId, month, type), 0);
    };

    const group1 = groups[0];
    const group2 = groups[1];

    const renderReceitaLiquidaRow = () => {
      return (
        <>
          <tr className="bg-blue-600/50 border-b border-gray-700">
            <td colSpan={months.length + 2} className="p-2 font-bold text-gray-100 sticky left-0">
              RECEITA LIQUIDA
            </td>
          </tr>
          <tr className="bg-blue-900/50 text-white font-semibold">
            <td className="sticky left-0  p-2">Receita Líquida</td>
            {months.map(month => {
              const value =
                getGroupMonthlyTotal(group1.id, month, type) -
                getGroupMonthlyTotal(group2.id, month, type);
              return (
                <td key={month} className="p-1 text-right border-l border-gray-600 pr-3">
                  {formatNumber(value.toFixed(2))}
                </td>
              );
            })}
            <td className="p-1 text-right border-l border-gray-600 pr-3">
              {(
                formatNumber(getGroupTotalAnnual(group1.id, type) - getGroupTotalAnnual(group2.id, type)
              ))}
            </td>
          </tr>
        </>
      );
    };
    const renderEbitdaRow = () => {
      const relevantGroupIds = groups.slice(0, 5).map(g => g.id); // grupos 1 a 5

      const getEbitdaMes = (month: string) => {
        return relevantGroupIds.reduce((total, groupId, index) => {
          const valor = getGroupMonthlyTotal(groupId, month, type);
          return index === 0 ? valor : total - valor;
        }, 0);
      };

      const getEbitdaTotal = () => {
        return months.reduce((total, month) => total + getEbitdaMes(month), 0);
      };

      return (
        <>
          <tr className="bg-blue-600/50 border-b border-gray-700">
            <td colSpan={months.length + 2} className="p-2 font-bold text-gray-100 sticky left-0">
              EBITDA
            </td>
          </tr>
          <tr className="bg-blue-900/50 text-white font-semibold">
            <td className="sticky left-0   p-2">Ebitda</td>
            {months.map(month => (
              <td key={month} className="p-1 text-right border-l border-gray-600 pr-3">
                {formatNumber(getEbitdaMes(month).toFixed(2))}
              </td>
            ))}
            <td className="p-1 text-right border-l border-gray-600 pr-3">
              {formatNumber(getEbitdaTotal().toFixed(2))}
            </td>
          </tr>
        </>
      );
    };

    const resultadoLiquidoRow = () =>{
      const groupWeights = [
        { id: groups[0].id, sign: 1 },  // Grupo 1
        { id: groups[1].id, sign: -1 }, // Grupo 2
        { id: groups[2].id, sign: -1 }, // Grupo 3
        { id: groups[3].id, sign: -1 }, // Grupo 4
        { id: groups[4].id, sign: -1 }, // Grupo 5
        { id: groups[5].id, sign: 1 },  // Grupo 6
        { id: groups[6].id, sign: -1 }, // Grupo 7
        { id: groups[7].id, sign: -1 }, // Grupo 8
      ];

      const getResultadoLiquidoMes = (month: string) => {
        return groupWeights.reduce((total, { id, sign }) => {
          const valor = getGroupMonthlyTotal(id, month, type);
          return total + sign * valor;
        }, 0);
      };
      const getResultadoLiquidoTotal = () => {
        return months.reduce((total, month) => total + getResultadoLiquidoMes(month), 0);
      };

      return (
        <>
          <tr className="bg-blue-600/50 border-b border-gray-700">
            <td colSpan={months.length + 2} className="p-2 font-bold text-gray-100 sticky left-0">
              RESULTADO LIQUIDO
            </td>
          </tr>
          <tr className="bg-blue-900/50 text-white font-semibold">
            <td className="sticky left-0  p-2">Resultado Liquido</td>
            {months.map(month => (
              <td key={month} className="p-1 text-right border-l border-gray-600 pr-3">
                {formatNumber(getResultadoLiquidoMes(month).toFixed(2))}
              </td>
            ))}
            <td className="p-1 text-right border-l border-gray-600 pr-3">
              {formatNumber(getResultadoLiquidoTotal().toFixed(2))}
            </td>
          </tr>
        </>
      );
    };
    

    return (
      <div className="overflow-auto border rounded-md border-gray-700">
        <table className="w-full min-w-[1000px] text-sm border-collapse">
          <thead className="bg-gray-800 text-gray-200 font-semibold">
            <tr>
              <th className="sticky left-0 bg-gray-800 p-3 text-left w-[260px]">Grupo / Conta</th>
              {months.map(month => (
                <th key={month} className="p-2 text-center w-[120px] border-l border-gray-700">
                  <div className="flex flex-col items-center">
                    {type === 'BUDGETED' && (
                      <Button variant="ghost" size="xs" className="p-0 mb-1 h-4 w-4" onClick={() => handleCopyColumn(month, type)}>
                        <Copy size={14} />
                      </Button>
                    )}
                    {month}
                  </div>
                </th>
              ))}
              <th className="p-2 text-center w-[120px] border-l border-gray-700">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <React.Fragment key={group.id}>
                <tr className="bg-gray-800/80 border-b border-gray-700">
                  <td colSpan={months.length + 2} className="p-2 font-bold text-gray-100 sticky left-0">
                    {group.cod} - {group.name}
                  </td>
                </tr>

                {/* Linha de total do grupo */}
                <tr className="bg-gray-700 text-gray-100 font-semibold">
                  <td className="sticky left-0 bg-gray-700 p-2">Total do grupo</td>
                  {months.map(month => (
                    <td key={month} className="p-1 text-right border-l border-gray-600 pr-3">
                      {formatNumber(getGroupMonthlyTotal(group.id, month, type).toFixed(2))}
                    </td>
                  ))}
                  <td className="p-1 text-right border-l border-gray-600 pr-3">
                    {formatNumber(getGroupTotalAnnual(group.id, type).toFixed(2))}
                  </td>
                </tr>

                {/* Contas do grupo */}
                {group.accounts.map(account => (
                  <tr key={account.id} className="bg-gray-900 hover:bg-gray-800 text-gray-300">
                    <td className="sticky left-0 bg-gray-900 p-2">{account.cod} - {account.name}</td>
                    {months.map(month => (
                      <td key={month} className="p-1 text-center border-l border-gray-700">
                        <input
                          type="number"
                          step="0.01"
                          value={getValue(account.id, month, type)}
                          onChange={e => handleChange(account.id, month, e.target.value, type)}
                          className="w-24 px-2 py-1 rounded bg-gray-800 text-right text-gray-100 border border-gray-600 focus:ring-white/50 focus:outline-none"
                        />
                      </td>
                    ))}
                    <td className="p-1 text-right border-l border-gray-700 pr-3 font-medium text-gray-100">
                      {formatNumber(getTotalValueByAccount(account.id, type).toFixed(2))}
                    </td>
                  </tr>
                ))}

                {/* Inserir EBITDA entre grupo 2 e grupo 3 */}
                {index === 1 && renderReceitaLiquidaRow()}
                {index === 4 && renderEbitdaRow()}
                {index === groups.length - 1 && resultadoLiquidoRow()}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!data) return <p className="text-gray-400">Carregando orçamento...</p>;

  return (
    <>
      <Button variant="outline" className="mb-4 flex gap-2 items-center" onClick={() => navigate("/orcamentos")}>
        <ArrowLeft className="w-4 h-4" /> Retornar
      </Button>

      <div className="space-y-6">
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-100">{data.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Building2 className="text-blue-400 w-5 h-5" /> {enterprise?.corporateName}</div>
                <div className="flex items-center gap-2"><Calendar className="text-green-400 w-5 h-5" /> Ano {data.year}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleSave}><Pencil size={14} /> Salvar</Button>
                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm"><Trash size={14} /> Excluir</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <p>Tem certeza que deseja excluir o orçamento <strong>{data.name}</strong>?</p>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={handleDelete}>Confirmar Exclusão</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="BUDGETED">
          <TabsList className="grid grid-cols-2 bg-gray-800 border border-gray-700 rounded overflow-hidden">
            <TabsTrigger value="BUDGETED" className="data-[state=active]:bg-blue-600/30 text-gray-400 data-[state=active]:text-blue-300">Orçado</TabsTrigger>
            <TabsTrigger value="CARRIED" className="data-[state=active]:bg-green-600/30 text-gray-400 data-[state=active]:text-green-300">Realizado</TabsTrigger>
          </TabsList>

          <TabsContent value="BUDGETED" className="mt-4">{renderTable("BUDGETED")}</TabsContent>
          <TabsContent value="CARRIED" className="mt-4">{renderTable("CARRIED")}</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
