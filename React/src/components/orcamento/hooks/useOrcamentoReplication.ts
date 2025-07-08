
import { useUpdateOrcamentoEmpresaValor, type OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { toast } from '@/hooks/use-toast';
import { useOrcamentoValues } from './useOrcamentoValues';

interface UseOrcamentoReplicationProps {
  orcamentoId: string;
  valores: OrcamentoEmpresaValor[] | undefined;
  contas: any[];
}

export function useOrcamentoReplication({ orcamentoId, valores, contas }: UseOrcamentoReplicationProps) {
  const updateValor = useUpdateOrcamentoEmpresaValor();
  const { getValorForConta } = useOrcamentoValues(valores);

  const handleReplicateValue = async (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    try {
      // Get the current month's value
      const currentValue = getValorForConta(contaId, mes, tipo);
      
      // Create an array of promises for updating subsequent months
      const updatePromises = [];
      
      for (let targetMes = mes + 1; targetMes <= 12; targetMes++) {
        const existingValor = valores?.find(v => v.conta_id === contaId && v.mes === targetMes);
        
        updatePromises.push(
          updateValor.mutateAsync({
            id: existingValor?.id,
            orcamento_empresa_id: orcamentoId,
            conta_id: contaId,
            mes: targetMes,
            ...(tipo === 'orcado' 
              ? { valor_orcado: currentValue, valor_realizado: existingValor?.valor_realizado || 0 }
              : { valor_orcado: existingValor?.valor_orcado || 0, valor_realizado: currentValue }
            )
          })
        );
      }

      // Execute all updates in parallel
      await Promise.all(updatePromises);

      const monthsReplicated = 12 - mes;
      toast({
        title: "Valores replicados",
        description: `Valor copiado para ${monthsReplicated} ${monthsReplicated === 1 ? 'mês seguinte' : 'meses seguintes'}.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao replicar valores. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleReplicateMonth = async (mes: number, tipo: 'orcado' | 'realizado') => {
    try {
      // Get all values for the specified month and type
      const monthValues = new Map<string, number>();
      
      contas.forEach(conta => {
        const value = getValorForConta(conta.id, mes, tipo);
        monthValues.set(conta.id, value);
      });

      // Create an array of promises for updating subsequent months
      const updatePromises = [];
      
      for (let targetMes = mes + 1; targetMes <= 12; targetMes++) {
        contas.forEach(conta => {
          const sourceValue = monthValues.get(conta.id) || 0;
          const existingValor = valores?.find(v => v.conta_id === conta.id && v.mes === targetMes);
          
          updatePromises.push(
            updateValor.mutateAsync({
              id: existingValor?.id,
              orcamento_empresa_id: orcamentoId,
              conta_id: conta.id,
              mes: targetMes,
              ...(tipo === 'orcado' 
                ? { valor_orcado: sourceValue, valor_realizado: existingValor?.valor_realizado || 0 }
                : { valor_orcado: existingValor?.valor_orcado || 0, valor_realizado: sourceValue }
              )
            })
          );
        });
      }

      // Execute all updates in parallel
      await Promise.all(updatePromises);

      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthsReplicated = 12 - mes;
      
      toast({
        title: "Mês replicado",
        description: `Todos os valores de ${monthNames[mes - 1]} foram copiados para ${monthsReplicated} ${monthsReplicated === 1 ? 'mês seguinte' : 'meses seguintes'}.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao replicar mês. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    handleReplicateValue,
    handleReplicateMonth
  };
}
