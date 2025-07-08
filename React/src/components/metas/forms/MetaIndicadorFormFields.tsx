
import React from 'react';
import { IndicadorSelector } from './fields/IndicadorSelector';
import { MetaTypeSelector } from './fields/MetaTypeSelector';
import { ValueTypeSelector } from './fields/ValueTypeSelector';
import { BudgetLinkSection } from './fields/BudgetLinkSection';
import { DateFieldsSection } from './fields/DateFieldsSection';
import { ValueFieldSection } from './fields/ValueFieldSection';
import { ReplicationSection } from './fields/ReplicationSection';
import { DescriptionField } from './fields/DescriptionField';

interface MetaIndicadorFormFieldsProps {
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
  vinculadoOrcamento?: boolean;
  setVinculadoOrcamento?: (value: boolean) => void;
  contaOrcamentoId?: string;
  setContaOrcamentoId?: (value: string) => void;
}

export function MetaIndicadorFormFields({
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
  vinculadoOrcamento = false,
  setVinculadoOrcamento,
  contaOrcamentoId = '',
  setContaOrcamentoId
}: MetaIndicadorFormFieldsProps) {
  return (
    <div className="space-y-4">
      <IndicadorSelector
        value={selectedIndicador}
        onChange={setSelectedIndicador}
      />

      <MetaTypeSelector
        value={tipoMeta}
        onChange={setTipoMeta}
        onReplicarReset={() => setReplicarTodosMeses(false)}
      />

      <ValueTypeSelector
        value={tipoValor}
        onChange={setTipoValor}
      />

      {setVinculadoOrcamento && setContaOrcamentoId && (
        <BudgetLinkSection
          vinculadoOrcamento={vinculadoOrcamento}
          onVinculadoOrcamentoChange={setVinculadoOrcamento}
          contaOrcamentoId={contaOrcamentoId}
          onContaOrcamentoIdChange={setContaOrcamentoId}
          onValorMetaClear={() => setValorMeta('')}
        />
      )}

      <DateFieldsSection
        tipoMeta={tipoMeta}
        ano={ano}
        mes={mes}
        onAnoChange={setAno}
        onMesChange={setMes}
        replicarTodosMeses={replicarTodosMeses}
      />

      <ReplicationSection
        tipoMeta={tipoMeta}
        replicarTodosMeses={replicarTodosMeses}
        onReplicarTodosMesesChange={setReplicarTodosMeses}
        ano={ano}
      />

      <ValueFieldSection
        vinculadoOrcamento={vinculadoOrcamento}
        tipoValor={tipoValor}
        tipoMeta={tipoMeta}
        valorMeta={valorMeta}
        onValorMetaChange={setValorMeta}
      />

      <DescriptionField
        value={descricao}
        onChange={setDescricao}
      />
    </div>
  );
}
