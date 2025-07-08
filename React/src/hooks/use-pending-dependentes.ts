
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DependenteInfo, MentoradoWithPending } from "@/types/dependente";
import { 
  fetchPendingDependentesByMentor,
  fetchPendingDependentesByMentoradoId,
  fetchPendingDependentesByCurrentUser,
  groupDependentesByMentorado
} from "@/services/dependente.service";

export function usePendingDependentes(mentoradoId?: string) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pendingDependentes, setPendingDependentes] = useState<DependenteInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentoradosWithPending, setMentoradosWithPending] = useState<MentoradoWithPending[]>([]);

  const fetchPendingDependentes = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching pending dependentes as:", user.role);
      
      // First try the edge function for mentors (to have complete access)
      if (user.role?.toLowerCase() === 'mentor') {
        const dependentesWithMentoradoInfo = await fetchPendingDependentesByMentor();
        console.log("Fetched pending dependentes for mentor:", dependentesWithMentoradoInfo.length);
        setPendingDependentes(dependentesWithMentoradoInfo);
        
        // Group pending dependentes by mentorado
        const mentoradosWithPendingList = groupDependentesByMentorado(dependentesWithMentoradoInfo);
        
        console.log("Mentorados with pending dependentes:", mentoradosWithPendingList);
        setMentoradosWithPending(mentoradosWithPendingList);
      } else if (mentoradoId) {
        // For mentorados, only fetch their own pending dependents
        console.log("Fetching pending dependentes for mentorado ID:", mentoradoId);
        const data = await fetchPendingDependentesByMentoradoId(mentoradoId);
        console.log("Fetched pending dependentes for specific mentorado:", data.length);
        setPendingDependentes(data);
      } else {
        // For mentorados without specified ID, check their own pending dependentes
        if (user.email) {
          console.log("Fetching pending dependentes for current user:", user.email);
          const pendingData = await fetchPendingDependentesByCurrentUser(user.email);
          console.log("Fetched pending dependentes for current user:", pendingData.length);
          setPendingDependentes(pendingData);
          
          // If we have pending dependentes for this mentorado
          if (pendingData && pendingData.length > 0) {
            console.log("Aluno has pending dependentes:", pendingData.length);
          }
        }
      }
    } catch (err: any) {
      console.error('Erro ao buscar dependentes pendentes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, mentoradoId]);

  // Load pending dependentes when mounting the component
  useEffect(() => {
    fetchPendingDependentes();
    
    // For mentors, set up an interval to check for new pending dependentes every minute
    let interval: NodeJS.Timeout | null = null;
    
    if (user?.role?.toLowerCase() === 'mentor') {
      interval = setInterval(fetchPendingDependentes, 60000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchPendingDependentes, user]);

  // For specific mentorados
  const pendingForMentorado = mentoradoId 
    ? pendingDependentes.filter(d => d.mentorado_id === mentoradoId)
    : pendingDependentes;

  // Total count of pending dependentes
  const pendingCount = pendingDependentes.length;
  
  // Check if the specific mentorado has pending dependentes
  const hasPendingForMentorado = pendingForMentorado.length > 0;

  return {
    pendingDependentes,
    pendingForMentorado,
    isLoading,
    error,
    pendingCount,
    hasPendingForMentorado,
    fetchPendingDependentes,
    mentoradosWithPending
  };
}
