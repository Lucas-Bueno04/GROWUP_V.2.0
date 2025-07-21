
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';
import { ReceitaLiquidaChart } from './charts/ReceitaLiquidaChart';
import { TrendChart } from './charts/TrendChart';
import { GroupsVariationChart } from './charts/GroupsVariationChart';
import { ChartLoadingState } from './charts/ChartLoadingState';
import { ChartEmptyState } from './charts/ChartEmptyState';

interface BudgetComparisonChartsProps {
  budgetId:number
  isLoading?: boolean;
  months:string[]
}

export function BudgetComparisonCharts({ budgetId, isLoading , months}: BudgetComparisonChartsProps) {
  if (isLoading) {
    return <ChartLoadingState />;
  }


 

  return (
    <div className="mb-6">
      <Tabs defaultValue="receita-liquida" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="receita-liquida" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Receita Líquida
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Tendência
          </TabsTrigger>
          <TabsTrigger value="grupos" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Grupos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="receita-liquida">
          <ReceitaLiquidaChart budgetId={budgetId}  />
        </TabsContent>
        
        <TabsContent value="trend">
          <TrendChart id={budgetId} />
        </TabsContent>
        
        <TabsContent value="grupos">
          <GroupsVariationChart months={months} budgetId={budgetId}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
