
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Edit, Trash2 } from "lucide-react";
import { IndicadorEmpresa, MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { MetaIndicadorProprioDialog } from '../MetaIndicadorProprioDialog';
import { EditarIndicadorProprioDialog } from '../EditarIndicadorProprioDialog';
import { DeleteIndicadorProprioDialog } from '../DeleteIndicadorProprioDialog';
import { getTrendBadge, getMetasDoIndicador } from '../utils/indicadoresPropriosUtils';

interface IndicadoresPropriosGridProps {
  indicadores: IndicadorEmpresa[];
  metasIndicadoresProprios: MetaIndicadorEmpresaCompleta[];
}

export function IndicadoresPropriosGrid({ indicadores, metasIndicadoresProprios }: IndicadoresPropriosGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Indicadores Personalizados</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indicador</TableHead>
              <TableHead>Fórmula</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Tendência</TableHead>
              <TableHead>Metas Ativas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicadores.map((indicador) => {
              const metas = getMetasDoIndicador(indicador.id, metasIndicadoresProprios);
              return (
                <TableRow key={indicador.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{indicador.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {indicador.codigo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono text-muted-foreground max-w-[200px] truncate">
                      {indicador.formula}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{indicador.unidade}</span>
                  </TableCell>
                  <TableCell>
                    {getTrendBadge(indicador.melhor_quando)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {metas.length} meta(s)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <MetaIndicadorProprioDialog 
                        empresaId={indicador.empresa_id}
                        indicadorId={indicador.id}
                        trigger={
                          <Button size="sm" variant="outline">
                            <Target className="h-4 w-4 mr-2" />
                            Nova Meta
                          </Button>
                        }
                      />
                      <EditarIndicadorProprioDialog
                        indicador={indicador}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteIndicadorProprioDialog
                        indicador={indicador}
                        trigger={
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
