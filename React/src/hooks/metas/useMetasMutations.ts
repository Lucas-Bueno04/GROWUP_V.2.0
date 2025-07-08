
import { useCreateMetaIndicador, useUpdateMetaIndicador, useDeleteMetaIndicador } from './metaIndicadorMutations';
import { useCreateIndicadorEmpresa, useUpdateIndicadorEmpresa, useDeleteIndicadorEmpresa } from './indicadorEmpresaMutations';
import { useCreateMetaIndicadorEmpresa, useUpdateMetaIndicadorEmpresa, useDeleteMetaIndicadorEmpresa } from './metaIndicadorEmpresaMutations';

export function useMetasMutations() {
  const createMetaIndicador = useCreateMetaIndicador();
  const updateMetaIndicador = useUpdateMetaIndicador();
  const deleteMetaIndicador = useDeleteMetaIndicador();
  
  const createIndicadorEmpresa = useCreateIndicadorEmpresa();
  const updateIndicadorEmpresa = useUpdateIndicadorEmpresa();
  const deleteIndicadorEmpresa = useDeleteIndicadorEmpresa();
  
  const createMetaIndicadorEmpresa = useCreateMetaIndicadorEmpresa();
  const updateMetaIndicadorEmpresa = useUpdateMetaIndicadorEmpresa();
  const deleteMetaIndicadorEmpresa = useDeleteMetaIndicadorEmpresa();

  const isCreating = createMetaIndicador.isPending || createIndicadorEmpresa.isPending || createMetaIndicadorEmpresa.isPending;
  const isUpdating = updateMetaIndicador.isPending || updateIndicadorEmpresa.isPending || updateMetaIndicadorEmpresa.isPending;
  const isDeleting = deleteMetaIndicador.isPending || deleteIndicadorEmpresa.isPending || deleteMetaIndicadorEmpresa.isPending;

  return {
    // Meta Indicador mutations
    criarMetaIndicador: createMetaIndicador.mutate,
    atualizarMetaIndicador: updateMetaIndicador.mutate,
    excluirMetaIndicador: deleteMetaIndicador.mutate,
    excluirMultiplasMetasIndicador: async (ids: string[]) => {
      for (const id of ids) {
        await deleteMetaIndicador.mutateAsync(id);
      }
    },
    
    // Indicador Empresa mutations
    criarIndicadorEmpresa: createIndicadorEmpresa.mutate,
    atualizarIndicadorEmpresa: updateIndicadorEmpresa.mutate,
    excluirIndicadorEmpresa: deleteIndicadorEmpresa.mutate,
    
    // Meta Indicador Empresa mutations
    criarMetaIndicadorEmpresa: createMetaIndicadorEmpresa.mutate,
    atualizarMetaIndicadorEmpresa: updateMetaIndicadorEmpresa.mutate,
    atualizarValorRealizado: updateMetaIndicadorEmpresa.mutate,
    excluirMetaIndicadorEmpresa: deleteMetaIndicadorEmpresa.mutate,
    excluirMultiplasMetasIndicadorEmpresa: async (ids: string[]) => {
      for (const id of ids) {
        await deleteMetaIndicadorEmpresa.mutateAsync(id);
      }
    },
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting
  };
}
