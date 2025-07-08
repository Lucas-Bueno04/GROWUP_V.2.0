
// Plan of accounts specific types
export type TipoCalculo = 'soma' | 'calculado' | 'manual';
export type TipoSinal = '+' | '-';

export interface OrcamentoIndicador {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  formula: string;
  unidade?: string;
  melhor_quando: 'maior' | 'menor';
  valor?: number;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Export the main types that are already defined in orcamento.types.ts
export type { 
  OrcamentoTemplate,
  OrcamentoGrupo,
  OrcamentoConta,
  OrcamentoTemplateCompleto
} from './orcamento.types';
