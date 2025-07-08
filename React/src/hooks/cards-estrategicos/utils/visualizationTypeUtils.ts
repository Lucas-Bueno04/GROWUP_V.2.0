
import { TipoVisualizacao } from '../types';

export function determinarTipoVisualizacao(indicador: any, metas: any[]): TipoVisualizacao {
  // Se o indicador já tem um tipo de visualização definido no banco, usar esse
  if (indicador.tipo_visualizacao && ['card', 'chart', 'list'].includes(indicador.tipo_visualizacao)) {
    console.log(`${indicador.codigo}: Using database visualization type = ${indicador.tipo_visualizacao}`);
    return indicador.tipo_visualizacao as TipoVisualizacao;
  }

  // Caso contrário, usar lógica automática (fallback)
  const temMetasMensais = metas.some(m => m.tipo_meta === 'mensal');
  const temMetasAnuais = metas.some(m => m.tipo_meta === 'anual');
  const temVinculacaoOrcamento = metas.some(m => m.vinculado_orcamento);
  const quantidadeMetas = metas.length;

  console.log(`Determinando visualização automaticamente para ${indicador.codigo}:`, {
    temMetasMensais,
    temMetasAnuais,
    temVinculacaoOrcamento,
    quantidadeMetas,
    unidade: indicador.unidade
  });

  // Prioritários para gráfico (Chart):
  // 1. Indicadores com vinculação ao orçamento (sempre mostram tendência)
  if (temVinculacaoOrcamento) {
    console.log(`${indicador.codigo}: Chart devido à vinculação com orçamento`);
    return 'chart';
  }

  // 2. Indicadores com muitas metas mensais (>=6 meses de dados)
  if (temMetasMensais && quantidadeMetas >= 6) {
    console.log(`${indicador.codigo}: Chart devido a ${quantidadeMetas} metas mensais`);
    return 'chart';
  }

  // 3. Indicadores financeiros (R$) com pelo menos 3 metas
  if (indicador.unidade === 'R$' && quantidadeMetas >= 3) {
    console.log(`${indicador.codigo}: Chart devido a indicador financeiro com ${quantidadeMetas} metas`);
    return 'chart';
  }

  // Prioritários para lista (List):
  // 1. Indicadores percentuais com muitas metas (melhor visualização tabular)
  if (indicador.unidade === '%' && quantidadeMetas > 8) {
    console.log(`${indicador.codigo}: List devido a indicador percentual com ${quantidadeMetas} metas`);
    return 'list';
  }

  // 2. Indicadores apenas com metas anuais e poucos dados
  if (temMetasAnuais && !temMetasMensais && quantidadeMetas <= 2) {
    console.log(`${indicador.codigo}: List devido a poucas metas anuais`);
    return 'list';
  }

  // Padrão para card (Card):
  // 1. Indicadores com metas anuais únicas
  if (temMetasAnuais && quantidadeMetas <= 3) {
    console.log(`${indicador.codigo}: Card devido a poucas metas anuais`);
    return 'card';
  }

  // 2. Indicadores com poucas metas mensais
  if (temMetasMensais && quantidadeMetas < 6) {
    console.log(`${indicador.codigo}: Card devido a poucas metas mensais`);
    return 'card';
  }

  // 3. Fallback padrão
  console.log(`${indicador.codigo}: Card (padrão)`);
  return 'card';
}

// Export alias for compatibility
export const getVisualizationType = determinarTipoVisualizacao;
