
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { deleteDependente } from "@/lib/edge-functions-client";

export interface Dependente {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  user_id: string | null;
}

export function useDependentes(mentoradoId: string) {
  const { toast } = useToast();
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDependenteId, setDeleteDependenteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchDependentes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("dependents")
        .select("*")
        .eq("mentorado_id", mentoradoId);

      if (error) {
        console.error("Erro ao buscar dependentes:", error);
        setError(error.message);
      } else {
        setDependentes(data || []);
      }
    } catch (err: any) {
      console.error("Erro inesperado ao buscar dependentes:", err);
      setError(err.message || "Erro ao buscar dependentes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDependente = (dependenteId: string) => {
    setDeleteDependenteId(dependenteId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteDependente = async () => {
    if (!deleteDependenteId) return;

    try {
      const result = await deleteDependente(deleteDependenteId);

      if (!result.success) {
        throw new Error(result.message || "Erro ao excluir dependente");
      }

      toast({
        title: "Dependente excluído",
        description: "O dependente foi excluído com sucesso.",
      });
      setOpenDeleteDialog(false);
      setDeleteDependenteId(null);
      fetchDependentes(); // Atualiza a lista de dependentes
    } catch (error: any) {
      toast({
        title: "Erro ao excluir dependente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (mentoradoId) {
      fetchDependentes();
    }
  }, [mentoradoId]);

  return {
    dependentes,
    isLoading,
    error,
    openDeleteDialog,
    setOpenDeleteDialog,
    deleteDependenteId,
    handleDeleteDependente,
    confirmDeleteDependente,
    fetchDependentes,
  };
}
