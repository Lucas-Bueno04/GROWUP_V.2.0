
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface UseMetaIndicadorProprioFormProps {
  empresaId: string;
  indicadorId?: string;
  onSuccess: () => void;
  criarMeta: (meta: any) => void;
}

export function useMetaIndicadorProprioForm({
  empresaId,
  indicadorId,
  onSuccess,
  criarMeta
}: UseMetaIndicadorProprioFormProps) {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [formData, setFormData] = useState({
    tipo_meta: 'mensal' as 'mensal' | 'anual',
    tipo_valor: 'valor' as 'valor' | 'percentual',
    ano: currentYear,
    mes: currentMonth,
    valor_meta: '',
    descricao: '',
    vinculado_orcamento: false,
    conta_orcamento_id: '',
    tipo_item_orcamento: 'conta' as 'conta' | 'grupo'
  });
  
  const [replicarTodosMeses, setReplicarTodosMeses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const criarMetasSequenciais = async (metaBase: any) => {
    setIsProcessing(true);
    console.log('Iniciando criação de metas sequenciais para todos os meses');
    
    try {
      const promises = [];
      
      for (let mes = 1; mes <= 12; mes++) {
        const metaMensal = {
          ...metaBase,
          mes: mes
        };
        
        console.log(`Criando meta para mês ${mes}:`, metaMensal);
        promises.push(
          new Promise((resolve, reject) => {
            // Simular a criação via mutation
            try {
              criarMeta(metaMensal);
              resolve(metaMensal);
            } catch (error) {
              reject(error);
            }
          })
        );
        
        // Pequeno delay para evitar problemas de concorrência
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('Todas as metas mensais foram enviadas para criação');
      
      toast({
        title: "Metas criadas",
        description: `Criando metas para todos os 12 meses de ${formData.ano}...`
      });
      
    } catch (error) {
      console.error('Erro ao criar metas sequenciais:', error);
      toast({
        title: "Erro ao criar metas",
        description: "Ocorreu um erro ao criar as metas para todos os meses.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!indicadorId || !user?.id || (!formData.vinculado_orcamento && !formData.valor_meta)) {
      console.error('Missing required data:', { indicadorId, userId: user?.id, valor_meta: formData.valor_meta });
      return;
    }

    const metaData = {
      usuario_id: user.id,
      indicador_empresa_id: indicadorId,
      empresa_id: empresaId,
      tipo_meta: formData.tipo_meta,
      tipo_valor: formData.tipo_valor,
      ano: formData.ano,
      mes: formData.mes,
      valor_meta: parseFloat(formData.valor_meta),
      valor_realizado: 0,
      descricao: formData.descricao || undefined,
      vinculado_orcamento: formData.vinculado_orcamento,
      conta_orcamento_id: formData.vinculado_orcamento ? formData.conta_orcamento_id : undefined,
      tipo_item_orcamento: formData.vinculado_orcamento ? formData.tipo_item_orcamento : undefined
    };

    console.log('Creating meta with data:', metaData);
    console.log('Replicar todos os meses:', replicarTodosMeses);

    if (formData.tipo_meta === 'mensal' && replicarTodosMeses) {
      console.log('Criando metas para todos os meses do ano');
      await criarMetasSequenciais(metaData);
    } else {
      console.log('Criando meta única');
      criarMeta(metaData);
    }
    
    onSuccess();
  };

  return {
    formData,
    setFormData,
    replicarTodosMeses,
    setReplicarTodosMeses,
    isProcessing,
    handleSubmit,
    user
  };
}
