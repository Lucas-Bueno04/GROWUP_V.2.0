
import { supabase } from '@/lib/supabase';

export async function fetchBudgetData(ano: number, empresaId?: string | null) {
  console.log('=== FETCHING BUDGET DATA ===');
  console.log('Parameters:', { ano, empresaId });

  // Test RLS by fetching basic counts first
  try {
    const testQueries = await Promise.all([
      supabase.from('empresas').select('id', { count: 'exact', head: true }),
      supabase.from('orcamento_empresas').select('id', { count: 'exact', head: true }),
      supabase.from('metas_indicadores').select('id', { count: 'exact', head: true })
    ]);

    console.log('RLS Test Results:', {
      empresasCount: testQueries[0].count,
      orcamentoEmpresasCount: testQueries[1].count,
      metasIndicadoresCount: testQueries[2].count,
      errors: testQueries.map(q => q.error).filter(Boolean)
    });
  } catch (rlsError) {
    console.error('RLS Test Error:', rlsError);
  }

  // Buscar grupos e valores orçamentários para o ano especificado
  let gruposQuery = supabase.from('orcamento_grupos').select('*').order('ordem');
  
  let valoresQuery = supabase
    .from('orcamento_empresa_valores')
    .select(`
      *,
      conta:orcamento_contas(
        *,
        grupo:orcamento_grupos(*)
      ),
      orcamento_empresa:orcamento_empresas(ano, empresa_id)
    `)
    .eq('orcamento_empresa.ano', ano);

  // Filtrar por empresa se especificada
  if (empresaId) {
    valoresQuery = valoresQuery.eq('orcamento_empresa.empresa_id', empresaId);
  }

  const [gruposResponse, valoresResponse] = await Promise.all([
    gruposQuery,
    valoresQuery
  ]);

  if (gruposResponse.error) {
    console.error('Error fetching grupos (RLS active):', gruposResponse.error);
  }
  if (valoresResponse.error) {
    console.error('Error fetching valores with RLS:', valoresResponse.error);
  }

  const grupos = gruposResponse.data || [];
  const valores = valoresResponse.data || [];

  console.log(`Found ${grupos.length} groups and ${valores.length} budget values for year ${ano} ${empresaId ? `and company ${empresaId}` : '(all companies)'} with RLS`);

  return { grupos, valores };
}
