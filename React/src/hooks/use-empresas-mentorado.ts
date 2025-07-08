import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Empresa,
  EmpresaSolicitacao
} from "@/types/empresa-mentorado.types";
import { 
  fetchMentoradoEmpresas, 
  createAndLinkEmpresa, 
  linkMentoradoToEmpresa, 
  unlinkMentoradoFromEmpresa,
  findEmpresaByCNPJ
} from "@/services/empresa-mentorado-operations.service";
import { formatCNPJ, removeCNPJFormat } from "@/types/empresa.types";
import { supabase } from "@/lib/supabase";

// Hook for managing mentorado's companies
export function useEmpresasMentorado() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSolicitando, setIsSolicitando] = useState(false);
  const [isReconhecendo, setIsReconhecendo] = useState(false);

  console.log('useEmpresasMentorado - Init:', { user: user?.id, role: user?.role });

  useEffect(() => {
    const loadEmpresas = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (!user?.id) {
          console.log('useEmpresasMentorado - No user ID found, skipping fetch');
          return;
        }

        console.log('useEmpresasMentorado - Fetching empresas for user:', user.id, 'role:', user.role);
        // Passar o papel do usuário para o serviço
        const empresasData = await fetchMentoradoEmpresas(user.id, user.role === 'mentor');
        console.log('useEmpresasMentorado - Fetched empresas:', empresasData?.length || 0);
        setEmpresas(empresasData);
      } catch (error: any) {
        console.error('useEmpresasMentorado - Error fetching empresas:', error);
        setIsError(true);
        toast({
          title: "Erro ao carregar empresas",
          description: error.message || "Ocorreu um erro ao carregar as empresas",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEmpresas();
  }, [user?.id, user?.role]);

  const solicitarNovaEmpresa = async (solicitacao: EmpresaSolicitacao) => {
    setIsSolicitando(true);
    try {
      console.log('useEmpresasMentorado - Requesting new company:', solicitacao);
      
      // First, check if company with this CNPJ already exists
      const cnpjLimpo = removeCNPJFormat(solicitacao.cnpj);
      
      const { data: existingEmpresa, error: existingError } = await supabase
        .from('empresas')
        .select('id')
        .eq('cnpj', cnpjLimpo)
        .maybeSingle();

      if (existingError) {
        console.error('useEmpresasMentorado - Error checking existing company:', existingError);
        throw existingError;
      }

      if (existingEmpresa) {
        console.log('useEmpresasMentorado - Company already exists, linking mentorado');
        // Company already exists, link mentorado to it
        await linkMentoradoToEmpresa(solicitacao.mentoradoId, existingEmpresa.id);
        toast({
          title: "Empresa já cadastrada",
          description: "Sua solicitação foi enviada para o mentor.",
        });
      } else {
        console.log('useEmpresasMentorado - Creating new company and linking');
        // Company doesn't exist, create new and link
        await createAndLinkEmpresa(solicitacao);
        toast({
          title: "Empresa solicitada",
          description: "Sua solicitação foi enviada para o mentor.",
        });
      }
      
      // Reload companies
      if (user?.id) {
        const updatedEmpresas = await fetchMentoradoEmpresas(user.id);
        setEmpresas(updatedEmpresas);
      }
      
      // Invalidate cache to update companies list
      queryClient.invalidateQueries({ queryKey: ['empresas-mentorado'] });
    } catch (error: any) {
      console.error('useEmpresasMentorado - Error requesting company:', error);
      toast({
        title: "Erro ao solicitar empresa",
        description: error.message || "Ocorreu um erro ao solicitar a empresa",
        variant: "destructive"
      });
    } finally {
      setIsSolicitando(false);
    }
  };
  
  const reconhecerRecusa = async (empresaId: string) => {
    setIsReconhecendo(true);
    try {
      console.log('useEmpresasMentorado - Acknowledging rejection for company:', empresaId);
      
      // Remove company from mentorado_empresas table
      await unlinkMentoradoFromEmpresa(user?.id || '', empresaId);
      
      // Update companies list after removal
      setEmpresas(empresas.filter(empresa => empresa.id !== empresaId));
      
      toast({
        title: "Notificação removida",
        description: "A notificação da empresa recusada foi removida da sua lista.",
      });
    } catch (error: any) {
      console.error('useEmpresasMentorado - Error acknowledging rejection:', error);
      toast({
        title: "Erro ao remover notificação",
        description: error.message || "Ocorreu um erro ao remover a notificação",
        variant: "destructive"
      });
    } finally {
      setIsReconhecendo(false);
    }
  };

  // Function to search for a company by CNPJ
  const buscarEmpresaPorCNPJ = async (cnpj: string) => {
    try {
      console.log('useEmpresasMentorado - Searching company by CNPJ:', cnpj);
      return await findEmpresaByCNPJ(cnpj);
    } catch (error) {
      console.error('useEmpresasMentorado - Error searching company by CNPJ:', error);
      throw error;
    }
  };

  return {
    empresas,
    isLoading,
    isError,
    solicitarNovaEmpresa,
    isSolicitando,
    reconhecerRecusa,
    isReconhecendo,
    buscarEmpresaPorCNPJ,
    formatCNPJ
  };
}
