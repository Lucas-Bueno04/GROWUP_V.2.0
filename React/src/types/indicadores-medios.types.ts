
export interface IndicadorMedio {
  id: string;
  ano: number;
  indicador_codigo: string;
  indicador_nome: string;
  media_geral: number;
  total_empresas: number;
  created_at: string;
  updated_at: string;
}

export interface EmpresaGrupo {
  id: string;
  empresa_id: string;
  grupo_tipo: 'faturamento' | 'porte' | 'setor';
  grupo_valor: string;
  created_at: string;
  updated_at: string;
}

export interface IndicadorMedioGrupo {
  id: string;
  indicador_medio_id: string;
  grupo_tipo: string;
  grupo_valor: string;
  media_grupo: number;
  total_empresas_grupo: number;
  created_at: string;
  updated_at: string;
}

export interface IndicadorMedioCompleto extends IndicadorMedio {
  grupos: IndicadorMedioGrupo[];
}

export interface MediasComparativas {
  geral: number;
  meuGrupoPorte?: number;
  meuGrupoSetor?: number;
  meuGrupoFaturamento?: number;
  minhaEmpresa?: number;
}
