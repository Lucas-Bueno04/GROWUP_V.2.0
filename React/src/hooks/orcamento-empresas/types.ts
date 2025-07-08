
export interface OrcamentoEmpresa {
  id: string;
  nome: string;
  descricao?: string;
  empresa_id: string;
  ano: number;
  criado_por: string;
  mentor_responsavel: string;
  permite_edicao_aluno: boolean;
  data_limite_edicao?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  empresa?: {
    id: string;
    nome: string;
    nome_fantasia?: string;
    cnpj?: string;
  };
  pode_editar?: boolean;
}

export interface OrcamentoEmpresaValor {
  id: string;
  orcamento_empresa_id: string;
  conta_id: string;
  mes: number;
  valor_orcado: number;
  valor_realizado: number;
  editado_por?: string;
  editado_em?: string;
  updated_at: string;
  observacoes?: string;
}
