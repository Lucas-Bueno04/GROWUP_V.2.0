
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoGridTotalsRowProps {
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  tipo: 'orcado' | 'realizado';
}

export function OrcamentoGridTotalsRow({ contas, valores, tipo }: OrcamentoGridTotalsRowProps) {
  const typeColor = tipo === 'orcado' ? 'blue' : 'green';

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
    <TableRow className={`bg-${typeColor}-900/50 font-semibold border-${typeColor}-700`}>
      <TableCell className="sticky left-0 z-20 bg-${typeColor}-900/50 border-r border-${typeColor}-700 text-gray-100 p-4">
        TOTAL GERAL
      </TableCell>
      {[...Array(12)].map((_, mesIndex) => {
        const mes = mesIndex + 1;
        return (
          <TableCell key={mes} className="text-center text-gray-100 p-4">
            {formatCurrency(getMonthTotal(mes))}
          </TableCell>
        );
      })}
      <TableCell className={`sticky right-0 z-10 bg-${typeColor}-900/50 border-l border-${typeColor}-700 text-center text-${typeColor}-300 font-bold p-4`}>
        {formatCurrency(getGrandTotal())}
      </TableCell>
    </TableRow>
  );
}
