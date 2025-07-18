import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Trash2, ArrowLeft } from 'lucide-react';
import { JwtService } from "@/components/auth/GetAuthParams";
import { Group } from '@/components/interfaces/Group';
import { Budget } from '@/components/interfaces/Budget';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Enterprise } from '@/components/interfaces/Enterprise';
import { toast } from "sonner";
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const months = [
  "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL",
  "MAIO", "JUNHO", "JULHO", "AGOSTO",
  "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

const getBudgetById = async (id: number,email:string,  token: string): Promise<Budget> => {
  const response = await axios.get(`${API_KEY}/budget/by-email-id/${email}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getGroups = async (token: string): Promise<Group[]> => {
  const response = await axios.get(`${API_KEY}/group`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getEnterpriseById = async (id: number, token: string): Promise<Enterprise> => {
  const response = await axios.get(`${API_KEY}/enterprise/by-enterpriseId/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const deleteBudgetById = async(id:number, token:string):Promise<void> => {
  await axios.delete(`${API_KEY}/budget/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateBudget = async (budget:Budget, token:string):Promise<void> => {
  await axios.put(`${API_KEY}/budget/update`, budget, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

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
      const groupsData = await getGroups(token);
      const budgetData = await getBudgetById(Number(id), email, token);
      setGroups(groupsData);
      setData(budgetData);

      if (budgetData.enterpriseId) {
        const enterpriseData = await getEnterpriseById(budgetData.enterpriseId, token);
        setEnterprise(enterpriseData);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const getValue = (accountId: number, month: string, type: string) => {
    const monthData = data?.months.find(m => m.month === month);
    if (!monthData) return '';
    const valueEntry = monthData.values.find(
      v => v.accountId === accountId && v.valueType === type
    );
    return valueEntry ? valueEntry.value : '';
  };

  const handleChange = (accountId: number, month: string, value: string, type: string) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data)); // Deep copy para preservar estrutura
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

  const handleSave = async()=> {
    console.log(data);
    try{
      const token = await jwtService.getToken();
      await updateBudget(data, token);
      toast({ title: "Orçamento Atualizado", description: "Orçamento atualizado com sucesso!." });

    }catch(error){
      console.log("Erro:", error);
      toast({ title: "Erro ao atualizar orçamento", description: error });
    }
  };

  const handleDelete = async () => {
    try {
      setOpenDeleteDialog(false);
      const token = await jwtService.getToken();
      await deleteBudgetById(Number(id), token);
      toast({ title: "Orçamento excluído", description: "Orçamento excluído com sucesso." });
      navigate("/orcamentos");
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o orçamento." });
      console.error("Erro ao excluir orçamento", error);
    }
  };

  const styleMap = {
    BUDGETED: { inputBorder: 'border-gray-500' },
    CARRIED: { inputBorder: 'border-gray-500' }
  };

  const renderTable = (type: string) => {
    const style = styleMap[type as keyof typeof styleMap];

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
            {groups.map(group => (
              <React.Fragment key={group.id}>
                <tr className={`bg-gray-800/80 border-b border-gray-700`}>
                  <td colSpan={months.length + 1} className="sticky left-0 p-2 font-bold text-gray-100">
                    {group.cod} - {group.name}
                  </td>
                </tr>
                {group.accounts.map(account => (
                  <tr
                    key={account.id}
                    className="bg-gray-900 hover:bg-gray-800 text-gray-300"
                  >
                    <td className="sticky left-0 bg-gray-900 p-2 border-r border-gray-700">
                      {account.cod} - {account.name}
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
                          className={`w-24 px-2 py-1 rounded bg-gray-800 text-right text-gray-100 border ${style.inputBorder} focus:outline-none focus:ring-1 focus:ring-white/50`}
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

  if (!data) return <p className="text-gray-400">Carregando orçamento...</p>;

  return (
    <>
      <Button
        variant="outline"
        className="mb-4 flex items-center gap-2 w-max"
        onClick={() => navigate("/orcamentos")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retornar
      </Button>

      <div className="space-y-6">
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-100">{data.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col space-y-2 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  <span>{enterprise?.corporateName || 'Empresa não encontrada'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>Ano {data.year}</span>
                </div>
              </div>

              {/* Botões Salvar e Excluir lado a lado */}
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleSave}
                >
                  <Pencil size={14} className="h-4 w-4" />
                  Salvar
                </Button>

                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center gap-2">
                      <Trash size={14} className="h-4 w-4" />
                      Excluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <p>Tem certeza que deseja excluir o orçamento  <strong>{data.name || data.id}</strong>?</p>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Confirmar Exclusão
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

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
