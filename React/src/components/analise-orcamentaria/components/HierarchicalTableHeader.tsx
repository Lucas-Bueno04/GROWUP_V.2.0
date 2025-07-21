
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar } from "lucide-react";



export function HierarchicalTableHeader() {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Análise Hierárquica por Grupo e Conta</CardTitle>
      </div>
    </CardHeader>
  );
}
