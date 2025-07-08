
export interface MetaIndicador {
  id: string;
  usuario_id: string;
  indicador_id: string;
  empresa_id: string;
  ano: number;
  mes: number;
  valor_meta: number;
  tipo_meta: 'mensal' | 'anual';
  tipo_valor: 'valor' | 'percentual';
  descricao?: string;
  vinculado_orcamento: boolean;
  conta_orcamento_id?: string;
  tipo_item_orcamento?: 'conta' | 'grupo';
  created_at: string;
  updated_at: string;
}

export interface IndicadorEmpresa {
  id: string;
  empresa_id: string;
  usuario_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  formula: string;
  unidade: string;
  melhor_quando: 'maior' | 'menor';
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetaIndicadorEmpresa {
  id: string;
  usuario_id: string;
  indicador_empresa_id: string;
  empresa_id: string; // Agora obrigatório - coluna adicionada na migração
  ano: number;
  mes: number;
  valor_meta: number;
  valor_realizado: number;
  tipo_meta: 'mensal' | 'anual';
  tipo_valor: 'valor' | 'percentual';
  descricao?: string;
  vinculado_orcamento: boolean;
  conta_orcamento_id?: string;
  tipo_item_orcamento?: 'conta' | 'grupo';
  created_at: string;
  updated_at: string;
}

// Interfaces para dados completos com joins
export interface MetaIndicadorCompleta extends MetaIndicador {
  indicador: {
    codigo: string;
    nome: string;
    unidade?: string;
    melhor_quando?: 'maior' | 'menor';
  };
  empresa: {
    id: string;
    nome: string;
  };
  conta_orcamento?: {
    codigo: string;
    nome: string;
  };
}

export interface MetaIndicadorEmpresaCompleta extends MetaIndicadorEmpresa {
  indicador_empresa: IndicadorEmpresa;
  conta_orcamento?: {
    codigo: string;
    nome: string;
  };
}

// Types para criação (sem id e timestamps)
export type NovaMetaIndicador = Omit<MetaIndicador, 'id' | 'created_at' | 'updated_at'>;
export type NovoIndicadorEmpresa = Omit<IndicadorEmpresa, 'id' | 'created_at' | 'updated_at'>;
export type NovaMetaIndicadorEmpresa = Omit<MetaIndicadorEmpresa, 'id' | 'created_at' | 'updated_at'>;
