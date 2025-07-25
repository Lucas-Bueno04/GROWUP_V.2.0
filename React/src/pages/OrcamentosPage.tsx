import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { OrcamentoBudgetCard } from '@/components/orcamento/OrcamentoBudgetCard';
import { JwtService } from "@/components/auth/GetAuthParams";
import { BudgetRequest } from '@/components/interfaces/BudgetRequest';
import { Account } from '@/components/interfaces/Account';
import { Enterprise } from '@/components/interfaces/Enterprise';
import axios from 'axios';
import { Group } from '@/components/interfaces/Group';
import { Budget } from '@/components/interfaces/Budget';
import { AccountValue } from '@/components/interfaces/AccountValue';
import { MonthBudget } from '@/components/interfaces/MonthBudget';
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getAllByEmail = async (email: string, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_KEY}/budget/by-email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllEnterprisesByEmail = async (email: string, token: string): Promise<Enterprise[]> => {
  const response = await axios.get(`${API_KEY}/enterprise/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};


const getAllGroupsWithAccounts = async(token:string):Promise<Group[]>=>{
  const response = await axios.get(`${API_KEY}/group`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

const createNewBudget = async (newBudget: BudgetRequest, token: string): Promise<void> => {
  await axios.post(`${API_KEY}/budget/create`, newBudget, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


function criarBudgetRequest(
  contas: Account[],
  enterpriseId: number,
  name: string,
  year: number
): BudgetRequest {
  // Lista de meses em português
  const meses = [
    "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
  ];

  // Criar MonthBudget para cada mês
  const months: MonthBudget[] = meses.map((mes) => {
    const values: AccountValue[] = contas.flatMap((conta) => [
      {
        accountId: conta.id,
        valueType: "BUDGETED",
        value: 0
      },
      {
        accountId: conta.id,
        valueType: "CARRIED",
        value: 0
      }
    ]);

    return {
      month: mes,
      values
    };
  });

  return {
    name,
    enterpriseId,
    year,
    months
  };
}


export default function OrcamentosPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [budgetName, setBudgetName] = useState("");
  const [budgetYear, setBudgetYear] = useState<number>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = jwtService.getToken();
      const email = jwtService.getClaim("sub") as string;

      const [budgetListData, enterpriseList] = await Promise.all([
        getAllByEmail(email, token),
        getAllEnterprisesByEmail(email, token),
      ]);

      setBudgets(budgetListData);
      setEnterprises(enterpriseList);
    };

    fetchData();
  }, []);

  const handleSelect = (id: number) => {
    navigate(`/orcamentos/${id}`);
  };

  const handleDialogOpen = (isOpen:boolean)=>{
    setOpen(isOpen);
  }

  const handleCreateBudget = async () => {
      console.log("handle create budget inicizalido")
      if (!budgetName || !selectedEnterpriseId) {
        toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" });
        return;
      }
  
      try {
        const token = jwtService.getToken();
        const email = jwtService.getClaim("sub") as string;
  
        const groups = await getAllGroupsWithAccounts(token);

        const contas: Account[] = groups.flatMap(group => group.accounts);
  
        const budgetRequest = criarBudgetRequest(contas, selectedEnterpriseId, budgetName, budgetYear);
        console.log(budgetRequest)
        await createNewBudget(budgetRequest, token);

        setOpen(false);
  
        toast({ title: "Sucesso", description: "Orçamento criado com sucesso!" });
  
        const updatedBudgets = await getAllByEmail(email, token);
        setBudgets(updatedBudgets);
        setBudgetName('');
        setSelectedEnterpriseId(null);
      } catch (err) {
        toast({ title: "Erro", description: "Não foi possível criar o orçamento", variant: "destructive" });
      }
    };

    

  return (
    <>
      <Helmet>
        <title>Orçamentos</title>
      </Helmet>
      <div className="container mx-auto py-6 space-y-4">
        <Header
          title="Orçamentos"
          description="Gerencie orçamentos e acompanhe a performance financeira das empresas"
        />

        <Dialog open = {open} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo orçamento</DialogTitle>
              <DialogDescription>
                Preencha as informações para o cadastro do orçamento.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="enterprise">Empresa</Label>
                <Select
                  onValueChange={(value) => setSelectedEnterpriseId(Number(value))}
                  value={selectedEnterpriseId?.toString() || ""}
                >
                  <SelectTrigger className="bg-white text-black border border-gray-300">
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {enterprises.map((enterprise) => (
                      <SelectItem
                        key={enterprise.id}
                        value={enterprise.id.toString()}
                        className="text-black hover:bg-gray-100"
                      >
                        {enterprise.corporateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget-name">Nome do orçamento</Label>
                <Input
                  id="budget-name"
                  placeholder="Ex: Orçamento 2025"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget-name">Ano do orçamento</Label>
                <Input
                  id="budget-name"
                  placeholder="Ex: 2026"
                  value={budgetYear}
                  onChange={(e) => setBudgetYear(Number(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateBudget}>Criar orçamento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <OrcamentoBudgetCard key={budget.id} orcamento={budget} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </>
  );
}
