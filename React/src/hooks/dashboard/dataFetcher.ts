
import { supabase } from '@/lib/supabase';
import { DadosGrupoEmpresa } from './types';

export async function fetchEmpresaGrupos(empresaId: string): Promise<DadosGrupoEmpresa[]> {
  const { data: grupoData, error: grupoError } = await supabase
    .from('empresa_grupos')
    .select('grupo_tipo, grupo_valor, empresa_id')
    .eq('empresa_id', empresaId)
    .eq('grupo_tipo', 'faturamento');

  if (grupoError) {
    console.error('Erro ao buscar grupos da empresa:', grupoError);
    return [];
  }

  return (grupoData || []).map(g => ({
    grupoTipo: g.grupo_tipo,
    grupoValor: g.grupo_valor,
    empresaId: g.empresa_id
  }));
}

export async function fetchIndicadoresPlano() {
  const { data: indicadoresPlano, error: indicadoresError } = await supabase
    .from('orcamento_indicadores')
    .select('*')
    .order('ordem');

  if (indicadoresError) {
    console.error('Erro ao buscar indicadores:', indicadoresError);
    throw indicadoresError;
  }

  return indicadoresPlano || [];
}

export async function fetchOrcamentoData(ano: number) {
  const [gruposResponse, valoresResponse] = await Promise.all([
    supabase.from('orcamento_grupos').select('*').order('ordem'),
    supabase
      .from('orcamento_empresa_valores')
      .select(`
        *,
        conta:orcamento_contas(
          *,
          grupo:orcamento_grupos(*)
        ),
        orcamento_empresa:orcamento_empresas(ano, empresa_id)
      `)
      .eq('orcamento_empresa.ano', ano)
      .not('orcamento_empresa', 'is', null)
  ]);

  return {
    grupos: gruposResponse.data || [],
    valores: valoresResponse.data || []
  };
}

export async function fetchOrcamentoEmpresa(empresaId: string, ano: number) {
  if (!empresaId) {
    return { data: null };
  }

  return await supabase
    .from('orcamento_empresas')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ano', ano)
    .single();
}
