
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart as PieChartIcon, BarChart3, Eye, Filter } from "lucide-react";


export function GroupsVariationControls() {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="flex items-center gap-2">
        <Button
        >
          <PieChartIcon className="h-4 w-4 mr-1" />
          Pizza
        </Button>
      </div>

    </div>
  );
}
