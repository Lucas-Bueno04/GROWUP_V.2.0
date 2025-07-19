import React, { useEffect, useState } from 'react';
import { StrategicCard } from '@/components/cards-estrategicos';
import { IndicatorResponse } from '../interfaces/IndicadorResponse';
import { ResultRequest } from '../interfaces/ResultRequest';
import { FormulaRequest } from '../interfaces/FormulaRequest';
import { JwtService } from '@/components/auth/GetAuthParams';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

interface CardsEstrategicosContentProps {
  indicadoresPlanoDeContas: IndicatorResponse[];
  indicadoresPessoais: IndicatorResponse[];
  meses: string[];
  id: number;  // budgetId
  setStats: React.Dispatch<React.SetStateAction<{
    total: number,
    acima: number,
    dentro: number,
    abaixo: number,
  }>>;
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

export function CardsEstrategicosContent({
  indicadoresPlanoDeContas,
  indicadoresPessoais,
  meses,
  id,
  setStats,
}: CardsEstrategicosContentProps) {
  
  const [loading, setLoading] = useState(true);

  // Guarda resultados indexados por indicadorId
  const [resultados, setResultados] = useState<Record<number, ResultRequest>>({});

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = await jwtService.getToken();
        if (!token) throw new Error("Token não encontrado");

        // Função para buscar resultado de um indicador
        const fetchResult = async (indicador: IndicatorResponse) => {
          const data: FormulaRequest = {
            formula: indicador.formula,
            months: meses,
          };
          try {
            const response = await getEvaluatedData(id, token, data);
            return { id: indicador.id, result: response, error: false };
          } catch (error) {
            console.warn(`Erro avaliando fórmula do indicador ${indicador.id}`, error);
            return { id: indicador.id, result: null, error: true };
          }
        };

        // Avalia todos indicadores (Plano de Contas)
        const resultsPlanoDeContas = await Promise.all(
          indicadoresPlanoDeContas.map(fetchResult)
        );

        // Avalia todos indicadores (Pessoais)
        const resultsPessoais = await Promise.all(
          indicadoresPessoais.map(fetchResult)
        );

        // Junta todos resultados em um só array
        const allResults = [...resultsPlanoDeContas, ...resultsPessoais];

        // Filtra só os resultados válidos (sem erro)
        const validResults = allResults.filter(r => !r.error && r.result !== null);

        // Mapeia resultados para objeto { indicadorId: result }
        const resultadosMap: Record<number, ResultRequest> = {};
        validResults.forEach(({ id, result }) => {
          if(result) resultadosMap[id] = result;
        });

        setResultados(resultadosMap);

        // Calcula stats
        let acima = 0;
        let dentro = 0;
        let abaixo = 0;

        const calculaStatus = (result: ResultRequest) => {
          if (result.carriedResult > result.budgetedResult) return 'acima';
          if (result.carriedResult < result.budgetedResult) return 'abaixo';
          return 'dentro';
        };

        validResults.forEach(({ result }) => {
          if (!result) return;
          const status = calculaStatus(result);
          if (status === 'acima') acima++;
          else if (status === 'abaixo') abaixo++;
          else dentro++;
        });

        // Atualiza stats no componente pai
        setStats({
          total: validResults.length,
          acima,
          dentro,
          abaixo,
        });

      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
        // Se der erro, zera stats
        setStats({ total: 0, acima: 0, dentro: 0, abaixo: 0 });
      } finally {
        setLoading(false);
      }
    };

    if (meses.length > 0) {
      fetchResults();
    }
  }, [meses, indicadoresPlanoDeContas, indicadoresPessoais, id, setStats]);

  const calculaStatus = (result?: ResultRequest) => {
    if (!result) return 'indefinido';
    if (result.carriedResult > result.budgetedResult) return 'acima';
    if (result.carriedResult < result.budgetedResult) return 'abaixo';
    return 'dentro';
  };

  return (
    <div className="space-y-6">
      {loading && <p>Carregando indicadores...</p>}

      {!loading && indicadoresPlanoDeContas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h3 className="text-lg font-semibold">Indicadores do Plano de Contas</h3>
            <span className="text-sm text-muted-foreground">
              ({indicadoresPlanoDeContas.length})
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicadoresPlanoDeContas.map((indicador) => {
              const result = resultados[indicador.id];
              if (!result) return null; // Não renderiza card com erro ou sem resultado
              const status = calculaStatus(result);
              return (
                <StrategicCard
                  key={indicador.id}
                  indicadorEstrategico={indicador}
                  result={result}
                  status={status}
                  tipo='plano-contas'
                />
              );
            })}
          </div>
        </div>
      )}

      {!loading && indicadoresPessoais.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h3 className="text-lg font-semibold">Indicadores Pessoais</h3>
            <span className="text-sm text-muted-foreground">({indicadoresPessoais.length})</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicadoresPessoais.map((indicador) => {
              const result = resultados[indicador.id];
              if (!result) return null;
              const status = calculaStatus(result);
              return (
                <StrategicCard
                  key={indicador.id}
                  indicadorEstrategico={indicador}
                  result={result}
                  status={status}
                  tipo='empresa'
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
