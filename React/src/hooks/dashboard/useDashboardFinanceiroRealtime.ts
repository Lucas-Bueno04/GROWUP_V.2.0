
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DashboardFinanceiroData {
  receitaLiquida: number;
  lucroLiquido: number;
  ebitda: number;
  margemLiquida: number;
  margemEbitda: number;
  variacaoReceitaLiquida: number;
  variacaoLucroLiquido: number;
  variacaoEbitda: number;
  variacaoMargemLiquida: number;
  variacaoMargemEbitda: number;
  custosOperacionais: number;
  despesasOperacionais: number;
  resultadoFinanceiro: number;
}

export function useDashboardFinanceiroRealtime(empresaId?: string, ano?: number, mes?: number) {
  return useQuery({
    queryKey: ['dashboard-financeiro-realtime', empresaId, ano, mes],
    queryFn: async (): Promise<DashboardFinanceiroData | null> => {
      console.log('=== CALCULANDO DASHBOARD FINANCEIRO REALTIME ===');
      console.log('Empresa ID:', empresaId);
      console.log('Ano:', ano || new Date().getFullYear());
      console.log('Mês:', mes || new Date().getMonth() + 1);

      if (!empresaId) {
        console.log('Sem empresa selecionada');
        return null;
      }

      const anoAtual = ano || new Date().getFullYear();
      const mesAtual = mes || new Date().getMonth() + 1;

      try {
        // Verificar se a empresa tem orçamento ativo
        const { data: orcamentoEmpresa } = await supabase
          .from('orcamento_empresas')
          .select('id, status')
          .eq('empresa_id', empresaId)
          .eq('ano', anoAtual)
          .single();

        if (!orcamentoEmpresa || orcamentoEmpresa.status !== 'ativo') {
          console.log('Empresa sem orçamento ativo');
          return null;
        }

        // Buscar valores orçamentários da empresa para o período
        const { data: valores } = await supabase
          .from('orcamento_empresa_valores')
          .select(`
            mes,
            valor_realizado,
            valor_orcado,
            conta:orcamento_contas(
              codigo,
              nome,
              grupo:orcamento_grupos(codigo, nome)
            )
          `)
          .eq('orcamento_empresa_id', orcamentoEmpresa.id)
          .lte('mes', mesAtual);

        if (!valores || valores.length === 0) {
          console.log('Sem valores orçamentários encontrados');
          return {
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
          };
        }

        // Calcular totais por categoria
        let receitaLiquida = 0;
        let custosOperacionais = 0;
        let despesasOperacionais = 0;

        // Calcular também para o mês anterior para variações
        let receitaAnterior = 0;
        let custosAnterior = 0;
        let despesasAnterior = 0;

        valores.forEach(valor => {
          // Type guard to ensure conta exists and has the expected structure
          if (!valor.conta || typeof valor.conta !== 'object' || !('codigo' in valor.conta)) {
            return;
          }

          const valorFinal = valor.valor_realizado || valor.valor_orcado || 0;
          const codigoConta = String(valor.conta.codigo); // Ensure it's a string

          // Valores do mês atual
          if (valor.mes === mesAtual) {
            if (codigoConta.startsWith('3.')) {
              // Receitas
              receitaLiquida += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('4.')) {
              // Custos
              custosOperacionais += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('5.') || codigoConta.startsWith('6.')) {
              // Despesas
              despesasOperacionais += Math.abs(valorFinal);
            }
          }

          // Valores do mês anterior para comparação
          if (valor.mes === mesAtual - 1) {
            if (codigoConta.startsWith('3.')) {
              receitaAnterior += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('4.')) {
              custosAnterior += Math.abs(valorFinal);
            } else if (codigoConta.startsWith('5.') || codigoConta.startsWith('6.')) {
              despesasAnterior += Math.abs(valorFinal);
            }
          }
        });

        // Calcular indicadores derivados
        const lucroLiquido = receitaLiquida - custosOperacionais - despesasOperacionais;
        const lucroAnterior = receitaAnterior - custosAnterior - despesasAnterior;

        // Estimativa de EBITDA (Lucro + Depreciação/Amortização estimada)
        const ebitda = lucroLiquido + (despesasOperacionais * 0.12);
        const ebitdaAnterior = lucroAnterior + (despesasAnterior * 0.12);

        // Calcular margens
        const margemLiquida = receitaLiquida > 0 ? (lucroLiquido / receitaLiquida) * 100 : 0;
        const margemEbitda = receitaLiquida > 0 ? (ebitda / receitaLiquida) * 100 : 0;

        const margemAnterior = receitaAnterior > 0 ? (lucroAnterior / receitaAnterior) * 100 : 0;
        const margemEbitdaAnterior = receitaAnterior > 0 ? (ebitdaAnterior / receitaAnterior) * 100 : 0;

        // Calcular variações
        const variacaoReceitaLiquida = receitaAnterior > 0 ? 
          ((receitaLiquida - receitaAnterior) / receitaAnterior) * 100 : 0;
        
        const variacaoLucroLiquido = lucroAnterior !== 0 ? 
          ((lucroLiquido - lucroAnterior) / Math.abs(lucroAnterior)) * 100 : 0;
        
        const variacaoEbitda = ebitdaAnterior !== 0 ? 
          ((ebitda - ebitdaAnterior) / Math.abs(ebitdaAnterior)) * 100 : 0;

        const result: DashboardFinanceiroData = {
          receitaLiquida,
          lucroLiquido,
          ebitda,
          margemLiquida,
          margemEbitda,
          variacaoReceitaLiquida,
          variacaoLucroLiquido,
          variacaoEbitda,
          variacaoMargemLiquida: margemLiquida - margemAnterior,
          variacaoMargemEbitda: margemEbitda - margemEbitdaAnterior,
          custosOperacionais,
          despesasOperacionais,
          resultadoFinanceiro: lucroLiquido
        };

        console.log('Dashboard financeiro calculado:', result);
        return result;

      } catch (error) {
        console.error('Erro ao calcular dashboard financeiro:', error);
        throw error;
      }
    },
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
}
