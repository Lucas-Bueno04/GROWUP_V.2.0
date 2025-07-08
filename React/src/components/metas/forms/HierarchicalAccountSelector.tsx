
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calculator, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrcamentoHierarquia } from '@/hooks/metas/useOrcamentoHierarquia';

interface HierarchicalAccountSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export function HierarchicalAccountSelector({
  value,
  onValueChange,
  label,
  placeholder
}: HierarchicalAccountSelectorProps) {
  const { data: hierarquia = [], isLoading } = useOrcamentoHierarquia();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getSelectedLabel = () => {
    if (!value) return placeholder;
    
    // Check if it's a group
    const selectedGroup = hierarquia.find(grupo => grupo.id === value);
    if (selectedGroup) {
      return `${selectedGroup.codigo} - ${selectedGroup.nome}`;
    }
    
    // Check if it's an account
    for (const grupo of hierarquia) {
      const selectedAccount = grupo.contas.find(conta => conta.id === value);
      if (selectedAccount) {
        return `${selectedAccount.codigo} - ${selectedAccount.nome}`;
      }
    }
    
    return placeholder;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue>
            {getSelectedLabel()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {hierarquia.map((grupo) => (
            <div key={grupo.id}>
              {/* Group Item */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleGroup(grupo.id);
                  }}
                >
                  {expandedGroups.has(grupo.id) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <SelectItem value={grupo.id} className="flex-1">
                  <div className="flex items-center gap-2">
                    {grupo.tipo_calculo === 'calculado' ? (
                      <Calculator className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">
                      {grupo.codigo} - {grupo.nome}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({grupo.tipo_calculo})
                    </span>
                  </div>
                </SelectItem>
              </div>
              
              {/* Accounts under this group */}
              {expandedGroups.has(grupo.id) && grupo.contas.map((conta) => (
                <SelectItem 
                  key={conta.id} 
                  value={conta.id}
                  className="ml-8"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <span>{conta.codigo} - {conta.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      ({conta.sinal})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
