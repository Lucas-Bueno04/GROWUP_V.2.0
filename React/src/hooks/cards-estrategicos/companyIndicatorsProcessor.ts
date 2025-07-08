
import { IndicadorEstrategico, PerformanceCompleta } from './types';
import { calcularPerformanceIndicador } from './utils/performanceCalculator';
import { getVisualizationType } from './utils/visualizationTypeUtils';
import { evaluateUnifiedFormula } from '../analise-orcamentaria/unifiedFormulaEvaluator';

export async function processCompanyIndicators(
  indicadoresEmpresa: any,
  metasIndicadoresEmpresa: any,
  grupos: any[],
  valores: any[],
  ano: number,
  empresaId?: string | null
): Promise<IndicadorEstrategico[]> {
  console.log('=== PROCESSING COMPANY INDICATORS ===');
  
  const indicadores = indicadoresEmpresa.indicadoresProprios.data || [];
  const metas = metasIndicadoresEmpresa.data || [];
  
  // Filtrar indicadores por empresa se especificada
  const indicadoresFiltrados = empresaId
    ? indicadores.filter(indicador => indicador.empresa_id === empresaId)
    : indicadores;

  // Filtrar metas por empresa se especificada
  const metasFiltradas = empresaId
    ? metas.filter(meta => meta.empresa_id === empresaId && meta.ano === ano)
    : metas.filter(meta => meta.ano === ano);

  console.log(`Processing ${indicadoresFiltrados.length} company indicators for company: ${empresaId || 'all companies'}`);
  console.log(`Found ${metasFiltradas.length} company goals for company: ${empresaId || 'all companies'}`);

  // Filtrar valores por empresa se especificada
  const valoresFiltrados = empresaId
    ? valores.filter(valor => {
        return valor.orcamento_empresa?.empresa_id === empresaId;
      })
    : valores;

  console.log(`Found ${valoresFiltrados.length} filtered budget values for company ${empresaId || 'all companies'}`);

  const processedIndicators: IndicadorEstrategico[] = [];

  for (const indicador of indicadoresFiltrados) {
    try {
      console.log(`Processing company indicator: ${indicador.codigo} - ${indicador.nome}`);
      
      // Buscar metas para este indicador
      const metasIndicador = metasFiltradas.filter(
        meta => meta.indicador_empresa_id === indicador.id
      );

      console.log(`Found ${metasIndicador.length} goals for company indicator ${indicador.codigo}`);

      // Usar a função corrigida de cálculo de performance
      const performance: PerformanceCompleta = await calcularPerformanceIndicador(
        indicador,
        metasIndicador,
        grupos,
        valoresFiltrados,
        'empresa'
      );

      // Calcular valor atual (usar valor anual calculado corretamente)
      const valorAtual = performance.anual.totalRealizado;

      const indicadorEstrategico: IndicadorEstrategico = {
        id: indicador.id,
        codigo: indicador.codigo,
        nome: indicador.nome,
        descricao: indicador.descricao,
        unidade: indicador.unidade || '%',
        melhorQuando: indicador.melhor_quando || 'maior',
        valorAtual,
        tipo: 'empresa',
        tipoVisualizacao: getVisualizationType(indicador, metasIndicador),
        performance,
        ordem: indicador.ordem
      };

      processedIndicators.push(indicadorEstrategico);
      console.log(`Processed company indicator ${indicador.codigo} with annual value ${valorAtual.toFixed(2)}`);

    } catch (error) {
      console.error(`Error processing company indicator ${indicador.codigo}:`, error);
    }
  }

  console.log(`=== COMPANY INDICATORS PROCESSING COMPLETED ===`);
  console.log(`Processed ${processedIndicators.length} company indicators for company ${empresaId || 'all companies'}`);

  return processedIndicators;
}
