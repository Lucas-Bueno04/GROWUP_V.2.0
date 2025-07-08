
import React from 'react';
import { MetaTypeSelector } from './fields/MetaTypeSelector';
import { ValueTypeSelector } from './fields/ValueTypeSelector';
import { BudgetLinkSection } from './fields/BudgetLinkSection';
import { DateFieldsSection } from './fields/DateFieldsSection';
import { ValueFieldSection } from './fields/ValueFieldSection';
import { ReplicationSection } from './fields/ReplicationSection';
import { DescriptionField } from './fields/DescriptionField';

interface EditarMetaIndicadorFormFieldsProps {
  formData: {
    tipo_meta: 'mensal' | 'anual';
    tipo_valor: 'valor' | 'percentual';
    ano: number;
    mes: number;
    valor_meta: string;
    descricao: string;
    vinculado_orcamento: boolean;
    conta_orcamento_id: string;
    tipo_item_orcamento: 'conta' | 'grupo';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    tipo_meta: 'mensal' | 'anual';
    tipo_valor: 'valor' | 'percentual';
    ano: number;
    mes: number;
    valor_meta: string;
    descricao: string;
    vinculado_orcamento: boolean;
    conta_orcamento_id: string;
    tipo_item_orcamento: 'conta' | 'grupo';
  }>>;
  replicarTodosMeses: boolean;
  setReplicarTodosMeses: (value: boolean) => void;
  indicadorUnidade?: string;
}

export function EditarMetaIndicadorFormFields({
  formData,
  setFormData,
  replicarTodosMeses,
  setReplicarTodosMeses,
  indicadorUnidade
}: EditarMetaIndicadorFormFieldsProps) {
  console.log('EditarMetaIndicadorFormFields rendered with formData:', formData);

  return (
    <>
      <MetaTypeSelector
        value={formData.tipo_meta}
        onChange={(value) => setFormData(prev => ({ ...prev, tipo_meta: value }))}
      />

      <ValueTypeSelector
        value={formData.tipo_valor}
        onChange={(value) => setFormData(prev => ({ ...prev, tipo_valor: value }))}
      />

      <BudgetLinkSection
        vinculadoOrcamento={formData.vinculado_orcamento}
        onVinculadoOrcamentoChange={(checked) => setFormData(prev => ({ 
          ...prev, 
          vinculado_orcamento: checked,
          conta_orcamento_id: checked ? prev.conta_orcamento_id : ''
        }))}
        contaOrcamentoId={formData.conta_orcamento_id}
        onContaOrcamentoIdChange={(value) => setFormData(prev => ({ ...prev, conta_orcamento_id: value }))}
      />

      <DateFieldsSection
        tipoMeta={formData.tipo_meta}
        ano={formData.ano}
        mes={formData.mes}
        onAnoChange={(ano) => setFormData(prev => ({ ...prev, ano }))}
        onMesChange={(mes) => setFormData(prev => ({ ...prev, mes }))}
      />

      <ValueFieldSection
        vinculadoOrcamento={formData.vinculado_orcamento}
        tipoValor={formData.tipo_valor}
        tipoMeta={formData.tipo_meta}
        valorMeta={formData.valor_meta}
        onValorMetaChange={(valor_meta) => setFormData(prev => ({ ...prev, valor_meta }))}
        indicadorUnidade={indicadorUnidade}
      />

      <ReplicationSection
        tipoMeta={formData.tipo_meta}
        replicarTodosMeses={replicarTodosMeses}
        onReplicarTodosMesesChange={setReplicarTodosMeses}
        ano={formData.ano}
      />

      <DescriptionField
        value={formData.descricao}
        onChange={(descricao) => setFormData(prev => ({ ...prev, descricao }))}
      />
    </>
  );
}
