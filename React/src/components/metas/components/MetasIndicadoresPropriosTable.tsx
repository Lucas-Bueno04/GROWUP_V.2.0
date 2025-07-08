
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { DeleteMetaConfirmationDialog } from '../DeleteMetaConfirmationDialog';
import { useMetasIndicadoresEmpresa } from '@/hooks/metas/useMetasIndicadoresEmpresa';
import { groupIdenticalMetasEmpresa, isGroupedMetaEmpresa } from '../utils/metasGroupingUtils';
import { getMetaEmpresaTitle } from '../utils/metasTableUtils';
import { MetasIndicadoresPropriosTableHeader } from './MetasIndicadoresPropriosTableHeader';
import { MetasIndicadoresPropriosTableRow } from './MetasIndicadoresPropriosTableRow';

interface MetasIndicadoresPropriosTableProps {
  metasIndicadoresProprios: MetaIndicadorEmpresaCompleta[];
}

export function MetasIndicadoresPropriosTable({ metasIndicadoresProprios }: MetasIndicadoresPropriosTableProps) {
  const { excluirMeta, excluirMultiplasMetas, isDeleting } = useMetasIndicadoresEmpresa();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState<any>(null);

  const handleDeleteClick = (meta: any) => {
    setMetaToDelete(meta);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!metaToDelete) return;

    if (isGroupedMetaEmpresa(metaToDelete)) {
      // Excluir múltiplas metas agrupadas
      excluirMultiplasMetas(metaToDelete.ids);
    } else {
      // Excluir meta única
      excluirMeta(metaToDelete.id);
    }
  };

  if (metasIndicadoresProprios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Metas dos Indicadores Próprios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma meta encontrada para seus indicadores próprios.
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedMetas = groupIdenticalMetasEmpresa(metasIndicadoresProprios);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Metas dos Indicadores Próprios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <MetasIndicadoresPropriosTableHeader />
            <TableBody>
              {groupedMetas.map((meta) => (
                <MetasIndicadoresPropriosTableRow
                  key={meta.id}
                  meta={meta}
                  isDeleting={isDeleting}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteMetaConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        metaTitle={metaToDelete ? getMetaEmpresaTitle(metaToDelete) : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
