
import React, { useMemo } from 'react';
import { OrcamentoGridHeaderRow } from './OrcamentoGridHeaderRow';
import { OrcamentoGridGroupRow } from './OrcamentoGridGroupRow';
import { OrcamentoGridAccountRow } from './OrcamentoGridAccountRow';
import { OrcamentoGridTotalRow } from './OrcamentoGridTotalRow';
import { useOrcamentoGruposValores, useRecalcularGruposValores } from '@/hooks/orcamento-grupos-valores';
import type { OrcamentoEmpresaValor } from '@/hooks/useOrcamentoEmpresas';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface OrcamentoGridTableOptimizedProps {
  grupos: any[];
  contas: any[];
  valores: OrcamentoEmpresaValor[];
  orcamentoEmpresaId: string;
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
  onReplicateMonth?: (mes: number, tipo: 'orcado' | 'realizado') => void;
}

interface OptimizedGroupResult {
  monthlyValues: number[];
  total: number;
}

export function OrcamentoGridTableOptimized({
  grupos,
  contas,
  valores,
  orcamentoEmpresaId,
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
}: OrcamentoGridTableOptimizedProps) {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const typeColor = tipo === 'orcado' ? 'blue' : 'green';

  // Fetch materialized group values
  const { data: gruposValores, isLoading: isLoadingGrupos } = useOrcamentoGruposValores(orcamentoEmpresaId);
  const { mutate: recalcularGrupos, isPending: isRecalculating } = useRecalcularGruposValores();

  // Sort groups by ordem to ensure correct calculation order
  const sortedGroups = useMemo(() => {
    return [...(grupos || [])].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  }, [grupos]);

  // Calculate group values using materialized data
  const groupCalculations = useMemo(() => {
    const calculations = new Map<string, OptimizedGroupResult>();
    
    console.log(`=== OPTIMIZED GRID TABLE - USING MATERIALIZED VALUES ===`);
    console.log(`Processing ${sortedGroups.length} groups for tipo: ${tipo}`);
    console.log(`Materialized values available: ${gruposValores?.length || 0}`);
    
    if (sortedGroups && gruposValores) {
      sortedGroups.forEach(grupo => {
        console.log(`Processing group ${grupo.codigo} (${grupo.nome})`);
        
        const monthlyValues = Array(12).fill(0);
        let total = 0;
        
        // Get materialized values for this group
        const grupoValoresList = gruposValores.filter(gv => gv.grupo_id === grupo.id);
        console.log(`Found ${grupoValoresList.length} materialized values for group ${grupo.codigo}`);
        
        if (grupoValoresList.length > 0) {
          // Use materialized values
          grupoValoresList.forEach(gv => {
            const valor = tipo === 'orcado' ? gv.valor_orcado : gv.valor_calculado;
            monthlyValues[gv.mes - 1] = valor;
            total += valor;
          });
          console.log(`✅ Using materialized values for ${grupo.codigo}:`, { total });
        } else {
          // Fallback to manual calculation for suma groups only
          if (grupo.tipo_calculo === 'soma') {
            console.log(`⚠️ No materialized values found for sum group ${grupo.codigo}, calculating manually`);
            
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
            }
          } else {
            console.warn(`❌ No materialized values for calculated group ${grupo.codigo} - needs recalculation`);
          }
        }
        
        calculations.set(grupo.id, { monthlyValues, total });
        console.log(`✅ Group ${grupo.codigo} processed:`, { total });
      });
    }
    
    console.log(`=== END OPTIMIZED GRID TABLE CALCULATIONS ===`);
    return calculations;
  }, [sortedGroups, gruposValores, contas, valores, tipo]);

  const handleRecalculate = () => {
    console.log('🔄 Manual recalculation triggered');
    recalcularGrupos({ orcamentoEmpresaId });
  };

  return (
    <div className="space-y-4">
      {/* Recalculation Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoadingGrupos 
            ? 'Carregando valores materializados...' 
            : `${gruposValores?.length || 0} valores de grupos materializados`
          }
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
          {isRecalculating ? 'Recalculando...' : 'Recalcular Grupos'}
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]" style={{ scrollbarWidth: 'thin' }}>
          <table className="w-full border-collapse" style={{ minWidth: '1600px' }}>
            <thead className="sticky top-0 z-10">
              <OrcamentoGridHeaderRow 
                meses={meses} 
                onReplicateMonth={(mes) => onReplicateMonth?.(mes, tipo)}
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
    </div>
  );
}
