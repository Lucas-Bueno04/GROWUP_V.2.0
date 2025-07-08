
import React, { useMemo } from 'react';
import { OrcamentoGridHeaderRow } from './OrcamentoGridHeaderRow';
import { OrcamentoGridGroupRow } from './OrcamentoGridGroupRow';
import { OrcamentoGridAccountRow } from './OrcamentoGridAccountRow';
import { OrcamentoGridTotalRow } from './OrcamentoGridTotalRow';
import { evaluateUnifiedFormula } from '@/hooks/analise-orcamentaria/unifiedFormulaEvaluator';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoGridTableProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  tipo: 'orcado' | 'realizado';
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onTempValueChange: (key: string, value: number) => void;
  onCancelEdit?: () => void;
  onReplicateValue?: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onReplicateMonth?: (mes: number) => void;
}

interface SimplifiedGroupResult {
  monthlyValues: number[];
  total: number;
}

export function OrcamentoGridTable({
  grupos,
  contas,
  valores,
  tipo,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onCancelEdit,
  onReplicateValue,
  onReplicateMonth
}: OrcamentoGridTableProps) {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const typeColor = tipo === 'orcado' ? 'blue' : 'green';

  // Sort groups by ordem to ensure correct calculation order
  const sortedGroups = useMemo(() => {
    return [...(grupos || [])].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  }, [grupos]);

  // Transform orcamento data structure to match analise-orcamentaria format
  const transformedValues = useMemo(() => {
    console.log(`=== TRANSFORMING ORCAMENTO DATA FOR UNIFIED FORMULA ===`);
    console.log(`Input: ${valores?.length || 0} values, ${contas?.length || 0} accounts, ${grupos?.length || 0} groups`);
    
    if (!valores || !contas || !grupos) {
      console.warn('Missing required data for transformation');
      return [];
    }

    const transformed = valores.map(valor => {
      const conta = contas.find(c => c.id === valor.conta_id);
      const grupo = conta ? grupos.find(g => g.id === conta.grupo_id) : null;
      
      if (!conta || !grupo) {
        console.warn(`Missing conta or grupo for value`, { valor: valor.id, conta: conta?.id, grupo: grupo?.id });
        return null;
      }
      
      return {
        ...valor,
        conta: {
          id: conta.id,
          codigo: conta.codigo,
          nome: conta.nome,
          sinal: conta.sinal,
          grupo: {
            id: grupo.id,
            codigo: grupo.codigo,
            nome: grupo.nome,
            tipo_calculo: grupo.tipo_calculo,
            formula: grupo.formula
          }
        }
      };
    }).filter(Boolean);
    
    console.log(`Transformed ${transformed.length} values successfully`);
    console.log(`=== END TRANSFORMING ORCAMENTO DATA ===`);
    
    return transformed;
  }, [valores, contas, grupos]);

  // Simplified group calculation using unified formula evaluator
  const calculateSimplifiedGroupValue = (grupo: any): SimplifiedGroupResult => {
    console.log(`=== SIMPLIFIED GROUP CALCULATION FOR ${grupo.codigo} ===`);
    console.log(`Group details:`, {
      id: grupo.id,
      codigo: grupo.codigo,
      nome: grupo.nome,
      tipo_calculo: grupo.tipo_calculo,
      formula: grupo.formula || 'N/A'
    });
    
    const monthlyValues = Array(12).fill(0);
    let total = 0;
    
    if (grupo.tipo_calculo === 'soma') {
      console.log(`Processing sum calculation for group ${grupo.codigo}`);
      
      // Calculate monthly values by summing accounts in this group
      for (let mes = 1; mes <= 12; mes++) {
        const groupAccounts = contas?.filter(conta => conta.grupo_id === grupo.id) || [];
        let monthValue = 0;
        
        groupAccounts.forEach(conta => {
          const accountValues = valores?.filter(v => v.conta_id === conta.id && v.mes === mes) || [];
          accountValues.forEach(valor => {
            const rawValue = tipo === 'orcado' ? valor.valor_orcado : valor.valor_realizado;
            const signedValue = conta.sinal === '+' ? rawValue : -Math.abs(rawValue);
            monthValue += signedValue || 0;
          });
        });
        
        monthlyValues[mes - 1] = monthValue;
        total += monthValue;
        console.log(`  Month ${mes}: ${monthValue}`);
      }
      
    } else if (grupo.tipo_calculo === 'calculado' && grupo.formula) {
      console.log(`Processing calculated formula for ${grupo.codigo}: "${grupo.formula}"`);
      
      // Calculate each month using the unified formula evaluator
      for (let mes = 1; mes <= 12; mes++) {
        const monthValue = evaluateUnifiedFormula(
          grupo.formula,
          sortedGroups,
          transformedValues,
          tipo,
          mes,
          undefined,
          false // not annual
        );
        
        monthlyValues[mes - 1] = monthValue;
        total += monthValue;
        console.log(`  Month ${mes}: ${monthValue}`);
      }
      
    } else {
      console.warn(`Group ${grupo.codigo} has unsupported calculation type: ${grupo.tipo_calculo}`);
    }
    
    console.log(`✅ Final result for ${grupo.codigo}: monthly=[${monthlyValues.join(', ')}], total=${total}`);
    console.log(`=== END SIMPLIFIED GROUP CALCULATION FOR ${grupo.codigo} ===`);
    
    return { monthlyValues, total };
  };

  // Calculate group values using simplified approach
  const groupCalculations = useMemo(() => {
    const calculations = new Map();
    
    console.log(`=== ORCAMENTO GRID TABLE - CALCULATING GROUP VALUES ===`);
    console.log(`Processing ${sortedGroups.length} groups for tipo: ${tipo}`);
    
    if (sortedGroups && contas && valores) {
      sortedGroups.forEach(grupo => {
        console.log(`Calculating group ${grupo.codigo} (${grupo.nome})`);
        
        const calculation = calculateSimplifiedGroupValue(grupo);
        
        calculations.set(grupo.id, calculation);
        console.log(`✅ Group ${grupo.codigo} calculated:`, calculation);
      });
    }
    
    console.log(`=== END ORCAMENTO GRID TABLE CALCULATIONS ===`);
    return calculations;
  }, [sortedGroups, contas, valores, tipo, transformedValues]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]" style={{ scrollbarWidth: 'thin' }}>
        <table className="w-full border-collapse" style={{ minWidth: '1600px' }}>
          <thead className="sticky top-0 z-10">
            <OrcamentoGridHeaderRow 
              meses={meses} 
              onReplicateMonth={onReplicateMonth}
              podeEditar={podeEditar}
              tipo={tipo}
            />
          </thead>
          <tbody>
            {sortedGroups?.map((grupo) => (
              <React.Fragment key={grupo.id}>
                <OrcamentoGridGroupRow 
                  grupo={grupo} 
                  typeColor={typeColor}
                  calculationResult={groupCalculations.get(grupo.id)}
                />
                {contas?.filter(conta => conta.grupo_id === grupo.id).map((conta) => (
                  <OrcamentoGridAccountRow
                    key={conta.id}
                    conta={conta}
                    valores={valores}
                    tipo={tipo}
                    podeEditar={podeEditar}
                    editingCell={editingCell}
                    tempValues={tempValues}
                    isUpdating={isUpdating}
                    onCellEdit={onCellEdit}
                    onSaveValue={onSaveValue}
                    onTempValueChange={onTempValueChange}
                    onCancelEdit={onCancelEdit}
                    onReplicateValue={onReplicateValue}
                  />
                ))}
              </React.Fragment>
            ))}
            <OrcamentoGridTotalRow
              contas={contas}
              valores={valores}
              tipo={tipo}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
