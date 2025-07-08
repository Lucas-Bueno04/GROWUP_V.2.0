
import { useAuth } from '@/hooks/useAuth';

export function useCardsEstrategicosQueryConfig(ano: number, empresaId?: string | null) {
  const { user } = useAuth();

  console.log('=== CARDS ESTRATÉGICOS QUERY CONFIG (SIMPLIFIED) ===');
  console.log('Query config called with:', { ano, empresaId, userId: user?.id, userRole: user?.role });

  // Condição simplificada: apenas verificar se o usuário está logado
  const isEnabled = !!user?.id;

  console.log('Query enabled:', isEnabled);

  return {
    user,
    queryKey: ['cards-estrategicos', ano, empresaId, user?.id],
    isEnabled
  };
}
