
import { useOrcamentoTemplateQueries } from './useOrcamentoTemplateQueries';
import { useOrcamentoTemplateMutations } from './useOrcamentoTemplateMutations';

export function useOrcamentoTemplateOperations() {
  const queries = useOrcamentoTemplateQueries();
  const mutations = useOrcamentoTemplateMutations();

  return {
    ...queries,
    ...mutations,
  };
}
