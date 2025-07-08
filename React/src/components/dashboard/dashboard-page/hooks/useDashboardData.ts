
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData as useOriginalDashboardData } from "@/hooks/useDashboardData";
import { usePeriodSelector } from "@/hooks/usePeriodSelector";
import { useDashboardFinanceiroComPeriodo } from "@/hooks/useDashboardFinanceiroComPeriodo";

export function useDashboardData() {
  const { user } = useAuth();
  const dashboardData = useOriginalDashboardData();
  const { selectedYear, selectedMonth, setSelectedYear, setSelectedMonth } = usePeriodSelector();
  const { data: financialData, loading: isLoadingFinanceiro } = useDashboardFinanceiroComPeriodo(selectedYear, selectedMonth);

  // Transform financial data to match MetricasFinanceiras interface
  const transformedFinancialData = financialData ? {
    receitaLiquida: financialData.receita || 0,
    lucroLiquido: financialData.lucro || 0,
    margemLiquida: financialData.receita > 0 ? (financialData.lucro / financialData.receita) * 100 : 0,
    ebitda: financialData.lucro + (financialData.custos * 0.1) || 0,
    margemEbitda: financialData.receita > 0 ? ((financialData.lucro + (financialData.custos * 0.1)) / financialData.receita) * 100 : 0,
    custosOperacionais: financialData.custos || 0,
    despesasOperacionais: financialData.despesas || 0,
    resultadoFinanceiro: financialData.lucro || 0
  } : {
    receitaLiquida: 0,
    lucroLiquido: 0,
    margemLiquida: 0,
    ebitda: 0,
    margemEbitda: 0,
    custosOperacionais: 0,
    despesasOperacionais: 0,
    resultadoFinanceiro: 0
  };

  const variationData = {
    receitaLiquida: 0,
    lucroLiquido: 0,
    margemLiquida: 0,
    ebitda: 0,
    margemEbitda: 0,
    custosOperacionais: 0,
    despesasOperacionais: 0,
    resultadoFinanceiro: 0
  };

  const isLoading = dashboardData.isLoading || isLoadingFinanceiro;

  // Extract data safely
  const data = dashboardData.data;
  const empresas = data?.empresas || { data: [] };
  const orcamentos = data?.orcamentos || { data: [] };
  const alertas = data?.alertas || { data: [] };
  const metasIndicadoresEmpresa = data?.metasIndicadoresEmpresa || [];
  const metrics = data?.metrics || {
    totalMetas: 0,
    indicadoresAtivos: 0,
    totalEmpresas: 0,
    alertasAtivos: 0
  };

  return {
    user,
    isLoading,
    transformedFinancialData,
    variationData,
    empresas,
    orcamentos,
    alertas,
    metasIndicadoresEmpresa,
    metrics,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    financialData
  };
}
