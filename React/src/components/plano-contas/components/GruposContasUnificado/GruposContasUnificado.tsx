import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group, Plus, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OrcamentoGrupo, OrcamentoConta } from '@/types/orcamento.types';
import { TipoCalculo, TipoSinal } from '@/types/plano-contas.types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FormDialog } from './FormDialog';
import { GrupoCard } from './GrupoCard';
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService  = new JwtService();

interface Account {
  id: number;
  cod: string;
  name: string;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  accounts: Account[];
  // ordem?: number; // Descomente se estiver usando 'ordem' para ordenação
}

export interface AccountDTO {
  id?: number;
  cod: string;
  name: string;
  group: {
    id: number;
  };
}
interface GroupCreateDTO{
  cod:string;
  name:string,
  accounts: Account[]
}



const getAllGroupsWithAccount = async (token:string): Promise<Group[]> => {
  const response = await axios.get(`${API_KEY}/group`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
};

const deleteGroupById = async (id:number,token:string): Promise<void> =>{
  const response = await axios.delete(`${API_KEY}/group/delete/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

const deleteAccountById = async(id:number,token:string):Promise<void>=>{
  const response = await axios.delete(`${API_KEY}/account/delete/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

const updateGroup = async(id:number, group:Group,token:string):Promise<Group>=>{
  const response = await axios.put(`${API_KEY}/group/update/${id}`,group,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })

  return response.data;
}

const updateAccount = async(id:number, account:Account,token:string):Promise<Account>=>{
  const response = await axios.put(`${API_KEY}/account/update/${id}`, account, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}

const createGroup = async(group:GroupCreateDTO,token:string):Promise<Group>=>{
  const response = await axios.post(`${API_KEY}/group/create`, group, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}

const createAccount = async (account: AccountDTO,token:string):Promise<Account>=>{
  const response = await axios.post(`${API_KEY}/account/create`,account,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}

export function GruposContasUnificado() {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [token, setToken] = useState(null);




  const fetchData = async () => {
    try {
      const token =await jwtService.getToken()
      setToken(token)
      const groups = await getAllGroupsWithAccount(token)
      setGroups(groups);
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const handleNewConta = async (groupId: number) => {
    try {
      const newAccount: AccountDTO = {
        cod: "",
        name: "",
        group:{
          id:groupId
        },
      };
      const token = jwtService.getToken()
      await createAccount(newAccount, token);
      await fetchData();
      toast({ title: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  const handleEditGrupo = async (group: Group) => {
    try {
      await updateGroup(group.id, group,token);
      await fetchData();
      toast({ title: "Grupo atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao editar grupo:", error);
    }
  };

  const handleDeleteGrupo = async (groupId: number) => {
    try {
      await deleteGroupById(groupId,token);
      await fetchData();
      toast({ title: "Grupo deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
    }
  };

  const handleEditConta = async (account: Account) => {
    try {
      await updateAccount(account.id, account,token);
      await fetchData();
      toast({ title: "Conta atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao editar conta:", error);
    }
  };

  const handleDeleteConta = async (accountId: number) => {
    try {
      await deleteAccountById(accountId,token);
      await fetchData();
      toast({ title: "Conta deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  const onAddGroup = async () => {
    try {
      const newGroup: GroupCreateDTO = {
        cod: "",
        name: "",
        accounts: [],
      };
      await createGroup(newGroup,token);
      await fetchData();
      toast({ title: "Grupo criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const handleReloadPage = () => {
    window.location.reload();
  };
  

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciamento da Estrutura DRE
            </CardTitle>
            <CardDescription>
              Configure grupos e contas da estrutura DRE para escritórios contábeis.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddGroup}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Grupo
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {groups
            .map((group) => {
              return (
                <GrupoCard
                  key={group.id}
                  group={group}
                  onNewConta={handleNewConta}
                  onEditGrupo={handleEditGrupo}
                  onDeleteGrupo={handleDeleteGrupo}
                  onEditConta={handleEditConta}
                  onDeleteConta={handleDeleteConta}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
