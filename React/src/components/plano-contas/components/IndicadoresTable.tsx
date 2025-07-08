
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { EditIndicadorDialog } from './EditIndicadorDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface IndicadoresTableProps {
  indicadores: OrcamentoIndicador[];
  onDataChange: () => void;
}

export function IndicadoresTable({ indicadores, onDataChange }: IndicadoresTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (indicadorId: string) => {
    setDeleting(indicadorId);
    
    try {
      const { error } = await supabase
        .from('orcamento_indicadores')
        .delete()
        .eq('id', indicadorId);

      if (error) throw error;

      toast.success('Indicador excluído com sucesso!');
      onDataChange();
    } catch (error) {
      console.error('Erro ao excluir indicador:', error);
      toast.error('Erro ao excluir indicador');
    } finally {
      setDeleting(null);
    }
  };

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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-32">Fórmula</TableHead>
            <TableHead className="w-20">Unidade</TableHead>
            <TableHead className="w-32">Melhor Quando</TableHead>
            <TableHead className="w-20">Ordem</TableHead>
            <TableHead className="w-32">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicadores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Nenhum indicador cadastrado
              </TableCell>
            </TableRow>
          ) : (
            indicadores
              .sort((a, b) => a.ordem - b.ordem)
              .map((indicador) => (
                <TableRow key={indicador.id}>
                  <TableCell className="font-mono text-sm">{indicador.codigo}</TableCell>
                  <TableCell className="font-medium">{indicador.nome}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {indicador.descricao}
                  </TableCell>
                  <TableCell className="font-mono text-xs bg-muted/50 rounded px-2 py-1">
                    {indicador.formula}
                  </TableCell>
                  <TableCell>{indicador.unidade}</TableCell>
                  <TableCell>
                    {renderMelhorQuando(indicador.melhor_quando || 'maior')}
                  </TableCell>
                  <TableCell className="text-center">{indicador.ordem}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EditIndicadorDialog
                        indicador={indicador}
                        onSave={onDataChange}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(indicador.id)}
                        disabled={deleting === indicador.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
