// GroupRow.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {AccountRow} from "./AccountRow";

interface Account {
  id: number;
  cod: string;
  name: string;
  budgeted: number;
  carried: number;
}

interface Group {
  id: number;
  cod: string;
  name: string;
  budgeted: number;
  carried: number;
  accounts: Account[];
}

interface GroupRowProps {
  grupo: Group;
  isExpanded: boolean;
  onToggle: () => void;
}
export  function GroupRow({ grupo, isExpanded, onToggle }: GroupRowProps) {
  const diff = grupo.carried - grupo.budgeted;
  const diffColor = diff >= 0 ? "text-green-600" : "text-red-600";

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="border rounded-lg border-gray-300">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer select-none">
            <div className="flex items-center gap-3">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold">{grupo.cod}</span>
                  <span className="font-medium text-sm">{grupo.name}</span>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                  <span>Orçado: {grupo.budgeted.toFixed(2)}</span>
                  <span>Realizado: {grupo.carried.toFixed(2)}</span>
                  <span className={diffColor}>Dif: {diff.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {grupo.accounts.length} conta{grupo.accounts.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t bg-muted/20 p-4">
            {grupo.accounts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">Nenhuma conta cadastrada neste grupo</p>
                <p className="text-xs mt-1">Use o gerenciamento para adicionar contas específicas</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Contas Detalhadas:</h4>
                {grupo.accounts.map(account => (
                  <AccountRow key={account.id} {...account} />
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}