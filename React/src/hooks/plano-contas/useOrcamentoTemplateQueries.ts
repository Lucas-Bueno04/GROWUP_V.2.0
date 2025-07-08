
import { useOrcamentoTemplates } from './useOrcamentoTemplates';

export function useOrcamentoTemplateQueries() {
  const templates = useOrcamentoTemplates();
  
  return {
    templates,
    isLoading: templates.isLoading,
    error: templates.error
  };
}
