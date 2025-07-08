
import { useState, useEffect } from 'react';
import { useOrcamentoEmpresaValores } from '@/hooks/useOrcamentoEmpresas';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';

interface DashboardFinanceiroData {
  // Valores atuais
  receitaLiquida: number;
  lucroLiquido: number;
  ebitda: number;
  margemLiquida: number;
  margemEbitda: number;
  
  // Variações percentuais vs mês anterior
  variacaoReceitaLiquida: number;
  variacaoLucroLiquido: number;
  variacaoEbitda: number;
  variacaoMargemLiquida: number;
  variacaoMargemEbitda: number;
  
  // Dados adicionais
  custosOperacionais: number;
  despesasOperacionais: number;
  resultadoFinanceiro: number;
}

export function useDashboardFinanceiro(empresaId?: string, ano?: number, mes?: number) {
  const [data, setData] = useState<DashboardFinanceiroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: orcamentos } = useOrcamentoEmpresasPorUsuario();
  
  // Encontrar o orçamento ativo para a empresa e ano
  const orcamentoAtivo = orcamentos?.find(o => 
    o.empresa_id === empresaId && 
    o.ano === (ano || new Date().getFullYear()) &&
    o.status === 'ativo'
  );

  const { data: valores } = useOrcamentoEmpresaValores(orcamentoAtivo?.id);

  useEffect(() => {
    const calculateFinancialData = async () => {
      console.log('=== CALCULANDO DADOS FINANCEIROS COM DADOS REAIS ===');
      console.log('Empresa ID:', empresaId);
      console.log('Ano:', ano);
      console.log('Mês:', mes);
      console.log('Orçamento ativo:', orcamentoAtivo?.id);
      console.log('Valores encontrados:', valores?.length || 0);

      setIsLoading(true);
      setError(null);

      try {
        if (!valores || valores.length === 0 || !empresaId) {
          console.log('Sem dados de orçamento válidos, usando valores padrão');
          
          // Valores padrão quando não há dados ou empresa selecionada
          setData({
            receitaLiquida: 0,
            lucroLiquido: 0,
            ebitda: 0,
            margemLiquida: 0,
            margemEbitda: 0,
            variacaoReceitaLiquida: 0,
            variacaoLucroLiquido: 0,
            variacaoEbitda: 0,
            variacaoMargemLiquida: 0,
            variacaoMargemEbitda: 0,
            custosOperacionais: 0,
            despesasOperacionais: 0,
            resultadoFinanceiro: 0
          });

          setIsLoading(false);
          return;
        }

        // Filtrar valores para o mês específico
        const mesEspecifico = mes || new Date().getMonth() + 1;
        const valoresDoMes = valores.filter(v => v.mes === mesEspecifico);
        const valoresMesAnterior = valores.filter(v => v.mes === mesEspecifico - 1);

        console.log(`Processando valores do mês ${mesEspecifico}:`, valoresDoMes.length);

        // Calcular indicadores financeiros reais baseados nos códigos das contas
        let receitaLiquida = 0;
        let custosOperacionais = 0;
        let despesasOperacionais = 0;

        // Processar valores do mês atual
        for (const valor of valoresDoMes) {
          if (!valor.conta?.codigo) continue;

          // Usar valor realizado se disponível, senão usar orçado
          const valorFinal = valor.valor_realizado || valor.valor_orcado || 0;
          
          // Classificação baseada no código da conta
          const codigoConta = valor.conta.codigo;
          
          if (codigoConta.startsWith('3.')) {
            // Grupo 3: Receitas (positivas)
            receitaLiquida += Math.abs(valorFinal);
          } else if (codigoConta.startsWith('4.')) {
            // Grupo 4: Custos (negativos)
            custosOperacionais += Math.abs(valorFinal);
          } else if (codigoConta.startsWith('5.') || codigoConta.startsWith('6.')) {
            // Grupos 5-6: Despesas operacionais (negativas)
            despesasOperacionais += Math.abs(valorFinal);
          }
        }

        // Calcular valores derivados
        const lucroLiquido = receitaLiquida - custosOperacionais - despesasOperacionais;
        const ebitda = lucroLiquido + (despesasOperacionais * 0.12); // Estimativa de depreciação/amortização
        const margemLiquida = receitaLiquida > 0 ? (lucroLiquido / receitaLiquida) * 100 : 0;
        const margemEbitda = receitaLiquida > 0 ? (ebitda / receitaLiquida) * 100 : 0;

        // Calcular variações vs mês anterior
        let variacaoReceitaLiquida = 0;
        let variacaoLucroLiquido = 0;
        let variacaoEbitda = 0;
        let variacaoMargemLiquida = 0;
        let variacaoMargemEbitda = 0;

        if (valoresMesAnterior.length > 0) {
          let receitaAnterior = 0;
          let custosAnterior = 0;
          let despesasAnterior = 0;

          for (const valor of valoresMesAnterior) {
            if (!valor.conta?.codigo) continue;
            
            const valorFinal = valor.valor_realizado || valor.valor_orcado || 0;
            const codigoConta = valor.conta.codigo;
            
            if (codigoConta.startsWith('3.')) {
              receitaAnterior += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('4.')) {
              custosAnterior += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('5.') || codigoConta.startsWith('6.')) {
              despesasAnterior += Math.abs(valorFinal);
            }
          }

          const lucroAnterior = receitaAnterior - custosAnterior - despesasAnterior;
          const ebitdaAnterior = lucroAnterior + (despesasAnterior * 0.12);
          const margemAnterior = receitaAnterior > 0 ? (lucroAnterior / receitaAnterior) * 100 : 0;
          const margemEbitdaAnterior = receitaAnterior > 0 ? (ebitdaAnterior / receitaAnterior) * 100 : 0;

          // Calcular variações percentuais
          variacaoReceitaLiquida = receitaAnterior > 0 ? ((receitaLiquida - receitaAnterior) / receitaAnterior) * 100 : 0;
          variacaoLucroLiquido = lucroAnterior !== 0 ? ((lucroLiquido - lucroAnterior) / Math.abs(lucroAnterior)) * 100 : 0;
          variacaoEbitda = ebitdaAnterior !== 0 ? ((ebitda - ebitdaAnterior) / Math.abs(ebitdaAnterior)) * 100 : 0;
          variacaoMargemLiquida = margemLiquida - margemAnterior;
          variacaoMargemEbitda = margemEbitda - margemEbitdaAnterior;
        }

        const resultData: DashboardFinanceiroData = {
          receitaLiquida,
          lucroLiquido,
          ebitda,
          margemLiquida,
          margemEbitda,
          variacaoReceitaLiquida,
          variacaoLucroLiquido,
          variacaoEbitda,
          variacaoMargemLiquida,
          variacaoMargemEbitda,
          custosOperacionais,
          despesasOperacionais,
          resultadoFinanceiro: lucroLiquido
        };

        console.log('Dados financeiros calculados com dados reais:', resultData);
        setData(resultData);

      } catch (err) {
        console.error('Erro ao calcular dados financeiros:', err);
        setError('Erro ao calcular indicadores financeiros');
      } finally {
        setIsLoading(false);
      }
    };

    calculateFinancialData();
  }, [empresaId, ano, mes, orcamentoAtivo?.id, valores]);

  return { data, isLoading, error };
}
