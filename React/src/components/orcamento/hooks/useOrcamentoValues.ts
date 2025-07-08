
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

export function useOrcamentoValues(valores: OrcamentoEmpresaValor[] | undefined) {
  const getValorForConta = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const valor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
    return valor ? (tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado) : 0;
  };

  return {
    getValorForConta
  };
}
