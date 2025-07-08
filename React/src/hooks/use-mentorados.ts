
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  fetchMentorados, 
  fetchMentoradoPorId, 
  criarMentorado, 
  atualizarMentorado 
} from '@/api/mentorado-api';
import { Mentorado } from '@/types/mentorado';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook para gerenciar operações relacionadas aos mentorados
 */
export function useMentorados() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Obter o papel do usuário para usar como parte da chave de consulta
  const role = user?.role || 'aluno';
  
  // Query para buscar todos os mentorados - agora considera o papel como parte da chave
  const todosMentorados = useQuery({
    queryKey: ['mentorados', role],
    queryFn: fetchMentorados,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,  // Garantir que recarrega ao montar
    refetchInterval: 10000
  });
  
  // Query para buscar um mentorado específico por ID
  const getMentoradoPorId = (id: string) => {
    return useQuery({
      queryKey: ['mentorado', id, role],
      queryFn: () => fetchMentoradoPorId(id),
      enabled: !!id && typeof id === 'string',
      retry: 2,
      refetchOnWindowFocus: true
    });
  };
  
  // Mutation para criar um novo mentorado
  const criarMentoradoMutation = useMutation({
    mutationFn: (mentorado: Omit<Mentorado, 'id'>) => criarMentorado(mentorado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorados'] });
      toast({
        title: "Mentorado criado",
        description: "O mentorado foi cadastrado com sucesso."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar mentorado",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar um mentorado
  const atualizarMentoradoMutation = useMutation({
    mutationFn: (mentorado: Mentorado) => atualizarMentorado(mentorado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorados'] });
      toast({
        title: "Mentorado atualizado",
        description: "Os dados do mentorado foram atualizados com sucesso."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar mentorado",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    todosMentorados,
    getMentoradoPorId,
    criarMentorado: criarMentoradoMutation.mutate,
    atualizarMentorado: atualizarMentoradoMutation.mutate,
    isLoading: todosMentorados.isLoading || todosMentorados.isFetching,
    isError: todosMentorados.isError,
    error: todosMentorados.error,
    isCriando: criarMentoradoMutation.isPending,
    isAtualizando: atualizarMentoradoMutation.isPending
  };
}
