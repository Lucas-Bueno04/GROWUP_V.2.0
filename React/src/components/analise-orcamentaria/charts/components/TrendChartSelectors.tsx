
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface TrendChartOption {
  value: string;
  label: string;
  color: string;
}

interface TrendChartSelectorsProps {
  selectedGroup1: string;
  selectedGroup2: string;
  onGroup1Change: (value: string) => void;
  onGroup2Change: (value: string) => void;
  availableOptions: TrendChartOption[];
}

export function TrendChartSelectors({
  selectedGroup1,
  selectedGroup2,
  onGroup1Change,
  onGroup2Change,
  availableOptions
}: TrendChartSelectorsProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Select value={selectedGroup1} onValueChange={onGroup1Change}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecionar primeira série" />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">vs</span>
        <Select value={selectedGroup2} onValueChange={onGroup2Change}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecionar segunda série" />
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
    </div>
  );
}
