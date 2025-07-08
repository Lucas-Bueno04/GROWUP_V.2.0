
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/auth/AuthContext';

export interface EmpresaOrcamento {
  id: string;
  nome: string;
  nomeFantasia?: string;
  ano: number;
  orcamentoId: string;
}

// Função para limpar cache local relacionado a orçamentos
const clearOrcamentoCacheForEmpresa = (empresaId: string) => {
  console.log('Limpando cache de orçamento para empresa:', empresaId);
  
  // Limpar possíveis referências no localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('orcamento') && key.includes(empresaId)) {
      console.log('Removendo chave do localStorage:', key);
      localStorage.removeItem(key);
    }
  });
};

export function useEmpresasOrcamento() {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ['empresas-orcamento', user?.id, session?.access_token],
    queryFn: async (): Promise<EmpresaOrcamento[]> => {
      console.log('=== EMPRESAS ORÇAMENTO QUERY START ===');
      console.log('Query iniciada com:', {
        userId: user?.id,
        userRole: user?.role,
        hasSession: !!session,
        sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false
      });
      
      if (!user?.id || !session) {
        console.error('useEmpresasOrcamento: Usuário não autenticado ou sem sessão');
        console.log('Estado da auth:', { user: !!user, session: !!session });
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a sessão está válida
      if (session.expires_at && new Date(session.expires_at * 1000) <= new Date()) {
        console.error('useEmpresasOrcamento: Sessão expirada');
        throw new Error('Sessão expirada - faça login novamente');
      }

      try {
        console.log('useEmpresasOrcamento: Executando query...');
        
        // Buscar orçamentos usando RLS - as políticas vão filtrar automaticamente
        // MELHORIA: Adicionar filtro para garantir que só retornamos orçamentos ativos
        const { data: orcamentos, error } = await supabase
          .from('orcamento_empresas')
          .select(`
            id,
            ano,
            status,
            empresa:empresas(id, nome, nome_fantasia)
          `)
          .eq('status', 'ativo')
          .order('ano', { ascending: false });

        console.log('useEmpresasOrcamento: Resultado da query:', { 
          success: !error,
          total: orcamentos?.length || 0, 
          errorMessage: error?.message || 'nenhum erro',
          errorCode: error?.code,
          errorDetails: error?.details,
          primeiros3: orcamentos?.slice(0, 3)
        });

        if (error) {
          console.error('useEmpresasOrcamento: Erro detalhado:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          // Mensagens de erro mais específicas
          if (error.code === 'PGRST301') {
            throw new Error('Sem permissão para acessar dados de orçamento');
          } else if (error.message?.includes('JWT')) {
            throw new Error('Token de autenticação inválido - faça login novamente');
          } else if (error.message?.includes('permission denied')) {
            throw new Error('Sem permissão de acesso aos dados');
          } else {
            throw new Error(`Erro ao buscar empresas: ${error.message}`);
          }
        }

        if (!orcamentos || orcamentos.length === 0) {
          console.log('useEmpresasOrcamento: Nenhum orçamento encontrado');
          return [];
        }

        const empresasMap = new Map<string, EmpresaOrcamento>();
        const empresasProblematicas: string[] = [];

        orcamentos.forEach(orcamento => {
          // VALIDAÇÃO MELHORADA: Verificar se a empresa existe e se o orçamento é válido
          if (!orcamento.empresa || Array.isArray(orcamento.empresa)) {
            console.warn('useEmpresasOrcamento: Orçamento com empresa inválida:', orcamento.id);
            empresasProblematicas.push(orcamento.id);
            return;
          }

          const empresa = orcamento.empresa as { id: string; nome: string; nome_fantasia?: string };
          
          // VALIDAÇÃO ADICIONAL: Verificar se a empresa tem dados mínimos
          if (!empresa.id || !empresa.nome) {
            console.warn('useEmpresasOrcamento: Empresa com dados incompletos:', empresa);
            empresasProblematicas.push(orcamento.id);
            return;
          }

          const key = `${empresa.id}-${orcamento.ano}`;
          
          // Verificar se já existe uma entrada para essa empresa/ano
          if (!empresasMap.has(key)) {
            empresasMap.set(key, {
              id: empresa.id,
              nome: empresa.nome,
              nomeFantasia: empresa.nome_fantasia,
              ano: orcamento.ano,
              orcamentoId: orcamento.id
            });
          } else {
            console.warn('useEmpresasOrcamento: Empresa/ano duplicado encontrado:', key);
          }
        });

        // Limpar cache para empresas problemáticas
        if (empresasProblematicas.length > 0) {
          console.log('useEmpresasOrcamento: Limpando cache para orçamentos problemáticos:', empresasProblematicas);
          empresasProblematicas.forEach(orcamentoId => {
            // Tentar extrair empresa_id do orçamento problemático
            const orcamentoProblematico = orcamentos.find(o => o.id === orcamentoId);
            if (orcamentoProblematico?.empresa && !Array.isArray(orcamentoProblematico.empresa)) {
              clearOrcamentoCacheForEmpresa((orcamentoProblematico.empresa as any).id);
            }
          });
        }

        const result = Array.from(empresasMap.values())
          .sort((a, b) => b.ano - a.ano || a.nome.localeCompare(b.nome));

        console.log('useEmpresasOrcamento: Empresas processadas:', {
          total: result.length,
          problemáticas: empresasProblematicas.length,
          empresas: result.map(e => ({ 
            nome: e.nome, 
            ano: e.ano, 
            id: e.id,
            orcamentoId: e.orcamentoId 
          }))
        });

        // VALIDAÇÃO FINAL: Verificar se temos empresas válidas
        if (result.length === 0 && orcamentos.length > 0) {
          console.error('useEmpresasOrcamento: Todos os orçamentos encontrados são inválidos');
          // Limpar qualquer cache que possa estar causando problemas
          console.log('Limpando todo cache de orçamentos...');
          Object.keys(localStorage).forEach(key => {
            if (key.includes('orcamento') || key.includes('empresa')) {
              localStorage.removeItem(key);
            }
          });
        }

        console.log('=== EMPRESAS ORÇAMENTO QUERY END ===');
        
        return result;
        
      } catch (error: any) {
        console.error('useEmpresasOrcamento: Erro ao processar empresas:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name
        });
        console.log('=== EMPRESAS ORÇAMENTO QUERY ERROR END ===');
        throw error;
      }
    },
    enabled: !!(user?.id && session),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: (failureCount, error: any) => {
      console.log('useEmpresasOrcamento: Tentativa de retry:', {
        attempt: failureCount + 1,
        errorMessage: error?.message,
        maxRetries: 2
      });
      
      // Não fazer retry para erros de autenticação/permissão
      if (error?.message?.includes('não autenticado') ||
          error?.message?.includes('Sem permissão') ||
          error?.message?.includes('JWT') ||
          error?.message?.includes('Token de autenticação') ||
          error?.message?.includes('Sessão expirada')) {
        console.log('useEmpresasOrcamento: Não fazendo retry para erro de autenticação');
        return false;
      }
      
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
