
import type { IndicadorCalculado, InsightIA, DadosGrupoEmpresa } from './types';

export function generateAdvancedInsights(
  indicadores: IndicadorCalculado[],
  dadosGrupo?: DadosGrupoEmpresa | null
): InsightIA[] {
  console.log('=== GERANDO INSIGHTS AVANÇADOS ===');
  console.log('Indicadores para análise:', indicadores.length);
  console.log('Dados do grupo:', dadosGrupo);

  const insights: InsightIA[] = [];

  if (indicadores.length === 0) {
    return insights;
  }

  // Análise de performance geral
  const indicadoresAcimaGrupo = indicadores.filter(ind => ind.performanceVsGrupo > 0);
  const indicadoresAbaixoGrupo = indicadores.filter(ind => ind.performanceVsGrupo < 0);
  
  const percentualAcimaGrupo = (indicadoresAcimaGrupo.length / indicadores.length) * 100;

  // Insight sobre performance geral
  if (percentualAcimaGrupo >= 70) {
    insights.push({
      tipo: 'oportunidade',
      titulo: 'Excelente Performance Comparativa',
      descricao: `Sua empresa está superando o grupo de referência em ${percentualAcimaGrupo.toFixed(0)}% dos indicadores analisados. Isso demonstra uma gestão eficiente e estratégias bem implementadas.`,
      prioridade: 'alta',
      confianca: 90,
      acoes: [
        'Documentar as melhores práticas que levaram a este resultado',
        'Compartilhar estratégias bem-sucedidas entre as equipes',
        'Manter o foco nas áreas de excelência identificadas',
        'Considerar expandir para novos mercados ou segmentos'
      ]
    });
  } else if (percentualAcimaGrupo < 30) {
    insights.push({
      tipo: 'alerta',
      titulo: 'Performance Abaixo do Esperado',
      descricao: `Apenas ${percentualAcimaGrupo.toFixed(0)}% dos indicadores estão acima da média do grupo. É necessário revisar as estratégias e processos para melhorar a competitividade.`,
      prioridade: 'alta',
      confianca: 85,
      acoes: [
        'Realizar análise detalhada dos indicadores críticos',
        'Benchmarking com empresas do mesmo segmento',
        'Revisar processos operacionais e estratégias',
        'Implementar plano de melhoria focado nos pontos fracos'
      ]
    });
  }

  // Análise de indicadores específicos críticos
  const indicadoresCriticos = indicadores.filter(ind => 
    ind.performanceVsGrupo < -15 && // Mais de 15% abaixo do grupo
    (ind.nome.toLowerCase().includes('margem') || 
     ind.nome.toLowerCase().includes('liquidez') ||
     ind.nome.toLowerCase().includes('receita'))
  );

  if (indicadoresCriticos.length > 0) {
    const nomeIndicador = indicadoresCriticos[0].nome;
    const performanceGrupo = indicadoresCriticos[0].performanceVsGrupo;
    
    insights.push({
      tipo: 'alerta',
      titulo: `Atenção: ${nomeIndicador} Crítico`,
      descricao: `O indicador ${nomeIndicador} está ${Math.abs(performanceGrupo).toFixed(1)}% abaixo da média do grupo. Este é um indicador fundamental que requer ação imediata.`,
      prioridade: 'alta',
      confianca: 92,
      acoes: [
        `Analisar detalhadamente os fatores que afetam ${nomeIndicador}`,
        'Implementar ações corretivas urgentes',
        'Estabelecer metas específicas de melhoria',
        'Monitorar progresso semanalmente'
      ]
    });
  }

  // Análise de tendências positivas
  const indicadoresMuitoAcima = indicadores.filter(ind => ind.performanceVsGrupo > 20);
  
  if (indicadoresMuitoAcima.length > 0) {
    const melhorIndicador = indicadoresMuitoAcima.reduce((prev, current) => 
      current.performanceVsGrupo > prev.performanceVsGrupo ? current : prev
    );
    
    insights.push({
      tipo: 'oportunidade',
      titulo: `Destaque em ${melhorIndicador.nome}`,
      descricao: `Sua empresa está ${melhorIndicador.performanceVsGrupo.toFixed(1)}% acima da média do grupo em ${melhorIndicador.nome}. Esta é uma vantagem competitiva significativa.`,
      prioridade: 'media',
      confianca: 88,
      acoes: [
        'Identificar os fatores de sucesso neste indicador',
        'Replicar estratégias bem-sucedidas em outras áreas',
        'Usar este diferencial como vantagem competitiva no mercado',
        'Comunicar este sucesso internamente para motivar equipes'
      ]
    });
  }

  // Recomendações baseadas no grupo da empresa
  if (dadosGrupo) {
    if (dadosGrupo.grupoTipo === 'porte' && dadosGrupo.grupoValor === 'pequeno') {
      insights.push({
        tipo: 'recomendacao',
        titulo: 'Estratégias para Pequenas Empresas',
        descricao: 'Como empresa de pequeno porte, foque em eficiência operacional e relacionamento próximo com clientes para competir com empresas maiores.',
        prioridade: 'media',
        confianca: 75,
        acoes: [
          'Investir em automação de processos críticos',
          'Desenvolver relacionamento próximo e personalizado com clientes',
          'Focar em nichos específicos de mercado',
          'Otimizar estrutura de custos e reduzir desperdícios'
        ]
      });
    }
    
    if (dadosGrupo.grupoTipo === 'setor') {
      insights.push({
        tipo: 'tendencia',
        titulo: `Tendências do Setor ${dadosGrupo.grupoValor}`,
        descricao: `Baseado nos dados do seu setor, identifique oportunidades específicas e prepare-se para desafios setoriais.`,
        prioridade: 'baixa',
        confianca: 70,
        acoes: [
          'Acompanhar tendências e inovações do setor',
          'Participar de associações e eventos setoriais',
          'Adaptar estratégias às características específicas do setor',
          'Monitorar concorrentes diretos regularmente'
        ]
      });
    }
  }

  // Insight sobre diversificação de performance
  const desvioPerformance = calculateStandardDeviation(indicadores.map(ind => ind.performanceVsGrupo));
  
  if (desvioPerformance > 25) {
    insights.push({
      tipo: 'recomendacao',
      titulo: 'Performance Inconsistente Entre Indicadores',
      descricao: 'Há grande variação na performance entre diferentes indicadores. Considere equilibrar o foco entre todas as áreas críticas do negócio.',
      prioridade: 'media',
      confianca: 80,
      acoes: [
        'Identificar indicadores com maior variação',
        'Desenvolver plano integrado de melhoria',
        'Balancear recursos entre diferentes áreas',
        'Implementar sistema de monitoramento unificado'
      ]
    });
  }

  console.log(`Gerados ${insights.length} insights`);
  return insights;
}

function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((sum, sq) => sum + sq, 0) / values.length;
  
  return Math.sqrt(variance);
}
