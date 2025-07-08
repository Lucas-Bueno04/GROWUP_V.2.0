
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaIndicadorCompleta } from '@/types/metas.types';
import { DeleteMetaConfirmationDialog } from './DeleteMetaConfirmationDialog';
import { useMetasIndicadores } from '@/hooks/metas/useMetasIndicadores';
import { groupIdenticalMetas, isGroupedMeta } from './utils/metasGroupingUtils';
import { getMetaTitle } from './utils/metasTableUtils';
import { MetasIndicadoresTableHeader } from './components/MetasIndicadoresTableHeader';
import { MetasIndicadoresTableRow } from './components/MetasIndicadoresTableRow';
import { MetasIndicadoresEmptyState } from './components/MetasIndicadoresEmptyState';

interface MetasIndicadoresTableProps {
  metas: MetaIndicadorCompleta[];
}

export function MetasIndicadoresTable({ metas }: MetasIndicadoresTableProps) {
  const { excluirMeta, excluirMultiplasMetas, isDeleting } = useMetasIndicadores();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState<any>(null);

  const handleDeleteClick = (meta: any) => {
    setMetaToDelete(meta);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!metaToDelete) return;

    if (isGroupedMeta(metaToDelete)) {
      // Excluir múltiplas metas agrupadas
      excluirMultiplasMetas(metaToDelete.ids);
    } else {
      // Excluir meta única
      excluirMeta(metaToDelete.id);
    }
  };

  if (metas.length === 0) {
    return <MetasIndicadoresEmptyState />;
  }

  const groupedMetas = groupIdenticalMetas(metas);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Metas dos Indicadores do Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <MetasIndicadoresTableHeader />
            <TableBody>
              {groupedMetas.map((meta) => (
                <MetasIndicadoresTableRow
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
        metaTitle={metaToDelete ? getMetaTitle(metaToDelete) : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
