import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface TrendChartOption {
  value: string;
  label: string;
  color: string;
}

interface TrendChartSelectorProps {
  selectedGroup: string;
  onGroupChange: (value: string) => void;
  availableOptions: TrendChartOption[];
}

export function TrendChartSelector({
  selectedGroup,
  onGroupChange,
  availableOptions
}: TrendChartSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedGroup} onValueChange={onGroupChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecionar grupo" />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
