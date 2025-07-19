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
  id: number;  // Este é o id do budget, usado na chamada da API
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
  id,  // aqui o id é o budgetId
}: CardsEstrategicosContentProps) {
  
  const [loading, setLoading] = useState(true);

  // Guarda os resultados indexados pelo indicadorId
  const [resultados, setResultados] = useState<Record<number, ResultRequest>>({});

  useEffect(() => {
  console.log('Indicadores do Plano de Contas recebidos:', indicadoresPlanoDeContas);
  }, [indicadoresPlanoDeContas]);

  useEffect(() => {
    console.log('Indicadores Pessoais recebidos:', indicadoresPessoais);
  }, [indicadoresPessoais]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = await jwtService.getToken();

        // Para cada indicador, monta os dados da fórmula e busca resultado
        const fetchResult = async (indicador: IndicatorResponse) => {
          const data: FormulaRequest = {
            formula: indicador.formula,
            months: meses,
          };
          const response = await getEvaluatedData(id, token, data);
          console.log(response)
          return response
        };

        // Resultados para Plano de Contas
        const resultsPlanoDeContas = await Promise.all(
          indicadoresPlanoDeContas.map(async (indicador) => {
            const res = await fetchResult(indicador);
            return { id: indicador.id, result: res };
          })
        );

        // Resultados para Indicadores Pessoais
        const resultsPessoais = await Promise.all(
          indicadoresPessoais.map(async (indicador) => {
            const res = await fetchResult(indicador);
            return { id: indicador.id, result: res };
          })
        );

        // Junta todos resultados num único objeto para fácil acesso
        const allResults: Record<number, ResultRequest> = {};

        resultsPlanoDeContas.forEach(({ id, result }) => {
          allResults[id] = result;
        });
        resultsPessoais.forEach(({ id, result }) => {
          allResults[id] = result;
        });

        setResultados(allResults);
      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [indicadoresPlanoDeContas, indicadoresPessoais, meses, id]);  // Inclui 'id' para atualizar se mudar

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
              const status = calculaStatus(result);
              return (
                <StrategicCard
                  key={indicador.id}
                  indicadorEstrategico={indicador}
                  result={result}
                  status={status}
                  tipo="plano-contas"
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
            <h3 className="text-lg font-semibold">Indicadores Próprios da Empresa</h3>
            <span className="text-sm text-muted-foreground">
              ({indicadoresPessoais.length})
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicadoresPessoais.map((indicador) => {
              const result = resultados[indicador.id];
              const status = calculaStatus(result);
              return (
                <StrategicCard
                  key={indicador.id}
                  indicadorEstrategico={indicador}
                  result={result}
                  status={status}
                  tipo="empresa"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
