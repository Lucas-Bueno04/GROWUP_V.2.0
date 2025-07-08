
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GoalsProgress, 
  CompanyStatus,
  RecentActivity
} from '@/components/dashboard';
import { MediasComparativasWidget } from '@/components/dashboard/MediasComparativasWidget';
import { MediasComparativasDetalhadas } from '@/components/dashboard/MediasComparativasDetalhadas';
import { RankingIndicadores } from '@/components/dashboard/RankingIndicadores';
import { DashboardIntelligente, AnaliseComparativaIA } from '@/components/dashboard/intelligent';
import { Brain, BarChart3, Target, Activity } from 'lucide-react';

interface DashboardMainContentProps {
  metasIndicadoresEmpresa: any[];
  empresas: any[];
  showDetailedAnalysis: boolean;
  onShowDetailedAnalysis: (show: boolean) => void;
  orcamentos: any[];
  alertas: any[];
}

export function DashboardMainContent({
  metasIndicadoresEmpresa,
  empresas,
  showDetailedAnalysis,
  onShowDetailedAnalysis,
  orcamentos,
  alertas
}: DashboardMainContentProps) {
  return (
    <div className="xl:col-span-3 space-y-6">
      <Tabs defaultValue="inteligente" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inteligente" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Dashboard IA
          </TabsTrigger>
          <TabsTrigger value="tradicional" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tradicional
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Comparativo
          </TabsTrigger>
          <TabsTrigger value="atividades" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Atividades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inteligente" className="space-y-6">
          <DashboardIntelligente />
        </TabsContent>

        <TabsContent value="tradicional" className="space-y-6">
          {/* Grid de Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progresso das Metas */}
            <GoalsProgress metas={metasIndicadoresEmpresa || []} />
            
            {/* Status das Empresas */}
            <CompanyStatus empresas={empresas || []} />
          </div>

          {/* Seção de Benchmarking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Widget de Médias Comparativas */}
            <MediasComparativasWidget />
            
            {/* Ranking de Indicadores */}
            <RankingIndicadores compact={true} />
          </div>

          {/* Análise Comparativa Detalhada - Condicional */}
          {showDetailedAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Análise Detalhada de Benchmarking</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onShowDetailedAnalysis(false)}
                >
                  Ocultar
                </Button>
              </div>
              <MediasComparativasDetalhadas />
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-6">
          <AnaliseComparativaIA />
        </TabsContent>

        <TabsContent value="atividades" className="space-y-6">
          {/* Atividades Recentes */}
          <RecentActivity 
            orcamentos={orcamentos || []}
            alertas={alertas || []}
            empresas={empresas || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
