
import React from 'react';
import { LineChart as LineChartIcon } from "lucide-react";

export function TrendChartEmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <LineChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p>Nenhum grupo disponível para análise de tendência</p>
    </div>
  );
}
