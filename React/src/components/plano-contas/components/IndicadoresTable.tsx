import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { IndicatorResponse } from '@/components/interfaces/IndicadorResponse';

interface IndicadoresTableProps {
  indicadores: IndicatorResponse[];
  onDelete: (id: number) => void;
}

export function IndicadoresTable({ indicadores, onDelete }: IndicadoresTableProps) {

  const renderMelhorQuando = (melhorQuando: string) => {
    const isMaior = melhorQuando === 'maior';
    return (
      <Badge variant={isMaior ? "default" : "secondary"} className="flex items-center gap-1">
        {isMaior ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isMaior ? 'Maior' : 'Menor'}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-40">Fórmula</TableHead>
            <TableHead className="w-24">Unidade</TableHead>
            <TableHead className="w-40">Melhor Quando</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicadores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum indicador cadastrado
              </TableCell>
            </TableRow>
          ) : (
            indicadores.map((indicador) => (
              <TableRow key={indicador.id}>
                <TableCell className="font-mono text-sm">{indicador.cod}</TableCell>
                <TableCell className="font-medium">{indicador.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {indicador.description}
                </TableCell>
                <TableCell className="font-mono text-xs bg-muted/50 rounded px-2 py-1">
                  {indicador.formula}
                </TableCell>
                <TableCell>{indicador.unity}</TableCell>
                <TableCell>{renderMelhorQuando(indicador.betterWhen || 'maior')}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(indicador.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
