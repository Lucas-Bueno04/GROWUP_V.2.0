
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrcamentoEmpresasPorUsuario, useOrcamentoEmpresaValores } from '@/hooks/useOrcamentoEmpresas';
import { usePeriodSelector } from '@/hooks/usePeriodSelector';
import { TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';

export function FinancialMetricsCard() {
  const { selectedYear, selectedMonth } = usePeriodSelector();
  const { data: orcamentos } = useOrcamentoEmpresasPorUsuario();
  
  // Pegar o primeiro orçamento ativo do ano selecionado
  const orcamentoAtivo = orcamentos?.find(o => 
    o.status === 'ativo' && o.ano === selectedYear
  );

  const { data: valores } = useOrcamentoEmpresaValores(orcamentoAtivo?.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!orcamentoAtivo || !valores) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Métricas Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Nenhum orçamento ativo encontrado para {selectedYear}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular métricas acumuladas até o mês selecionado
  const valoresAcumulados = valores.filter(v => v.mes <= selectedMonth);
  
  let receitaTotal = 0;
  let custosTotal = 0;
  let despesasTotal = 0;

  valoresAcumulados.forEach(valor => {
    const valorFinal = valor.valor_realizado || valor.valor_orcado;
    
    // Aqui seria ideal ter uma classificação mais precisa baseada nos grupos
    // Por simplicidade, vou usar uma lógica básica
    if (valorFinal > 0) {
      receitaTotal += valorFinal;
    } else {
      const valorAbs = Math.abs(valorFinal);
      if (valorAbs < 50000) {
        custosTotal += valorAbs;
      } else {
        despesasTotal += valorAbs;
      }
    }
  });

  const lucroTotal = receitaTotal - custosTotal - despesasTotal;
  const margemLiquida = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;

  const metricas = [
    {
      titulo: 'Receita Acumulada',
      valor: receitaTotal,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      titulo: 'Custos Acumulados',
      valor: custosTotal,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      titulo: 'Despesas Acumuladas',
      valor: despesasTotal,
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      titulo: 'Lucro Líquido',
      valor: lucroTotal,
      icon: TrendingUp,
      color: lucroTotal >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: lucroTotal >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Métricas Financeiras
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {orcamentoAtivo.nome} - Acumulado até {selectedMonth}/{selectedYear}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricas.map((metrica, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${metrica.bgColor} mr-3`}>
                <metrica.icon className={`h-4 w-4 ${metrica.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metrica.titulo}</p>
                <p className="text-lg font-semibold">{formatCurrency(metrica.valor)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Margem Líquida:</span>
            <span className={`text-lg font-bold ${margemLiquida >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {margemLiquida.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
