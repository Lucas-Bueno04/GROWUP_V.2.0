import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Empresa } from "@/types/empresa.types";
import { useToast } from "@/components/ui/use-toast";
import { useEmpresas } from "@/hooks/use-empresas";

// Import our new components
import { InfoTab } from "./tabs/InfoTab";
import { UsersTab } from "./tabs/UsersTab";
import { ClassificationTab } from "./tabs/ClassificationTab";
import { IndicatorsTab } from "./tabs/IndicatorsTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { EmpresaDialogHeader } from "./EmpresaDialogHeader";
import { EmpresaActionFooter } from "./EmpresaActionFooter";

interface DetalhesEmpresaCompletoProps {
  empresaId: string;
  trigger?: React.ReactNode;
}

export function DetalhesEmpresaCompleto({ 
  empresaId,
  trigger 
}: DetalhesEmpresaCompletoProps) {
  const [open, setOpen] = useState(false);
  const { autorizarEmpresa } = useEmpresas();
  const { toast } = useToast();
  
  // Buscar dados da empresa
  const empresaQuery = useQuery({
    queryKey: ['empresa-detalhes', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Empresa;
    },
    enabled: open && !!empresaId
  });
  
  // Buscar mentorados vinculados à empresa
  const mentoradosQuery = useQuery({
    queryKey: ['empresa-mentorados', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorado_empresas')
        .select(`
          mentorado_id,
          mentorados (
            id,
            nome,
            email,
            status
          )
        `)
        .eq('empresa_id', empresaId);
        
      if (error) {
        throw error;
      }
      
      return data.map(item => item.mentorados);
    },
    enabled: open && !!empresaId
  });

  // Buscar histórico da empresa
  const historicoQuery = useQuery({
    queryKey: ['empresa-historico', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresa_historico')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('data_registro', { ascending: false });
        
      if (error) {
        return [
          { id: 1, data_registro: '2023-04-15T00:00:00', descricao: 'Empresa cadastrada no sistema' }
        ];
      }
      
      return data || [];
    },
    enabled: open && !!empresaId
  });
  
  // Dummy data para indicadores (em produção seria buscado do banco)
  const indicadores = [
    { nome: "Faturamento Mensal", valor: "R$ 150.000,00", tendencia: "up" },
    { nome: "Despesas", valor: "R$ 95.000,00", tendencia: "down" },
    { nome: "Lucro Líquido", valor: "R$ 55.000,00", tendencia: "up" },
    { nome: "Nº de Clientes", valor: "45", tendencia: "stable" }
  ];
  
  const handleDeclineEmpresa = async () => {
    try {
      // Primeiro atualizamos o status da empresa para recusada
      await supabase
        .from('empresas')
        .update({ status: 'recusado' })
        .eq('id', empresaId);
      
      // Depois enviamos uma notificação ao mentorado
      // Em produção, recomendamos utilizar um sistema de notificações mais robusto
      const { data: mentoradoEmpresa } = await supabase
        .from('mentorado_empresas')
        .select('mentorado_id')
        .eq('empresa_id', empresaId)
        .single();
      
      if (mentoradoEmpresa) {
        await supabase
          .from('alerts')
          .insert({
            mentorado_id: mentoradoEmpresa.mentorado_id,
            title: 'Solicitação de empresa recusada',
            description: `Sua solicitação para cadastro de empresa foi recusada pelo mentor.`,
            alert_type: 'notificacao',
            priority: 'alta'
          });
      }
      
      toast({
        title: "Empresa recusada",
        description: "A solicitação de empresa foi recusada com sucesso.",
        variant: "default"
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Erro ao recusar empresa:', error);
      toast({
        title: "Erro ao recusar empresa",
        description: "Ocorreu um erro ao recusar a solicitação de empresa.",
        variant: "destructive"
      });
    }
  };

  const handleAutorizarEmpresa = async () => {
    try {
      await autorizarEmpresa(empresaId);
      toast({
        title: "Empresa autorizada",
        description: "A empresa foi autorizada com sucesso.",
        variant: "default"
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao autorizar empresa:', error);
      toast({
        title: "Erro ao autorizar empresa",
        description: "Ocorreu um erro ao autorizar a empresa.",
        variant: "destructive"
      });
    }
  };

  const handleEmpresaAtualizada = () => {
    // Recarregar os dados da empresa
    empresaQuery.refetch();
  };
  
  const empresa = empresaQuery.data;
  const mentorados = mentoradosQuery.data || [];
  const historico = historicoQuery.data || [];
  const isLoading = empresaQuery.isLoading || mentoradosQuery.isLoading;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Visualizar</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full" />
          </div>
        ) : empresa ? (
          <>
            <DialogHeader>
              <EmpresaDialogHeader 
                empresa={empresa} 
                onEmpresaAtualizada={handleEmpresaAtualizada} 
              />
            </DialogHeader>
            
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="users">Usuários ({mentorados.length})</TabsTrigger>
                <TabsTrigger value="classification">Classificação</TabsTrigger>
                <TabsTrigger value="indicators">Indicadores</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <InfoTab empresa={empresa} />
              </TabsContent>
              
              <TabsContent value="users">
                <UsersTab mentorados={mentorados} />
              </TabsContent>
              
              <TabsContent value="classification">
                <ClassificationTab empresaId={empresa.id} />
              </TabsContent>
              
              <TabsContent value="indicators">
                <IndicatorsTab indicators={indicadores} />
              </TabsContent>
              
              <TabsContent value="history">
                <HistoryTab 
                  empresaId={empresa.id} 
                  historico={historico} 
                  onHistoryUpdate={() => historicoQuery.refetch()} 
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <EmpresaActionFooter 
                showActions={empresa.status === "aguardando"}
                onDecline={handleDeclineEmpresa}
                onAuthorize={handleAutorizarEmpresa}
              />
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado encontrado para esta empresa
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
