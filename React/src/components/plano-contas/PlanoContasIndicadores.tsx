
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { OrcamentoGrupo } from '@/types/orcamento.types';
import { IndicadorDialog } from './components/IndicadorDialog';
import { IndicadoresTable } from './components/IndicadoresTable';
import { LoadingState, ErrorState } from './components/IndicadoresStates';
import { useIndicadorReplication } from '@/hooks/plano-contas/useIndicadorReplication';
import { useOrcamentoIndicadores } from '@/hooks/plano-contas/useOrcamentoIndicadores';

interface PlanoContasIndicadoresProps {
  indicadores: OrcamentoIndicador[];
  grupos: OrcamentoGrupo[];
  onDataChange: () => void;
  isLoading?: boolean;
}

export function PlanoContasIndicadores({ indicadores, grupos, onDataChange, isLoading = false }: PlanoContasIndicadoresProps) {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const { replicarIndicadoresParaTodos, loading: replicating } = useIndicadorReplication();
  const { invalidateAllCaches } = useOrcamentoIndicadores();

  const handleReplicar = async () => {
    console.log('[PLANO CONTAS INDICADORES] Iniciando replicação');
    
    const success = await replicarIndicadoresParaTodos();
    if (success) {
      console.log('[PLANO CONTAS INDICADORES] Replicação bem-sucedida, atualizando dados');
      
      // Forçar invalidação de caches e reload dos dados
      invalidateAllCaches();
      onDataChange();
      
      // Aguardar um pouco e forçar reload da página para garantir sincronização
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleSaveIndicador = () => {
    console.log('[PLANO CONTAS INDICADORES] Indicador salvo, forçando atualização');
    
    // Invalidar caches e forçar reload
    invalidateAllCaches();
    onDataChange();
  };

  // Se estiver carregando ou se houver erro externo
  if (loading || isLoading) {
    return <LoadingState isLoading={true} />;
  }

  // Se houver erro
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <IndicadorDialog onSave={handleSaveIndicador} />
            <Button 
              variant="outline"
              onClick={handleReplicar}
              disabled={replicating}
            >
              {replicating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Replicando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Replicar para Todos
                </>
              )}
            </Button>
          </div>
        </div>
        
        <IndicadoresTable indicadores={indicadores} onDataChange={handleSaveIndicador} />
      </CardContent>
    </Card>
  );
}
