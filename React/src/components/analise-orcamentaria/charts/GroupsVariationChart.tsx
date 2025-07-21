
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



export function GroupsVariationChart({months, budgetId}) {
  return (
    <Card>
      
      <CardContent>
        
        <GroupsVariationPieChart showPercentages={true} months={months} budgetId={budgetId}/>;
      </CardContent>
    </Card>
  );
}
