
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Edit3 } from "lucide-react";
import { MetaIndicadorCompleta } from '@/types/metas.types';
import { EditarMetaIndicadorDialog } from '../EditarMetaIndicadorDialog';
import { EditarMetaAgrupadaDialog } from '../EditarMetaAgrupadaDialog';
import { isGroupedMeta } from '../utils/metasGroupingUtils';
import { getTrendBadge, getTipoBadge, formatarPeriodo, formatarValor } from '../utils/metasTableUtils';

interface MetasIndicadoresTableRowProps {
  meta: any;
  isDeleting: boolean;
  onDeleteClick: (meta: any) => void;
}

export function MetasIndicadoresTableRow({ meta, isDeleting, onDeleteClick }: MetasIndicadoresTableRowProps) {
  const indicador = meta.indicador;
  const isGrouped = isGroupedMeta(meta);

  return (
    <TableRow key={meta.id}>
      <TableCell>
        <div>
          <div className="font-medium">{indicador.nome}</div>
          <div className="text-sm text-muted-foreground">
            {indicador.codigo}
            {isGrouped && (
              <span className="ml-2 text-blue-600">
                ({meta.count} metas agrupadas)
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {getTipoBadge(meta.tipo_meta)}
      </TableCell>
      <TableCell>
        <div className="font-mono text-sm">
          {formatarPeriodo(meta)}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-mono">
          {formatarValor(meta.valor_meta, indicador.unidade)}
        </div>
      </TableCell>
      <TableCell>
        {getTrendBadge(indicador.melhor_quando)}
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {meta.descricao || '-'}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          {isGrouped ? (
            <EditarMetaAgrupadaDialog 
              metaAgrupada={meta}
              trigger={
                <Button variant="ghost" size="sm" title="Editar metas agrupadas">
                  <Edit3 className="h-4 w-4" />
                </Button>
              }
            />
          ) : (
            <EditarMetaIndicadorDialog meta={meta as MetaIndicadorCompleta} />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteClick(meta)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
