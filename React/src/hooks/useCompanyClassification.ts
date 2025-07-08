
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { FaixaFaturamento, CompanyClassificationHistory, CompanyBadgeAward, CompanyClassificationData } from '@/types/classification.types';

export function useClassificationBadges() {
  return useQuery({
    queryKey: ['faixas-faturamento'],
    queryFn: async (): Promise<FaixaFaturamento[]> => {
      const { data, error } = await supabase
        .from('faixas_faturamento')
        .select('*')
        .eq('ativa', true)
        .order('ordem');

      if (error) {
        console.error('Error fetching faixas de faturamento:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCompanyClassification(empresaId: string | null) {
  return useQuery({
    queryKey: ['company-classification', empresaId],
    queryFn: async (): Promise<CompanyClassificationData | null> => {
      if (!empresaId) return null;

      // Fetch current classification from empresa_grupos
      const { data: groupData, error: groupError } = await supabase
        .from('empresa_grupos')
        .select('grupo_valor')
        .eq('empresa_id', empresaId)
        .eq('grupo_tipo', 'faturamento')
        .maybeSingle();

      if (groupError) {
        console.error('Error fetching company classification:', groupError);
        throw groupError;
      }

      // Fetch badge awards with faixa details
      const { data: badgeAwards, error: badgeError } = await supabase
        .from('company_badge_awards')
        .select(`
          *,
          faixa:faixas_faturamento(*)
        `)
        .eq('empresa_id', empresaId)
        .order('awarded_at', { ascending: false });

      if (badgeError) {
        console.error('Error fetching badge awards:', badgeError);
        throw badgeError;
      }

      // Fetch classification history
      const { data: history, error: historyError } = await supabase
        .from('company_classification_history')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('classification_date', { ascending: false })
        .limit(10);

      if (historyError) {
        console.error('Error fetching classification history:', historyError);
        throw historyError;
      }

      // Calculate current revenue using the database function
      const { data: revenueData, error: revenueError } = await supabase
        .rpc('calcular_receita_atual_empresa', { p_empresa_id: empresaId });

      if (revenueError) {
        console.error('Error calculating current revenue:', revenueError);
        throw revenueError;
      }

      // Get growth percentage from latest history entry
      const latestHistory = history?.[0];
      const growthPercentage = latestHistory?.growth_percentage || null;

      return {
        current_classification: groupData?.grupo_valor || null,
        current_revenue: revenueData || 0,
        badges: badgeAwards || [],
        history: history || [],
        growth_percentage: growthPercentage
      };
    },
    enabled: !!empresaId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useReclassifyCompany() {
  return async (empresaId: string) => {
    const { error } = await supabase
      .rpc('classificar_empresa_por_receita', { p_empresa_id: empresaId });

    if (error) {
      console.error('Error reclassifying company:', error);
      throw error;
    }
  };
}
