
import React, { useEffect, useState } from 'react';
import { AnaliseOrcamentariaEmpresaHeader } from '@/components/analise-orcamentaria/AnaliseOrcamentariaEmpresaHeader';
import { ExecutiveSummaryCards } from '@/components/analise-orcamentaria/ExecutiveSummaryCards';
import { BudgetComparisonCharts } from '@/components/analise-orcamentaria/BudgetComparisonCharts';
import { HierarchicalAnalysisTable } from '@/components/analise-orcamentaria';
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria/types';
import { useParams, useNavigate, useAsyncError } from 'react-router-dom';
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Budget } from '@/components/interfaces/Budget';
import { ResultRequest } from '@/components/interfaces/ResultRequest'; 
import { FormulaRequest } from '@/components/interfaces/FormulaRequest'; 
import BudgetEditor from '@/pages/BudgetComponent';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();


const getBudgetById = async (email:string, id:number, token:string):Promise<Budget>=>{
  const response = await axios.get(`${API_KEY}/budget/by-email-id/${email}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}


const getEvaluatedData = async (
  budgetId: number,
  token: string,
  data: FormulaRequest,
): Promise<ResultRequest> => {
  const response = await axios.post(
    `${API_KEY}/analist/formula/evaluate/${budgetId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


export default function AnaliseOrcamentariaContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget>(null);
  const [loading, setLoading] = useState(false);
  const [meses, setMeses] = useState<string[]>([]);
  const [receitaRealizada, setReceitaRealizada] = useState(0);
  const [receitaOrcada, setReceitaOrcada] = useState(0);
  const [ebitdaRealizado, setebitdaRealizado] = useState(0);
  const [ebitdaOrcado, setebitdaOrcado] = useState(0);
  
  useEffect(() => {
    console.log("useEffect executou com id =", id);

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await jwtService.getToken() || '';
        const email = await jwtService.getClaim("sub") as string;
        const budgetData = await getBudgetById(email, Number(id), token);
        setBudget(budgetData);
      } catch (error) {
        console.error("Erro ao buscar budget:", error);
      }finally{
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);


  useEffect(()=>{
    const fetchData = async()=>{
      const receitaFormula = "G_1-G_2";
      const ebidtaFormula = "G_1-G_2-G_3-G-4-G_5-G_6";
      const token = await jwtService.getToken();
      const receitaRequest:FormulaRequest={
        formula:receitaFormula,
        months:meses
      }
      const receitaResponse = await getEvaluatedData(budget.id,token, receitaRequest )

      const ebitdaRequest:FormulaRequest={
        formula:ebidtaFormula,
        months:meses
      }
      const ebidtaResponse = await getEvaluatedData(budget.id,token, receitaRequest )

      setReceitaRealizada(receitaResponse.carriedResult)
      setReceitaOrcada(receitaResponse.budgetedResult)
      setebitdaRealizado(ebidtaResponse.carriedResult)
      setebitdaOrcado(ebidtaResponse.budgetedResult)
    };

    fetchData();

  }, [meses])



  return (
    <>
      <Button variant="outline" className="mb-4 flex gap-2 items-center" onClick={() => navigate("/gestao/analise-orcamentaria")}>
        <ArrowLeft className="w-4 h-4" /> Retornar
      </Button>

      {loading ? (
        <p>Carregando header...</p>
        ) : (
          <AnaliseOrcamentariaEmpresaHeader
            setMeses = {setMeses} 
            budgetName={budget?.name||""}
            selectedYear={budget?.year|| 0}
          /> 
      )}

      {loading ? (
        <p>Carregando cards de resumo...</p>
        ) : (
          <ExecutiveSummaryCards 
            receitaOrcada={receitaOrcada*meses.length}
            receitaRealizada={receitaRealizada*meses.length}
            ebitdaOrcado={ebitdaOrcado*meses.length}
            ebidtaRealizado={ebitdaRealizado*meses.length }
            mes={meses[meses.length - 1]}
          />
      )}

      {loading ? (
        <p>Carregando cards de resumo...</p>
        ) : (
          <BudgetComparisonCharts isLoading={loading} budgetId={Number(id)} months={meses}  />
      )}

      {loading ? (
        <p>Carregando cards de resumo...</p>
        ) : (
          <HierarchicalAnalysisTable months={meses}  budgetId={Number(id)}/>
      )}
      
      
    </>
  );
}
