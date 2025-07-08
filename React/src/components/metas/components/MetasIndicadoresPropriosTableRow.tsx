
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { formatarPeriodo, formatarValor, getTrendBadge, getTipoBadge } from '../utils/metasTableUtils';
import { isGroupedMetaEmpresa, GroupedMetaEmpresa } from '../utils/metasGroupingUtils';
import { EditarMetaIndicadorProprioDialog } from '../EditarMetaIndicadorProprioDialog';

interface MetasIndicadoresPropriosTableRowProps {
  meta: MetaIndicadorEmpresaCompleta | GroupedMetaEmpresa;
  isDeleting: boolean;
  onDeleteClick: (meta: MetaIndicadorEmpresaCompleta | GroupedMetaEmpresa) => void;
}

export function MetasIndicadoresPropriosTableRow({ 
  meta, 
  isDeleting, 
  onDeleteClick 
}: MetasIndicadoresPropriosTableRowProps) {
  const indicador = meta.indicador_empresa;
  const isGrouped = isGroupedMetaEmpresa(meta);
  
  const getStatusBadge = () => {
    if (isGrouped) {
      return <Badge variant="outline">Múltiplas</Badge>;
    }
    
    const valorRealizado = (meta as MetaIndicadorEmpresaCompleta).valor_realizado || 0;
    const valorMeta = meta.valor_meta;
    
    if (valorRealizado >= valorMeta) {
      return <Badge variant="default" className="bg-green-500">Atingida</Badge>;
    } else if (valorRealizado >= valorMeta * 0.8) {
      return <Badge variant="secondary">Próxima</Badge>;
    } else {
      return <Badge variant="destructive">Abaixo</Badge>;
    }
  };

  const getUnidade = () => {
    if (meta.tipo_valor === 'percentual') return '%';
    return indicador?.unidade || 'un';
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{indicador?.nome}</div>
          <div className="text-sm text-muted-foreground">{indicador?.codigo}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div>{formatarPeriodo(meta)}</div>
          <div className="flex gap-1">
            {getTipoBadge(meta.tipo_meta)}
            {getTrendBadge(indicador?.melhor_quando)}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        {formatarValor(meta.valor_meta, getUnidade())}
      </TableCell>
      
      <TableCell>
        {isGrouped ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          formatarValor((meta as MetaIndicadorEmpresaCompleta).valor_realizado || 0, getUnidade())
        )}
      </TableCell>
      
      <TableCell>
        {getStatusBadge()}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          {!isGrouped && (
            <EditarMetaIndicadorProprioDialog
              meta={meta as MetaIndicadorEmpresaCompleta}
              trigger={
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteClick(meta)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
