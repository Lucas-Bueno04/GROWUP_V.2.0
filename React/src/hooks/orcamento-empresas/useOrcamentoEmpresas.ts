
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/auth';
import type { OrcamentoEmpresa } from './types';

export function useOrcamentoEmpresas() {
  const { user } = useAuth();
  console.log('useOrcamentoEmpresas: user:', user?.id, 'role:', user?.role);

  return useQuery({
    queryKey: ['orcamento-empresas-mentor', user?.id],
    queryFn: async () => {
      console.log('useOrcamentoEmpresas: executando query para mentor');
      if (!user?.id) {
        console.log('useOrcamentoEmpresas: usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      try {
        // With simplified RLS, we can query directly - RLS will handle access control
        const { data, error } = await supabase
          .from('orcamento_empresas')
          .select(`
            *,
            empresa:empresas(id, nome, nome_fantasia, cnpj)
          `)
          .order('created_at', { ascending: false });

        console.log('useOrcamentoEmpresas: resultado da query:', { 
          data: data?.length || 0, 
          error: error?.message || 'nenhum erro' 
        });
        
        if (error) {
          console.error('useOrcamentoEmpresas: erro na query:', error);
          throw error;
        }
        
        const mappedData = (data || []).map(orcamento => ({
          ...orcamento,
          pode_editar: true // Mentores sempre podem editar
        }));
        
        console.log('useOrcamentoEmpresas: dados mapeados:', mappedData.length);
        return mappedData as OrcamentoEmpresa[];
      } catch (error) {
        console.error('useOrcamentoEmpresas: erro na execução:', error);
        throw error;
      }
    },
    enabled: !!user?.id && user?.role === 'mentor'
  });
}
