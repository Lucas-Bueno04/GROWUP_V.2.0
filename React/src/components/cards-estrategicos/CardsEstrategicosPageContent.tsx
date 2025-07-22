import React, { useEffect, useState } from 'react';
import { CardsEstrategicosEmpresaHeader } from './CardsEstrategicosEmpresaHeader';
import { CardsEstrategicosStats } from './CardsEstrategicosStats';
import { CardsEstrategicosContent } from './CardsEstrategicosContent';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { IndicatorResponse } from '../interfaces/IndicadorResponse';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getAllAdminIndicators = async (token: string): Promise<IndicatorResponse[]> => {
  const response = await axios.get(`${API_KEY}/indicator/admin-indicator`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getAllUserIndicators = async (email: string, token: string): Promise<IndicatorResponse[]> => {
  const response = await axios.get(`${API_KEY}/indicator/user-indicator/by-user-email/${email}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getBudgetNameById = async (id: number, token: string): Promise<string> => {
  const response = await axios.get(`${API_KEY}/budget/by-id/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export function CardsEstrategicosPageContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    acima: 0,
    dentro: 0,
    abaixo: 0,
  });

  const [indicadoresPlanoDeContas, setIndicadoresPlanoDeContas] = useState<IndicatorResponse[]>([]);
  const [indicadoresPessoais, setIndicadoresPessoais] = useState<IndicatorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [budgetName, setBudgetName] = useState<string | null>(null);
  const [meses, setMeses] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await jwtService.getToken() || '';
        const email = await jwtService.getClaim("sub") as string || '';

        if (id) {
          const budgetId = Number(id);

          // Executa todas as requisições em paralelo
          const [nomeOrcamento, indicadoresAdmin, indicadoresUser] = await Promise.all([
            getBudgetNameById(budgetId, token),
            getAllAdminIndicators(token),
            getAllUserIndicators(email, token),
          ]);

          setBudgetName(nomeOrcamento);
          setIndicadoresPlanoDeContas(indicadoresAdmin);
          setIndicadoresPessoais(indicadoresUser);
        }
      } catch (error) {
        console.error("Erro ao carregar dados dos cards estratégicos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="mb-4 flex gap-2 items-center"
        onClick={() => navigate("/gestao/cards-estrategicos")}
      >
        <ArrowLeft className="w-4 h-4" /> Retornar
      </Button>

      <CardsEstrategicosEmpresaHeader budgetName={budgetName} setMeses={setMeses} />

      <CardsEstrategicosStats stats={stats} />

      {loading ? (
        <p>Carregando indicadores...</p>
      ) : (
        <CardsEstrategicosContent
          indicadoresPlanoDeContas={indicadoresPlanoDeContas}
          indicadoresPessoais={indicadoresPessoais}
          id={Number(id)}
          meses={meses}
          setStats={setStats}
        />
      )}
    </div>
  );
}
