
import { useState } from 'react';
import { useUpdateOrcamentoEmpresaValor, type OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { toast } from '@/hooks/use-toast';
import { useOrcamentoValues } from './useOrcamentoValues';

interface UseOrcamentoCellEditingProps {
  orcamentoId: string;
  valores: OrcamentoEmpresaValor[] | undefined;
}

export function useOrcamentoCellEditing({ orcamentoId, valores }: UseOrcamentoCellEditingProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, number>>({});
  
  const updateValor = useUpdateOrcamentoEmpresaValor();
  const { getValorForConta } = useOrcamentoValues(valores);

  const handleCellEdit = (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const cellKey = `${contaId}-${mes}-${tipo}`;
    setEditingCell(cellKey);
    setTempValues({
      ...tempValues,
      [cellKey]: getValorForConta(contaId, mes, tipo)
    });
  };

  const handleSaveValue = async (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => {
    const cellKey = `${contaId}-${mes}-${tipo}`;
    const newValue = tempValues[cellKey] || 0;
    
    try {
      const existingValor = valores?.find(v => v.conta_id === contaId && v.mes === mes);
      
      await updateValor.mutateAsync({
        id: existingValor?.id,
        orcamento_empresa_id: orcamentoId,
        conta_id: contaId,
        mes,
        ...(tipo === 'orcado' 
          ? { valor_orcado: newValue, valor_realizado: existingValor?.valor_realizado || 0 }
          : { valor_orcado: existingValor?.valor_orcado || 0, valor_realizado: newValue }
        )
      });

      toast({
        title: "Valor atualizado",
        description: `${tipo === 'orcado' ? 'Valor orçado' : 'Valor realizado'} salvo com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar valor. Tente novamente.",
        variant: "destructive"
      });
    }

    setEditingCell(null);
    setTempValues({});
  };

  const handleTempValueChange = (key: string, value: number) => {
    setTempValues({
      ...tempValues,
      [key]: value
    });
  };

  return {
    editingCell,
    tempValues,
    isUpdating: updateValor.isPending,
    handleCellEdit,
    handleSaveValue,
    handleTempValueChange
  };
}
