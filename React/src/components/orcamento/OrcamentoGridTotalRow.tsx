
import React from 'react';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoGridTotalRowProps {
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  tipo: 'orcado' | 'realizado';
}

export function OrcamentoGridTotalRow({ contas, valores, tipo }: OrcamentoGridTotalRowProps) {
  const typeColor = tipo === 'orcado' ? 'blue' : 'green';
  const typeColorClasses = {
    blue: {
      totalsRow: 'bg-blue-900/50',
      totalsCell: 'bg-blue-900/50 border-blue-700',
      totalsText: 'text-blue-300'
    },
    green: {
      totalsRow: 'bg-green-900/50',
      totalsCell: 'bg-green-900/50 border-green-700',
      totalsText: 'text-green-300'
    }
  };

  const colors = typeColorClasses[typeColor];

  const getValorForConta = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRowTotal = (contaId: string) => {
    let total = 0;
    for (let mes = 1; mes <= 12; mes++) {
      total += getValorForConta(contaId, mes, tipo);
    }
    return total;
  };

  const getMonthTotal = (mes: number) => {
    return contas.reduce((total, conta) => {
      const valor = getValorForConta(conta.id, mes, tipo);
      return total + (conta.sinal === '+' ? valor : -valor);
    }, 0);
  };

  const getGrandTotal = () => {
    return contas.reduce((total, conta) => {
      const contaTotal = getRowTotal(conta.id);
      return total + (conta.sinal === '+' ? contaTotal : -contaTotal);
    }, 0);
  };

  return (
    <tr className={`${colors.totalsRow} font-semibold border-t-2 border-gray-600`}>
      <td className={`sticky left-0 z-20 ${colors.totalsCell} text-gray-100 p-4 min-w-[320px] max-w-[320px] w-[320px]`}>
        TOTAL GERAL
      </td>
      {[...Array(12)].map((_, mesIndex) => {
        const mes = mesIndex + 1;
        return (
          <td key={mes} className="text-center text-gray-100 p-2 min-w-[120px] w-[120px]">
            {formatCurrency(getMonthTotal(mes))}
          </td>
        );
      })}
      <td className={`sticky right-0 z-20 ${colors.totalsCell} text-center ${colors.totalsText} font-bold p-2 min-w-[140px] w-[140px]`}>
        {formatCurrency(getGrandTotal())}
      </td>
    </tr>
  );
}
