
import { useOrcamentoEmpresaValores, type OrcamentoEmpresa } from '@/hooks/orcamento-empresas';
import { useOrcamentoGrupos } from '@/hooks/plano-contas/useOrcamentoGrupos';
import { useOrcamentoContas } from '@/hooks/plano-contas/useOrcamentoContas';
import { useAuth } from '@/hooks/auth';
import { useOrcamentoCellEditing, useOrcamentoReplication } from './index';

interface UseOrcamentoEmpresaDataProps {
  orcamento: OrcamentoEmpresa;
}

export function useOrcamentoEmpresaData({ orcamento }: UseOrcamentoEmpresaDataProps) {
  console.log('useOrcamentoEmpresaData - orcamento:', orcamento.id, orcamento.nome);
  
  const { user } = useAuth();
  console.log('useOrcamentoEmpresaData - user:', user?.email, 'role:', user?.role);

  const { data: valores, isLoading: loadingValores, error: errorValores } = useOrcamentoEmpresaValores(orcamento.id);
  const { data: grupos, error: errorGrupos } = useOrcamentoGrupos();
  const { data: contas, error: errorContas } = useOrcamentoContas();

  console.log('useOrcamentoEmpresaData - valores:', valores?.length || 0);
  console.log('useOrcamentoEmpresaData - grupos:', grupos?.length || 0);
  console.log('useOrcamentoEmpresaData - contas:', contas?.length || 0);
  console.log('useOrcamentoEmpresaData - loadingValores:', loadingValores);
  console.log('useOrcamentoEmpresaData - errors:', { errorValores, errorGrupos, errorContas });

  // Determine if user can edit based on their role and budget settings
  const podeEditar = user?.role === 'mentor' || 
    (user?.role === 'aluno' && orcamento.permite_edicao_aluno);
  
  console.log('useOrcamentoEmpresaData - podeEditar:', podeEditar);

  // Since we're using the default template, we use all groups and contas
  const gruposFiltrados = grupos || [];
  const contasFiltradas = contas || [];

  console.log('useOrcamentoEmpresaData - gruposFiltrados:', gruposFiltrados.length);
  console.log('useOrcamentoEmpresaData - contasFiltradas:', contasFiltradas.length);

  // Use custom hooks for cell editing functionality
  const {
    editingCell,
    tempValues,
    isUpdating,
    handleCellEdit,
    handleSaveValue,
    handleTempValueChange
  } = useOrcamentoCellEditing({
    orcamentoId: orcamento.id,
    valores: valores || []
  });

  const {
    handleReplicateValue,
    handleReplicateMonth
  } = useOrcamentoReplication({
    orcamentoId: orcamento.id,
    valores: valores || [],
    contas: contasFiltradas
  });

  const hasError = errorValores || errorGrupos || errorContas;

  return {
    valores: valores || [],
    grupos: gruposFiltrados,
    contas: contasFiltradas,
    podeEditar,
    isLoading: loadingValores,
    error: hasError ? { errorValores, errorGrupos, errorContas } : null,
    editingCell,
    tempValues,
    isUpdating,
    onCellEdit: handleCellEdit,
    onSaveValue: handleSaveValue,
    onTempValueChange: handleTempValueChange,
    onReplicateValue: handleReplicateValue,
    onReplicateMonth: handleReplicateMonth
  };
}
