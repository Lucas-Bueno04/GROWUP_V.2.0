
import React, { useState, useEffect } from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MetaIndicadorFormFields } from './MetaIndicadorFormFields';
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { useAuth } from '@/hooks/useAuth';
import { useOrcamentoValores } from '@/hooks/metas/useOrcamentoValores';
import { useOrcamentoHierarquia } from '@/hooks/metas/useOrcamentoHierarquia';

interface MetaIndicadorFormProps {
  selectedIndicador: string;
  setSelectedIndicador: (value: string) => void;
  tipoMeta: 'mensal' | 'anual';
  setTipoMeta: (value: 'mensal' | 'anual') => void;
  tipoValor: 'valor' | 'percentual';
  setTipoValor: (value: 'valor' | 'percentual') => void;
  ano: number;
  setAno: (value: number) => void;
  mes: number;
  setMes: (value: number) => void;
  valorMeta: string;
  setValorMeta: (value: string) => void;
  descricao: string;
  setDescricao: (value: string) => void;
  replicarTodosMeses: boolean;
  setReplicarTodosMeses: (value: boolean) => void;
  empresaId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MetaIndicadorForm({
  selectedIndicador,
  setSelectedIndicador,
  tipoMeta,
  setTipoMeta,
  tipoValor,
  setTipoValor,
  ano,
  setAno,
  mes,
  setMes,
  valorMeta,
  setValorMeta,
  descricao,
  setDescricao,
  replicarTodosMeses,
  setReplicarTodosMeses,
  empresaId,
  onSuccess,
  onCancel
}: MetaIndicadorFormProps) {
  const { user } = useAuth();
  const { criarMeta, isCreating } = useMetasIndicadores(empresaId);
  const [vinculadoOrcamento, setVinculadoOrcamento] = useState(false);
  const [contaOrcamentoId, setContaOrcamentoId] = useState('');
  
  const { data: hierarquia = [] } = useOrcamentoHierarquia();

  // Determine if the selected item is a group or account
  const getItemType = (itemId: string): 'conta' | 'grupo' => {
    // Check if it's a group
    const isGroup = hierarquia.some(grupo => grupo.id === itemId);
    if (isGroup) return 'grupo';
    
    // Check if it's an account
    const isAccount = hierarquia.some(grupo => 
      grupo.contas.some(conta => conta.id === itemId)
    );
    if (isAccount) return 'conta';
    
    return 'conta'; // Default fallback
  };

  const itemType = contaOrcamentoId ? getItemType(contaOrcamentoId) : 'conta';

  console.log(`Current selection: ${contaOrcamentoId}, type: ${itemType}`);

  const { data: orcamentoValores = [] } = useOrcamentoValores(
    vinculadoOrcamento ? contaOrcamentoId : undefined,
    ano,
    itemType
  );

  // When budget values are loaded, update the meta value
  useEffect(() => {
    if (vinculadoOrcamento && orcamentoValores.length > 0) {
      console.log(`Budget values loaded:`, orcamentoValores);
      
      if (tipoMeta === 'anual') {
        // For annual meta, sum all budgeted values for the year
        const valorTotal = orcamentoValores.reduce((total, valor) => total + (valor.valor_orcado || 0), 0);
        console.log(`Annual total: ${valorTotal}`);
        setValorMeta(valorTotal.toString());
      } else if (!replicarTodosMeses) {
        // For specific monthly meta, get the value for the selected month
        const valorMes = orcamentoValores.find(v => v.mes === mes);
        if (valorMes) {
          console.log(`Monthly value for month ${mes}: ${valorMes.valor_orcado}`);
          setValorMeta((valorMes.valor_orcado || 0).toString());
        }
      }
    }
  }, [vinculadoOrcamento, orcamentoValores, tipoMeta, mes, replicarTodosMeses, setValorMeta]);

  const handleSubmit = async () => {
    if (!user?.id || !selectedIndicador) return;
    
    // If linked to budget but no account/group selected
    if (vinculadoOrcamento && !contaOrcamentoId) {
      return;
    }

    // If not linked to budget but no manual value
    if (!vinculadoOrcamento && !valorMeta) {
      return;
    }

    // Get empresa_id - it should be provided or default to a fallback
    if (!empresaId) {
      console.error('No empresa_id provided for meta creation');
      return;
    }

    console.log(`Creating meta with tipo_item_orcamento: ${itemType}`);

    const baseMeta = {
      usuario_id: user.id,
      indicador_id: selectedIndicador,
      empresa_id: empresaId,
      ano,
      tipo_meta: tipoMeta,
      tipo_valor: tipoValor,
      descricao: descricao || undefined,
      vinculado_orcamento: vinculadoOrcamento,
      conta_orcamento_id: vinculadoOrcamento ? contaOrcamentoId : undefined,
      tipo_item_orcamento: vinculadoOrcamento ? itemType : undefined,
    };

    try {
      if (tipoMeta === 'mensal' && replicarTodosMeses) {
        // Create metas for all 12 months
        for (let mesAtual = 1; mesAtual <= 12; mesAtual++) {
          let valorMetaMes = parseFloat(valorMeta);
          
          // If linked to budget, find specific month value
          if (vinculadoOrcamento) {
            const valorMesOrcamento = orcamentoValores.find(v => v.mes === mesAtual);
            valorMetaMes = valorMesOrcamento?.valor_orcado || 0;
          }

          await criarMeta({
            ...baseMeta,
            mes: mesAtual,
            valor_meta: valorMetaMes
          });
        }
      } else {
        // Create only one meta
        const mesParaMeta = tipoMeta === 'anual' ? 12 : mes;
        await criarMeta({
          ...baseMeta,
          mes: mesParaMeta,
          valor_meta: parseFloat(valorMeta)
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating meta:', error);
    }
  };

  const isFormValid = selectedIndicador && 
    (vinculadoOrcamento ? contaOrcamentoId : valorMeta) &&
    empresaId;

  return (
    <>
      <MetaIndicadorFormFields
        selectedIndicador={selectedIndicador}
        setSelectedIndicador={setSelectedIndicador}
        tipoMeta={tipoMeta}
        setTipoMeta={setTipoMeta}
        tipoValor={tipoValor}
        setTipoValor={setTipoValor}
        ano={ano}
        setAno={setAno}
        mes={mes}
        setMes={setMes}
        valorMeta={valorMeta}
        setValorMeta={setValorMeta}
        descricao={descricao}
        setDescricao={setDescricao}
        replicarTodosMeses={replicarTodosMeses}
        setReplicarTodosMeses={setReplicarTodosMeses}
        vinculadoOrcamento={vinculadoOrcamento}
        setVinculadoOrcamento={setVinculadoOrcamento}
        contaOrcamentoId={contaOrcamentoId}
        setContaOrcamentoId={setContaOrcamentoId}
      />

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isCreating || !isFormValid}
          className="bg-red-600 hover:bg-red-700"
        >
          {isCreating ? "Criando..." : replicarTodosMeses ? "Criar Metas (12 meses)" : "Criar Meta"}
        </Button>
      </DialogFooter>
    </>
  );
}
