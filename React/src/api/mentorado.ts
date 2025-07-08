
import { supabase } from '@/lib/supabase';

// Função para buscar o ID do mentorado a partir do email
export const getMentoradoIdByEmail = async (email: string) => {
  if (!email) {
    return { error: "Email não fornecido" };
  }
  
  try {
    const { data, error } = await supabase
      .from('mentorados')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (error) {
      return { error: error.message };
    }
    
    if (!data) {
      return { error: "Mentorado não encontrado" };
    }
    
    return { data };
  } catch (error: any) {
    return { error: error.message || "Erro desconhecido ao buscar mentorado" };
  }
};
