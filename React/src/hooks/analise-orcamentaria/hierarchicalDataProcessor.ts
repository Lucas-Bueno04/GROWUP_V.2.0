
import { calculateGroupTotals, calculateMonthlyGroupData } from './calculationUtils';
import { MESES } from './monthlyDataProcessor';
import { evaluateUnifiedFormula } from './unifiedFormulaEvaluator';

export const processHierarchicalData = (gruposArray: any[], valoresArray: any[]) => {
  console.log('=== PROCESSING HIERARCHICAL DATA ===');
  console.log(`Processing ${gruposArray.length} groups with ${valoresArray.length} values`);
  
  return {
    grupos: gruposArray.map(grupo => {
      console.log(`Processing group: ${grupo.codigo} - ${grupo.nome} (${grupo.tipo_calculo})`);
      
      const contasDoGrupo = (grupo.orcamento_contas || []).map((conta: any) => {
        // Calculate totals for this account
        const valoresConta = valoresArray.filter(v => {
          if (!v.conta || Array.isArray(v.conta)) return false;
          return (v.conta as any).id === conta.id;
        });

        const orcadoConta = valoresConta.reduce((sum, v) => {
          const valorComSinal = conta.sinal === '+' ? (v.valor_orcado || 0) : -(v.valor_orcado || 0);
          return sum + valorComSinal;
        }, 0);
        
        const realizadoConta = valoresConta.reduce((sum, v) => {
          const valorComSinal = conta.sinal === '+' ? (v.valor_realizado || 0) : -(v.valor_realizado || 0);
          return sum + valorComSinal;
        }, 0);

        // Monthly data for this account
        const dadosmensaisConta = MESES.map((_, index) => {
          const mesValor = valoresConta.find(v => v.mes === index + 1);
          const orcadoMensal = mesValor?.valor_orcado || 0;
          const realizadoMensal = mesValor?.valor_realizado || 0;
          
          return {
            mes: index + 1,
            orcado: conta.sinal === '+' ? orcadoMensal : -orcadoMensal,
            realizado: conta.sinal === '+' ? realizadoMensal : -realizadoMensal
          };
        });

        return {
          id: conta.id,
          codigo: conta.codigo,
          nome: conta.nome,
          sinal: conta.sinal,
          ordem: conta.ordem,
          orcado: orcadoConta,
          realizado: realizadoConta,
          variancia: realizadoConta - orcadoConta,
          dadosMensais: dadosmensaisConta
        };
      }).sort((a: any, b: any) => a.ordem - b.ordem);

      // Calculate group totals - handle both sum and calculated groups
      let orcadoGrupo = 0;
      let realizadoGrupo = 0;
      
      if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
        console.log(`Using unified formula evaluator for ${grupo.codigo}: "${grupo.formula}"`);
        orcadoGrupo = evaluateUnifiedFormula(grupo.formula, gruposArray, valoresArray, 'orcado');
        realizadoGrupo = evaluateUnifiedFormula(grupo.formula, gruposArray, valoresArray, 'realizado');
        console.log(`Formula results for ${grupo.codigo}: orcado=${orcadoGrupo}, realizado=${realizadoGrupo}`);
      } else {
        console.log(`Using sum calculation for ${grupo.codigo}`);
        orcadoGrupo = contasDoGrupo.reduce((sum: number, conta: any) => sum + conta.orcado, 0);
        realizadoGrupo = contasDoGrupo.reduce((sum: number, conta: any) => sum + conta.realizado, 0);
        console.log(`Sum results for ${grupo.codigo}: orcado=${orcadoGrupo}, realizado=${realizadoGrupo}`);
      }

      // Calculate monthly data for groups
      const dadosMensaisGrupo = MESES.map((_, index) => {
        const mes = index + 1;
        let orcadoMes = 0;
        let realizadoMes = 0;
        
        if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
          // For calculated groups, evaluate formula for this specific month
          orcadoMes = evaluateUnifiedFormula(grupo.formula, gruposArray, valoresArray, 'orcado', mes);
          realizadoMes = evaluateUnifiedFormula(grupo.formula, gruposArray, valoresArray, 'realizado', mes);
        } else {
          // For sum groups, sum the accounts for this month
          orcadoMes = contasDoGrupo.reduce((sum: number, conta: any) => {
            const mesData = conta.dadosMensais.find((m: any) => m.mes === mes);
            return sum + (mesData?.orcado || 0);
          }, 0);
          realizadoMes = contasDoGrupo.reduce((sum: number, conta: any) => {
            const mesData = conta.dadosMensais.find((m: any) => m.mes === mes);
            return sum + (mesData?.realizado || 0);
          }, 0);
        }
        
        return {
          mes,
          orcado: orcadoMes,
          realizado: realizadoMes
        };
      });

      return {
        id: grupo.id,
        codigo: grupo.codigo,
        nome: grupo.nome,
        sinal: '+' as const, // Groups don't have signs, only accounts do
        ordem: grupo.ordem,
        tipo_calculo: grupo.tipo_calculo,
        formula: grupo.formula,
        orcado: orcadoGrupo,
        realizado: realizadoGrupo,
        variancia: realizadoGrupo - orcadoGrupo,
        contas: contasDoGrupo,
        dadosMensais: dadosMensaisGrupo
      };
    }).sort((a, b) => a.ordem - b.ordem)
  };
};
