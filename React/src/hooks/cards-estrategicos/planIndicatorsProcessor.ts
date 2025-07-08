
import { IndicadorEstrategico } from './types';
import { evaluateUnifiedFormula } from '@/hooks/analise-orcamentaria/unifiedFormulaEvaluator';
import { CardsEstrategicosDebugLogger } from './utils/debugLogger';

// Simple status calculation function
function calculatePerformanceStatus(
  realizado: number,
  meta: number,
  melhorQuando: 'maior' | 'menor'
): 'acima' | 'dentro' | 'abaixo' {
  const variacao = Math.abs((realizado - meta) / Math.abs(meta || 1)) * 100;
  
  if (variacao <= 5) {
    return 'dentro'; // Within 5% tolerance
  }
  
  if (melhorQuando === 'maior') {
    return realizado > meta ? 'acima' : 'abaixo';
  } else {
    return realizado < meta ? 'acima' : 'abaixo';
  }
}

export async function processPlanIndicators(
  indicadoresPlanoContas: any[],
  metasIndicadores: any,
  grupos: any[],
  valores: any[],
  ano: number,
  empresaId: string | null | undefined
): Promise<IndicadorEstrategico[]> {
  console.log('=== PROCESSING PLAN INDICATORS (IMPROVED) ===');
  console.log(`Processing ${indicadoresPlanoContas.length} plan indicators`);
  console.log(`Company filter: ${empresaId || 'all companies'}`);
  
  // Ativar debug logger
  CardsEstrategicosDebugLogger.enable();

  const processedIndicators: IndicadorEstrategico[] = [];

  for (const indicador of indicadoresPlanoContas) {
    try {
      console.log(`\n📊 Processing plan indicator: ${indicador.codigo} - ${indicador.nome}`);
      console.log(`Formula: ${indicador.formula}`);

      // Encontrar metas para este indicador
      const metasDoIndicador = metasIndicadores.data?.filter((meta: any) => 
        meta.indicador_id === indicador.id && meta.ano === ano
      ) || [];

      console.log(`Found ${metasDoIndicador.length} goals for indicator ${indicador.codigo}`);

      const performanceMensal = [];
      let totalRealizado = 0;
      let totalMeta = 0;

      // Processar cada mês
      for (let mes = 1; mes <= 12; mes++) {
        console.log(`\n  📅 Processing month ${mes} for ${indicador.codigo}`);
        
        // **USAR MOTOR UNIFICADO MELHORADO**
        const valorRealizado = evaluateUnifiedFormula(
          indicador.formula,
          grupos,
          valores,
          'realizado',
          mes,
          indicador,
          false // não é anual
        );

        const valorOrcado = evaluateUnifiedFormula(
          indicador.formula,
          grupos,
          valores,
          'orcado',
          mes,
          indicador,
          false // não é anual
        );

        // **DEBUG ESPECÍFICO PARA INDICADORES CRÍTICOS**
        if (['EBITDA_PERCENT', 'NET_MARGIN'].includes(indicador.codigo)) {
          if (indicador.codigo === 'EBITDA_PERCENT') {
            // Calcular componentes individuais para debug
            const g3 = evaluateUnifiedFormula('G3', grupos, valores, 'realizado', mes);
            const g4 = evaluateUnifiedFormula('G4', grupos, valores, 'realizado', mes);
            const g5 = evaluateUnifiedFormula('G5', grupos, valores, 'realizado', mes);
            const ebitda = g3 - g4 - g5;
            
            CardsEstrategicosDebugLogger.logEBITDACalculation(g3, g4, g5, ebitda, valorRealizado);
          }
          
          if (indicador.codigo === 'NET_MARGIN') {
            const g7 = evaluateUnifiedFormula('G7', grupos, valores, 'realizado', mes);
            const g3 = evaluateUnifiedFormula('G3', grupos, valores, 'realizado', mes);
            
            CardsEstrategicosDebugLogger.logNetMarginCalculation(g7, g3, valorRealizado);
          }
        }

        console.log(`  Month ${mes}: Realizado=${valorRealizado}, Orçado=${valorOrcado}`);

        // Encontrar meta específica para este mês
        const metaMensal = metasDoIndicador.find((meta: any) => meta.mes === mes);
        const valorMeta = metaMensal?.valor_meta || 0;

        totalRealizado += valorRealizado;
        totalMeta += valorMeta;

        // Calcular status de performance
        const status = calculatePerformanceStatus(
          valorRealizado,
          valorMeta,
          indicador.melhor_quando || 'maior'
        );

        performanceMensal.push({
          mes,
          realizado: valorRealizado,
          orcado: valorOrcado,
          meta: valorMeta,
          status
        });
      }

      // Calcular performance anual
      const statusAnual = calculatePerformanceStatus(
        totalRealizado,
        totalMeta,
        indicador.melhor_quando || 'maior'
      );

      console.log(`✅ Plan indicator ${indicador.codigo} processed:`, {
        totalRealizado,
        totalMeta,
        statusAnual
      });

      const indicadorEstrategico: IndicadorEstrategico = {
        id: indicador.id,
        codigo: indicador.codigo,
        nome: indicador.nome,
        descricao: indicador.descricao,
        unidade: indicador.unidade || '%',
        melhorQuando: indicador.melhor_quando || 'maior',
        valorAtual: totalRealizado,
        tipo: 'plano-contas',
        tipoVisualizacao: 'card',
        performance: {
          anual: {
            totalRealizado,
            totalMeta,
            variacaoPercentual: totalMeta !== 0 ? ((totalRealizado - totalMeta) / Math.abs(totalMeta)) * 100 : 0,
            status: statusAnual
          },
          mensal: performanceMensal
        }
      };

      processedIndicators.push(indicadorEstrategico);

    } catch (error) {
      console.error(`❌ Error processing plan indicator ${indicador.codigo}:`, error);
    }
  }

  console.log(`=== PLAN INDICATORS PROCESSING COMPLETED ===`);
  console.log(`Successfully processed: ${processedIndicators.length} indicators`);
  
  return processedIndicators;
}
