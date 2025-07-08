
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useCNPJApi } from './use-cnpj-api';
import { EmpresaInsert } from '@/types/empresa.types';
import { 
  fetchEmpresas,
  fetchEmpresasPorStatus,
  fetchEmpresaPorId,
  criarEmpresa,
  atualizarStatusEmpresa,
  atualizarEmpresaComCNPJ,
  excluirEmpresa
} from '@/services/empresa.service';
import { supabase } from '@/lib/supabase';

// Hook principal para gerenciar empresas
export function useEmpresas() {
  const queryClient = useQueryClient();
  const { consultarCNPJ } = useCNPJApi();
  
  // Query para buscar todas as empresas
  const todasEmpresas = useQuery({
    queryKey: ['empresas'],
    queryFn: fetchEmpresas
  });

  // Query para buscar empresas aguardando autorização
  const empresasAguardando = useQuery({
    queryKey: ['empresas', 'aguardando'],
    queryFn: () => fetchEmpresasPorStatus('aguardando')
  });
  
  // Query para buscar empresas autorizadas
  const empresasAtivas = useQuery({
    queryKey: ['empresas', 'ativas'],
    queryFn: () => fetchEmpresasPorStatus('ativo')
  });
  
  // Query para buscar empresas suspensas
  const empresasSuspensas = useQuery({
    queryKey: ['empresas', 'suspensas'],
    queryFn: () => fetchEmpresasPorStatus('suspenso'),
    enabled: false // Só carrega quando solicitado
  });

  // Query para buscar empresas recusadas
  const empresasRecusadas = useQuery({
    queryKey: ['empresas', 'recusadas'],
    queryFn: () => fetchEmpresasPorStatus('recusado'),
    enabled: false // Só carrega quando solicitado
  });
  
  // Query para buscar uma empresa específica por ID
  const getEmpresaPorId = (id: string) => {
    return useQuery({
      queryKey: ['empresa', id],
      queryFn: () => fetchEmpresaPorId(id),
      enabled: !!id,
    });
  };
  
  // Mutation para criar uma nova empresa
  const criarEmpresaMutation = useMutation({
    mutationFn: ({ empresa, mentoradoId }: { empresa: EmpresaInsert, mentoradoId?: string }) => 
      criarEmpresa(empresa, mentoradoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Empresa criada",
        description: "A empresa foi cadastrada com sucesso."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para autorizar uma empresa
  const autorizarEmpresaMutation = useMutation({
    mutationFn: async (id: string) => {
      // Buscar a empresa atual
      const { data: empresa } = await fetchEmpresaPorId(id);
      
      try {
        // Primeiro, atualizar o status para ativo (fix para o botão Autorizar)
        const result = await atualizarStatusEmpresa({ id, status: 'ativo' });
        
        // Em seguida, atualizar os dados da empresa com informações do CNPJ
        return atualizarEmpresaComCNPJ(id, empresa.data.cnpj, consultarCNPJ);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Empresa autorizada",
        description: `A empresa ${data.nome_fantasia} foi autorizada com sucesso.`
      });
      
      // Criar alerta para o mentorado
      criarAlertaAutorizacao(data.id, data.nome_fantasia);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao autorizar empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para recusar uma empresa
  const recusarEmpresaMutation = useMutation({
    mutationFn: async (id: string) => {
      // Primeiro, buscar dados da empresa para criar o alerta
      const { data: empresa } = await fetchEmpresaPorId(id);
      
      // Atualizar o status da empresa para recusado
      const result = await atualizarStatusEmpresa({ id, status: 'recusado' });
      
      // Criar alerta para o mentorado
      if (result.success) {
        await criarAlertaRecusa(id, result.nome_fantasia || result.nome);
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Empresa recusada",
        description: `A empresa ${data.nome_fantasia || data.nome} foi recusada.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao recusar empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Função auxiliar para criar alerta de autorização para o mentorado
  const criarAlertaAutorizacao = async (empresaId: string, nomeEmpresa: string) => {
    try {
      // Buscar o mentorado vinculado a esta empresa
      const { data: vinculo, error: vinculoError } = await supabase
        .from('mentorado_empresas')
        .select('mentorado_id')
        .eq('empresa_id', empresaId)
        .single();
        
      if (vinculoError || !vinculo) return;
      
      // Criar alerta para o mentorado
      await supabase
        .from('alerts')
        .insert({
          mentorado_id: vinculo.mentorado_id,
          title: 'Empresa autorizada',
          description: `Sua solicitação para a empresa ${nomeEmpresa} foi aprovada pelo mentor.`,
          alert_type: 'notificacao',
          priority: 'media'
        });
    } catch (error) {
      console.error("Erro ao criar alerta de autorização:", error);
    }
  };
  
  // Função auxiliar para criar alerta de recusa para o mentorado
  const criarAlertaRecusa = async (empresaId: string, nomeEmpresa: string) => {
    try {
      // Buscar o mentorado vinculado a esta empresa
      const { data: vinculo, error: vinculoError } = await supabase
        .from('mentorado_empresas')
        .select('mentorado_id')
        .eq('empresa_id', empresaId)
        .single();
        
      if (vinculoError || !vinculo) return;
      
      // Criar alerta para o mentorado
      await supabase
        .from('alerts')
        .insert({
          mentorado_id: vinculo.mentorado_id,
          title: 'Empresa recusada',
          description: `Sua solicitação para a empresa ${nomeEmpresa} foi recusada pelo mentor. Entre em contato para mais informações.`,
          alert_type: 'alerta',
          priority: 'alta'
        });
    } catch (error) {
      console.error("Erro ao criar alerta de recusa:", error);
    }
  };
  
  // Mutation para atualizar uma empresa com CNPJ
  const atualizarCNPJMutation = useMutation({
    mutationFn: ({ id, cnpj }: { id: string, cnpj: string }) => 
      atualizarEmpresaComCNPJ(id, cnpj, consultarCNPJ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Empresa atualizada",
        description: `Os dados de ${data.nome_fantasia} foram atualizados com sucesso.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation para suspender ou reativar uma empresa
  const suspenderEmpresaMutation = useMutation({
    mutationFn: async (id: string) => {
      // Verificar status atual
      const { data: empresa } = await fetchEmpresaPorId(id);
      const novoStatus = empresa.data.status === 'suspenso' ? 'ativo' : 'suspenso';
      return atualizarStatusEmpresa({ id, status: novoStatus });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      const acao = data.status === 'suspenso' ? 'suspensa' : 'reativada';
      toast({
        title: `Empresa ${acao}`,
        description: `A empresa ${data.nome_fantasia || data.nome} foi ${acao} com sucesso.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar status da empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation para excluir uma empresa
  const excluirEmpresaMutation = useMutation({
    mutationFn: ({ id, senha }: { id: string, senha: string }) => excluirEmpresa(id, senha),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Empresa excluída",
        description: `A empresa ${data.nome_fantasia || data.nome} foi excluída permanentemente.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir empresa",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    todasEmpresas,
    empresasAguardando,
    empresasAtivas,
    empresasSuspensas,
    empresasRecusadas,
    getEmpresaPorId,
    criarEmpresa: (empresa: EmpresaInsert, mentoradoId?: string) => 
      criarEmpresaMutation.mutate({ empresa, mentoradoId }),
    autorizarEmpresa: (id: string) => autorizarEmpresaMutation.mutate(id),
    recusarEmpresa: (id: string) => recusarEmpresaMutation.mutate(id),
    atualizarEmpresaCNPJ: (id: string, cnpj: string) => atualizarCNPJMutation.mutate({ id, cnpj }),
    suspenderEmpresa: (id: string) => suspenderEmpresaMutation.mutate(id),
    excluirEmpresa: (id: string, senha: string) => excluirEmpresaMutation.mutate({ id, senha }),
    isLoading: todasEmpresas.isLoading || empresasAguardando.isLoading || empresasAtivas.isLoading,
    isCreating: criarEmpresaMutation.isPending,
    isAutorizando: autorizarEmpresaMutation.isPending,
    isRecusando: recusarEmpresaMutation.isPending,
    isAtualizando: atualizarCNPJMutation.isPending,
    isSuspendendo: suspenderEmpresaMutation.isPending,
    isExcluindo: excluirEmpresaMutation.isPending,
    criarAlertaAutorizacao,
    criarAlertaRecusa
  };
}
