
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { OrcamentoIndicador } from '@/types/plano-contas.types';
import { supabase } from '@/lib/supabase';

export function useIndicadorOperations() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createIndicador = async (data: Partial<OrcamentoIndicador>) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('orcamento_indicadores')
        .insert(data);

      if (error) throw error;

      toast({
        title: "Indicador criado",
        description: "Indicador criado com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateIndicador = async (id: string, data: Partial<OrcamentoIndicador>) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('orcamento_indicadores')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Indicador atualizado",
        description: "Indicador atualizado com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteIndicador = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('orcamento_indicadores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Indicador removido",
        description: "Indicador removido com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createIndicador,
    updateIndicador,
    deleteIndicador,
    loading,
  };
}
