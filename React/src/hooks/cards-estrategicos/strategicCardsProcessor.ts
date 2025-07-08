
import { IndicadorEstrategico } from './types';
import { fetchBudgetData } from './dataFetcher';
import { processPlanIndicators } from './planIndicatorsProcessor';
import { processCompanyIndicators } from './companyIndicatorsProcessor';

export async function processStrategicCards(
  ano: number,
  empresaId: string | null | undefined,
  user: any,
  metasIndicadores: any,
  metasIndicadoresEmpresa: any,
  indicadoresEmpresa: any,
  indicadoresPlanoContas: any[] | undefined
): Promise<IndicadorEstrategico[]> {
  if (!user?.id) {
    console.log('No user ID, returning empty array');
    return [];
  }

  console.log(`=== PROCESSING STRATEGIC CARDS FOR YEAR ${ano} ===`);
  console.log(`User: ${user.id} (${user.role})`);
  console.log(`Company filter: ${empresaId || 'all companies'}`);

  try {
    // Buscar dados orçamentários filtrados por empresa
    const { grupos, valores } = await fetchBudgetData(ano, empresaId);
    
    console.log(`Fetched budget data: ${grupos.length} groups, ${valores.length} values for company ${empresaId || 'all companies'}`);
    
    let allIndicadores: IndicadorEstrategico[] = [];

    // Processar indicadores do plano de contas (se disponíveis)
    if (indicadoresPlanoContas && metasIndicadores.data) {
      console.log('Processing plan indicators...');
      const planIndicators = await processPlanIndicators(
        indicadoresPlanoContas,
        metasIndicadores,
        grupos,
        valores,
        ano,
        empresaId // Passar empresaId para filtragem
      );
      allIndicadores = [...allIndicadores, ...planIndicators];
      console.log(`Added ${planIndicators.length} plan indicators`);
    }

    // Processar indicadores próprios da empresa (se disponíveis)
    if (indicadoresEmpresa.indicadoresProprios.data && metasIndicadoresEmpresa.data) {
      console.log('Processing company indicators...');
      const companyIndicators = await processCompanyIndicators(
        indicadoresEmpresa,
        metasIndicadoresEmpresa,
        grupos,
        valores,
        ano,
        empresaId // Passar empresaId para filtragem
      );
      allIndicadores = [...allIndicadores, ...companyIndicators];
      console.log(`Added ${companyIndicators.length} company indicators`);
    }

    console.log(`=== STRATEGIC CARDS PROCESSING COMPLETED ===`);
    console.log(`Total indicators: ${allIndicadores.length} for company ${empresaId || 'all companies'}`);
    
    return allIndicadores;
  } catch (error) {
    console.error('=== STRATEGIC CARDS PROCESSING ERROR ===', error);
    throw error;
  }
}
