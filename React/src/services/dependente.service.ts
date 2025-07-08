
import { supabase } from "@/lib/supabase";
import { DependenteInfo, MentoradoWithPending } from "@/types/dependente";
import { 
  getPendingDependentes as fetchPendingDependentesEdge,
  approveDependente, 
  rejectDependente 
} from "@/lib/edge-functions/dependente-operations";

/**
 * Fetches pending dependentes using the edge function (for mentors)
 */
export async function fetchPendingDependentesByMentor(): Promise<DependenteInfo[]> {
  const result = await fetchPendingDependentesEdge();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Erro ao buscar dependentes pendentes');
  }
  
  // Make sure each dependente has mentorado_info
  return Promise.all(result.data.map(async (dep: DependenteInfo) => {
    // If mentorado_info is missing, fetch it
    if (!dep.mentorado_info) {
      const { data: mentorado } = await supabase
        .from('mentorados')
        .select('id, nome, email')
        .eq('id', dep.mentorado_id)
        .single();

      if (mentorado) {
        return {
          ...dep,
          mentorado_info: {
            id: mentorado.id,
            nome: mentorado.nome,
            email: mentorado.email
          }
        };
      }
    }
    return dep;
  }));
}

/**
 * Groups dependentes by mentorado and returns a list of mentorados with pending counts
 */
export function groupDependentesByMentorado(dependentes: DependenteInfo[]): MentoradoWithPending[] {
  const mentoradoMap = new Map<string, { id: string, nome: string, count: number }>();
  
  for (const dep of dependentes) {
    // Ensure mentorado_id is used as the key, as this is the definitive ID
    const mentoradoId = dep.mentorado_id;
    
    // Skip if mentoradoId is undefined or null
    if (!mentoradoId) {
      console.warn("Found dependente with missing mentorado_id:", dep);
      continue;
    }
    
    if (!mentoradoMap.has(mentoradoId)) {
      // Get mentorado info from the dependente, with safe fallbacks
      const mentoradoInfo = dep.mentorado_info || { id: mentoradoId, nome: 'Não disponível', email: '' };
      
      // Ensure we're always using mentorado_id as the definitive ID, not mentorado_info.id
      mentoradoMap.set(mentoradoId, { 
        id: mentoradoId,
        nome: mentoradoInfo.nome,
        count: 1 
      });
    } else {
      const current = mentoradoMap.get(mentoradoId)!;
      mentoradoMap.set(mentoradoId, { ...current, count: current.count + 1 });
    }
  }
  
  console.log("groupDependentesByMentorado - mentoradoMap:", Array.from(mentoradoMap.entries()));
  
  return Array.from(mentoradoMap.values()).map(m => ({
    id: m.id,
    nome: m.nome,
    pendingCount: m.count
  }));
}

/**
 * Fetches pending dependentes for a specific mentorado
 */
export async function fetchPendingDependentesByMentoradoId(mentoradoId: string): Promise<DependenteInfo[]> {
  const { data, error } = await supabase
    .from('dependents')
    .select('*')
    .eq('mentorado_id', mentoradoId)
    .eq('active', false);
    
  if (error) {
    throw error;
  }
  
  return data as DependenteInfo[];
}

/**
 * Fetches pending dependentes for the current mentorado user
 */
export async function fetchPendingDependentesByCurrentUser(userEmail: string): Promise<DependenteInfo[]> {
  const { data: mentoradoData } = await supabase
    .from('mentorados')
    .select('id')
    .eq('email', userEmail)
    .single();
    
  if (!mentoradoData) {
    return [];
  }
  
  const { data: pendingData, error } = await supabase
    .from('dependents')
    .select('*')
    .eq('mentorado_id', mentoradoData.id)
    .eq('active', false);
    
  if (error) {
    throw error;
  }
  
  return pendingData as DependenteInfo[] || [];
}

/**
 * Approves a pending dependente
 */
export async function approvePendingDependente(dependenteId: string, permissionLevel: string): Promise<void> {
  const result = await approveDependente(dependenteId, permissionLevel);
  
  if (!result.success) {
    throw new Error(result.message || 'Erro ao aprovar dependente');
  }
}

/**
 * Rejects a pending dependente
 */
export async function rejectPendingDependente(dependenteId: string): Promise<void> {
  const result = await rejectDependente(dependenteId);
  
  if (!result.success) {
    throw new Error(result.message || 'Erro ao rejeitar dependente');
  }
}
