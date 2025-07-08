
export interface FaixaFaturamento {
  id: string;
  nome: string;
  valor_minimo: number;
  valor_maximo: number;
  ativa: boolean;
  ordem: number;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyBadgeAward {
  id: string;
  empresa_id: string;
  faixa_id: string;
  awarded_at: string;
  is_notified: boolean;
  faixa?: FaixaFaturamento;
}

export interface CompanyClassificationHistory {
  id: string;
  empresa_id: string;
  previous_classification: string | null;
  new_classification: string;
  previous_revenue: number | null;
  current_revenue: number;
  growth_percentage: number | null;
  classification_date: string;
  created_at: string;
}

export interface CompanyClassificationData {
  current_classification: string | null;
  current_revenue: number;
  badges: CompanyBadgeAward[];
  history: CompanyClassificationHistory[];
  growth_percentage: number | null;
}
