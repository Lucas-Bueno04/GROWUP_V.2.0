
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { IndicadorDialog } from './components/IndicadorDialog';
import { IndicadoresTable } from './components/IndicadoresTable';
import { LoadingState, ErrorState } from './components/IndicadoresStates';
import { useIndicadorReplication } from '@/hooks/plano-contas/useIndicadorReplication';
import { useOrcamentoIndicadores } from '@/hooks/plano-contas/useOrcamentoIndicadores';
import { IndicatorRequest } from '../interfaces/IndicadorRequest'; 
import { IndicatorResponse } from '../interfaces/IndicadorResponse';
import { JwtService } from "@/components/auth/GetAuthParams";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();


const createIndicador = async(data:IndicatorRequest, token:string):Promise<void>=>{
  const response = await axios.post(`${API_KEY}/indicator/admin-indicator/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getAllAdminIndicators = async(token:string):Promise<IndicatorResponse[]>=>{
  const response = await axios.get(`${API_KEY}/indicator/admin-indicator`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data
}

const deleteById = async (id:number, token:string):Promise<void>=>{
  const response = await axios.delete(`${API_KEY}/indicator/admin-indicator/delete/by-id/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


export function PlanoContasIndicadores() {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [indicadores, setIndicadores] = useState<IndicatorResponse[]>([]);

  const fetchData = async()=>{
    const token = await jwtService.getToken();
      
    const indicadoresList = await getAllAdminIndicators(token);

    setIndicadores(indicadoresList)
  };
  
  useEffect(()=>{
    fetchData();
  },[])

  const handleCreate = async(data:IndicatorRequest)=>{
    try{
      const token = await jwtService.getToken();
      await createIndicador(data, token);
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

  // Se estiver carregando ou se houver erro externo
  if (loading) {
    return <LoadingState isLoading={true} />;
  }

  // Se houver erro
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <IndicadorDialog onSave={handleCreate} />
          </div>
        </div>
        
        <IndicadoresTable indicadores={indicadores} onDelete={handleDelete}  />
      </CardContent>
    </Card>
  );
}
