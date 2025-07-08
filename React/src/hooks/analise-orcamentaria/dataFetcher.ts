
import { supabase } from '@/lib/supabase';

export const fetchOrcamentoData = async (ano: number, empresaId?: string, userId?: string) => {
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  console.log('Fetching budget analysis data for:', { ano, empresaId, userId });

  // Build the query for orcamento_empresas
  let query = supabase
    .from('orcamento_empresas')
    .select(`
      id,
      nome,
      empresa:empresas(id, nome, nome_fantasia)
    `)
    .eq('ano', ano);

  // If empresaId is provided, filter by empresa_id
  if (empresaId) {
    query = query.eq('empresa_id', empresaId);
  }

  const { data: orcamentos, error: orcamentosError } = await query;

  if (orcamentosError) {
    console.error('Error fetching orcamentos:', orcamentosError);
    throw orcamentosError;
  }

  return orcamentos?.[0];
};

export const fetchGruposAndContas = async () => {
  const { data: grupos, error: gruposError } = await supabase
    .from('orcamento_grupos')
    .select(`
      id,
      codigo,
      nome,
      ordem,
      tipo_calculo,
      formula,
      orcamento_contas(
        id,
        codigo,
        nome,
        ordem,
        sinal
      )
    `)
    .order('ordem');

  if (gruposError) {
    console.error('Error fetching grupos:', gruposError);
    throw gruposError;
  }

  return grupos || [];
};

export const fetchBudgetValues = async (orcamentoId: string) => {
  const { data: valores, error: valoresError } = await supabase
    .from('orcamento_empresa_valores')
    .select(`
      mes,
      valor_orcado,
      valor_realizado,
      conta:orcamento_contas(
        id,
        codigo,
        nome,
        sinal,
        grupo:orcamento_grupos(id, codigo, nome, ordem, tipo_calculo, formula)
      )
    `)
    .eq('orcamento_empresa_id', orcamentoId);

  if (valoresError) {
    console.error('Error fetching valores:', valoresError);
    throw valoresError;
  }

  return valores || [];
};
