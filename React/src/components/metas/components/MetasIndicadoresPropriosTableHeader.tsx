
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MetasIndicadoresPropriosTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Indicador</TableHead>
        <TableHead>Período</TableHead>
        <TableHead>Meta</TableHead>
        <TableHead>Realizado</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
