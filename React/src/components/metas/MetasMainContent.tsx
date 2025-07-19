
import React, {  useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Target, Calculator } from "lucide-react";
import { MetasIndicadoresTable } from './MetasIndicadoresTable';
import { IndicadoresPropriosTable } from './IndicadoresPropriosTable';
import { MetasIndicadoresDialog } from './MetasIndicadoresDialog';
import { IndicadorProprioDialog } from './IndicadorProprioDialog';
import { MetaIndicadorCompleta, MetaIndicadorEmpresaCompleta, IndicadorEmpresa } from '@/types/metas.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { JwtService } from "@/components/auth/GetAuthParams";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { IndicatorRequest } from '../interfaces/IndicadorRequest'; 
import { IndicatorResponse } from '../interfaces/IndicadorResponse';
import { IndicadorDialog } from '../plano-contas/components';
import { IndicadoresTable } from '../plano-contas/components';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();


const getAllAdminIndicators = async(token:string):Promise<IndicatorResponse[]>=>{
  const response = await axios.get(`${API_KEY}/indicator/admin-indicator`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data
}


const getAllUserIndicators = async(email:string , token:string):Promise<IndicatorResponse[]>=>{
  const response = await axios.get(`${API_KEY}/indicator/user-indicator/by-user-email/${email}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data
}


const createIndicador = async(email:string, data:IndicatorRequest, token:string):Promise<void>=>{
  const response = await axios.post(`${API_KEY}/indicator/user-indicator/create/${email}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const deleteById = async (id:number, token:string):Promise<void>=>{
  const response = await axios.delete(`${API_KEY}/indicator/user-indicator/delete/by-id/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function MetasMainContent() {
  
  const[indicadores, setIndicadores] = useState<IndicatorResponse[]>([]);
  const [indicadoresProprios, setIndicadoresProprios] = useState<IndicatorResponse[]>([]);

  const fetchData = async()=>{
    const token = await jwtService.getToken();
    const email = await jwtService.getClaim("sub") as string ;
    const indicadoresProriosList = await getAllUserIndicators(email, token);
    const indicadoresList = await getAllAdminIndicators(token);

    setIndicadores(indicadoresList)
    setIndicadoresProprios(indicadoresProriosList)
  };

  useEffect(()=>{
      fetchData();
    },[])
  

  const renderMelhorQuando = (melhorQuando: string) => {
    const isMaior = melhorQuando === 'maior';
    return (
      <Badge variant={isMaior ? "default" : "secondary"} className="flex items-center gap-1">
        {isMaior ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isMaior ? 'Maior' : 'Menor'}
      </Badge>
    );
  };

  const handleCreate = async(data:IndicatorRequest)=>{
      try{
        const token = await jwtService.getToken();
        const email = await jwtService.getClaim("sub") as string;
        await createIndicador(email, data, token);
        toast({ title: "Indicador", description: "Indicador criado com sucesso" });
        fetchData()
      }catch(error){
        console.log("erro:", error);
        toast({ title: "Indicador", description: "Erro ao criar indicador" });
      }
  }
  
  const handleDelete = async(id:number)=>{
      try{
        const token = await jwtService.getToken();
        await deleteById(id, token)
        toast({ title: "Indicador", description: "Indicador excluido com sucesso" });
        fetchData()
      }catch(error){
        console.log("erro:", error);
        toast({ title: "Indicador", description: "Erro ao excluir Indicador" });
      }
  }

  return (
    <Tabs defaultValue="plano-contas" className="space-y-6">
      <TabsList>
        <TabsTrigger value="plano-contas">Indicadores do Plano de Contas</TabsTrigger>
        <TabsTrigger value="proprios">Meus Indicadores</TabsTrigger>
      </TabsList>

      <TabsContent value="plano-contas">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Indicadores do Plano de Contas</h3>
          </div>
          <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-40">Fórmula</TableHead>
                      <TableHead className="w-24">Unidade</TableHead>
                      <TableHead className="w-40">Melhor Quando</TableHead>
                      <TableHead className="w-24">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {indicadores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum indicador cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      indicadores.map((indicador) => (
                        <TableRow key={indicador.id}>
                          <TableCell className="font-mono text-sm">{indicador.cod}</TableCell>
                          <TableCell className="font-medium">{indicador.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {indicador.description}
                          </TableCell>
                          <TableCell className="font-mono text-xs bg-muted/50 rounded px-2 py-1">
                            {indicador.formula}
                          </TableCell>
                          <TableCell>{indicador.unity}</TableCell>
                          <TableCell>{renderMelhorQuando(indicador.betterWhen || 'maior')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
        </div>
      </TabsContent>

      <TabsContent value="proprios">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Meus Indicadores</h3>
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  <IndicadorDialog onSave={handleCreate} />
                </div>
              </div>
          </div>
          <IndicadoresTable indicadores={indicadoresProprios} onDelete={handleDelete}  />
        </div>
      </TabsContent>
    </Tabs>
  );
}
