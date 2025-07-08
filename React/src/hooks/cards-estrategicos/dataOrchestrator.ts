
import { IndicadorEstrategico } from './types';
import { processStrategicCards } from './strategicCardsProcessor';

// Função simplificada - agora apenas um wrapper
export async function orchestrateCardsEstrategicosData(
  ano: number,
  empresaId: string | null | undefined,
  queryConfig: {
    user: any;
    metasIndicadores: any;
    metasIndicadoresEmpresa: any;
    indicadoresEmpresa: any;
    indicadoresPlanoContas: any[] | undefined;
  }
): Promise<IndicadorEstrategico[]> {
  console.log('=== DATA ORCHESTRATOR (SIMPLIFIED) ===');
  console.log('Delegating to processStrategicCards...');

  return await processStrategicCards(
    ano,
    empresaId,
    queryConfig.user,
    queryConfig.metasIndicadores,
    queryConfig.metasIndicadoresEmpresa,
    queryConfig.indicadoresEmpresa,
    queryConfig.indicadoresPlanoContas
  );
}
