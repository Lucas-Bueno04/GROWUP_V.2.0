// Simplified types - keeping only template and plan of accounts types
export interface OrcamentoTemplate {
  id: string;
  nome: string;
  descricao?: string;
  criado_por: string;
  ativo: boolean;
  is_default?: boolean;
  template_type?: string;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoGrupo {
  id: string;
  template_id: string;
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo: 'soma' | 'calculado' | 'manual';
  formula?: string;
  editavel_aluno: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoConta {
  id: string;
  grupo_id: string;
  codigo: string;
  nome: string;
  ordem: number;
  sinal: '+' | '-';
  editavel_aluno: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoTemplateCompleto {
  template: OrcamentoTemplate;
  grupos: (OrcamentoGrupo & {
    contas: OrcamentoConta[];
  })[];
}

// Legacy types for backward compatibility
export type OrcamentoGrupoOrcamento = OrcamentoGrupo;
export type OrcamentoContaOrcamento = OrcamentoConta;
