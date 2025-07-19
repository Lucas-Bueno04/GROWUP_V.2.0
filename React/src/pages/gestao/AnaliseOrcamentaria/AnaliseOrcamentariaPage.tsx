import React, { useEffect , useState} from 'react';
import { Header } from '@/components/layout/Header';
import { AnaliseOrcamentariaControls } from '@/components/analise-orcamentaria/AnaliseOrcamentariaControls';
import AnaliseOrcamentariaContent  from './components/AnaliseOrcamentariaContent';
import { AnaliseOrcamentariaLoadingState } from './components/AnaliseOrcamentariaLoadingState';
import { AnaliseOrcamentariaErrorState } from './components/AnaliseOrcamentariaErrorState';
import { AnaliseOrcamentariaEmptyState } from './components/AnaliseOrcamentariaEmptyState';
import { AnaliseOrcamentariaProfileErrorState } from './components/AnaliseOrcamentariaProfileErrorState';
import { useAnaliseOrcamentariaState } from './hooks/useAnaliseOrcamentariaState';
import { formatCurrency, getVarianceVariant, getCumulativeData } from './utils/analiseOrcamentariaUtils';
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { Budget } from '@/components/interfaces/Budget';
import { OrcamentoBudgetCard } from '@/components/orcamento/OrcamentoBudgetCard';
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const anoAtual = new Date().getFullYear();

const getAllByEmail = async (email: string, token: string): Promise<Budget[]> => {
  const response = await axios.get(`${API_KEY}/budget/by-email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default function AnaliseOrcamentariaPage() {

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
      const fetchData = async () => {
        const token = jwtService.getToken();
        const email = jwtService.getClaim("sub") as string;
    
        const budgetListData= await getAllByEmail(email, token);
        setBudgets(budgetListData);
      };
    
      fetchData();
    }, []);
  
    const handleSelect = (id:number)=>{
      navigate(`/gestao/analise-orcamentaria/${id}`)
  }
  
  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header 
          title="Análise Orçamentária" 
          description="Análise da performance financeira comparando valores orçados com realizados"
          colorScheme="blue"
        />
        
        <div className="space-y-6">

        {/* Texto explicativo */}
        <div className="mb-4 text-lg font-medium text-gray-700">
          Selecione o orçamento que deseja analisar:
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgets.map((budget) => (
                <OrcamentoBudgetCard key={budget.id} orcamento={budget} onSelect={handleSelect} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
