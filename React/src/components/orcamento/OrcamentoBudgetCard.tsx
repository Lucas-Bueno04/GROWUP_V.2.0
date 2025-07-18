
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, User } from 'lucide-react';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';
import { Budget } from '../interfaces/Budget';
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from 'axios';
import { Enterprise } from '@/components/interfaces/Enterprise';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

interface OrcamentoBudgetCardProps {
  orcamento: Budget;
  onSelect: (id: number) => void;
}

const getEnterpriseById = async (id: number, token: string): Promise<Enterprise> => {
  const response = await axios.get(`${API_KEY}/enterprise/by-enterpriseId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  return response.data;
}

export function OrcamentoBudgetCard({ orcamento, onSelect }: OrcamentoBudgetCardProps) {

  const [enterprise, setEnterprise] = useState<Enterprise|null>(null);


  useEffect(()=>{
    const fetchData = async()=>{
      const token = jwtService.getToken();
      const enterpriseData = await getEnterpriseById(orcamento.enterpriseId, token);
      console.log(enterpriseData)
      setEnterprise(enterpriseData);
    };
    if(orcamento?.enterpriseId){
      fetchData();
    }    
  },[orcamento.enterpriseId])


  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{orcamento.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{enterprise?.tradeName||enterprise?.corporateName || 'Empresa não encontrada'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Ano {orcamento.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Plano de Contas: DRE Padrão</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4"
          onClick={() => onSelect(orcamento.id)}
        >
          Abrir Orçamento
        </Button>
      </CardContent>
    </Card>
  );
}
