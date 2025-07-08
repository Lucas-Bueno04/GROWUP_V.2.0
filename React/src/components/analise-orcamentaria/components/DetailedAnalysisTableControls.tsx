
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";

interface DetailedAnalysisTableControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
}

export function DetailedAnalysisTableControls({
  searchTerm,
  onSearchChange,
  onExport
}: DetailedAnalysisTableControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou código..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
      </div>
      <Button variant="outline" onClick={onExport} size="sm">
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
}
