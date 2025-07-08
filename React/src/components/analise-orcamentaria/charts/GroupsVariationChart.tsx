
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { useGroupsVariationData } from './hooks/useGroupsVariationData';
import { GroupsVariationControls } from './components/GroupsVariationControls';
import { GroupsVariationPieChart } from './components/GroupsVariationPieChart';
import { GroupsVariationBarChart } from './components/GroupsVariationBarChart';
import { GroupsVariationDetailedView } from './components/GroupsVariationDetailedView';
import { GroupsVariationSummary } from './components/GroupsVariationSummary';

interface GroupsVariationChartProps {
  data: BudgetAnalysisData;
}

type ViewMode = 'pie' | 'bar' | 'detailed';
type FilterMode = 'all' | 'positive' | 'negative' | 'revenue' | 'costs' | 'indicators';

export function GroupsVariationChart({ data }: GroupsVariationChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('pie');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showPercentages, setShowPercentages] = useState(true);
  const [maxGroups, setMaxGroups] = useState(8);

  const processedData = useGroupsVariationData(data, filterMode, maxGroups);

  const renderChart = () => {
    switch (viewMode) {
      case 'pie':
        return <GroupsVariationPieChart data={processedData} showPercentages={showPercentages} />;
      case 'bar':
        return <GroupsVariationBarChart data={processedData} />;
      case 'detailed':
        return <GroupsVariationDetailedView data={processedData} />;
      default:
        return <GroupsVariationPieChart data={processedData} showPercentages={showPercentages} />;
    }
  };

  if (processedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Análise de Variações por Grupo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma variação encontrada para os filtros selecionados</p>
            <p className="text-sm mt-2">Tente ajustar os filtros ou verificar se há dados lançados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Análise de Variações por Grupo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {processedData.length} grupos
            </Badge>
          </div>
        </div>
        
        <GroupsVariationControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          maxGroups={maxGroups}
          setMaxGroups={setMaxGroups}
          showPercentages={showPercentages}
          setShowPercentages={setShowPercentages}
        />
      </CardHeader>
      
      <CardContent>
        {renderChart()}
        
        <GroupsVariationSummary data={processedData} />
      </CardContent>
    </Card>
  );
}
