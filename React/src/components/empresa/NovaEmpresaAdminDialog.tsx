
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";
import { useCNPJApi, CNPJResponse } from "@/hooks/use-cnpj-api";
import { useEmpresas } from "@/hooks/use-empresas";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function NovaEmpresaAdminDialog() {
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [mentoradoId, setMentoradoId] = useState('');
  const [cnpjData, setCnpjData] = useState<CNPJResponse | null>(null);
  const { consultarCNPJ, isLoading: isConsultando } = useCNPJApi();
  const { criarEmpresa, isCreating } = useEmpresas();
  
  // Query para buscar mentorados
  const [mentorados, setMentorados] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoadingMentorados, setIsLoadingMentorados] = useState(false);
  
  // Buscar mentorados ao abrir o modal
  const fetchMentorados = async () => {
    setIsLoadingMentorados(true);
    try {
      // Buscar mentorados
      const { data, error } = await supabase
        .from('mentorados')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome');
        
      if (error) throw error;
      setMentorados(data || []);
    } catch (error) {
      console.error('Erro ao buscar mentorados:', error);
      toast({
        title: "Erro ao carregar mentorados",
        description: "Não foi possível carregar a lista de mentorados.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMentorados(false);
    }
  };
  
  // Formatar CNPJ ao digitar
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
      // Formatar como XX.XXX.XXX/XXXX-XX
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      setCnpj(value);
    }
  };
  
  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchMentorados();
    } else {
      resetForm();
    }
  };
  
  const resetForm = () => {
    setCnpj('');
    setMentoradoId('');
    setCnpjData(null);
  };
  
  const handleConsultarCNPJ = async () => {
    if (cnpj.replace(/\D/g, '').length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido com 14 dígitos",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const data = await consultarCNPJ(cnpj);
      setCnpjData(data);
      toast({
        title: "CNPJ encontrado",
        description: `Empresa: ${data.razao_social}`,
      });
    } catch (error) {
      // Erro já tratado no hook useCNPJApi
    }
  };
  
  const handleCriarEmpresa = async () => {
    if (!cnpjData) {
      toast({
        title: "Consulte o CNPJ primeiro",
        description: "É necessário consultar o CNPJ antes de criar a empresa",
        variant: "destructive"
      });
      return;
    }
    
    if (!mentoradoId) {
      toast({
        title: "Selecione um mentorado",
        description: "É necessário selecionar um mentorado para vincular à empresa",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Criar a empresa usando os dados do CNPJ
      const novaEmpresa = {
        nome: cnpjData.razao_social,
        nome_fantasia: cnpjData.nome_fantasia || cnpjData.razao_social,
        cnpj: (cnpjData.cnpj || '').replace(/\D/g, ''), // Garantir que cnpj não é undefined
        telefone: cnpjData.telefone || "Não informado",
        solicitado_por: "Cadastrado pelo Mentor",
        data_solicitacao: new Date().toLocaleString('pt-BR'),
        status: 'ativo' as 'ativo', // Fix: explicitly type as the literal 'ativo'
        setor: cnpjData.atividade_principal?.descricao || "Não especificado",
        porte: cnpjData.porte || "Não especificado",
        site: null,
        usuarios_autorizados: 1
      };
      
      // Criar empresa e vincular ao mentorado
      await criarEmpresa(novaEmpresa, mentoradoId);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar empresa",
        description: error.message || "Ocorreu um erro ao criar a empresa",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
          <Plus size={16} />
          Nova Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
          <DialogDescription>
            Consulte o CNPJ da empresa para preenchimento automático e associe a um mentorado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cnpj">CNPJ da Empresa</Label>
            <div className="flex gap-2">
              <Input
                id="cnpj"
                placeholder="XX.XXX.XXX/XXXX-XX"
                value={cnpj}
                onChange={handleCNPJChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleConsultarCNPJ}
                disabled={isConsultando || cnpj.replace(/\D/g, '').length !== 14}
                className={cn("w-[120px]")}
              >
                {isConsultando ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Verificar
              </Button>
            </div>
          </div>
          
          {cnpjData && (
            <div className="grid gap-4 pt-2">
              <div className="grid gap-2">
                <Label>Razão Social</Label>
                <Input value={cnpjData.razao_social} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Nome Fantasia</Label>
                <Input value={cnpjData.nome_fantasia || cnpjData.razao_social} disabled />
              </div>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="mentorado">Associar ao Mentorado</Label>
            <Select
              value={mentoradoId}
              onValueChange={setMentoradoId}
              disabled={isLoadingMentorados}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um mentorado" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingMentorados ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Carregando...</span>
                  </div>
                ) : mentorados.length > 0 ? (
                  mentorados.map((mentorado) => (
                    <SelectItem key={mentorado.id} value={mentorado.id}>
                      {mentorado.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhum mentorado disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCriarEmpresa} 
            disabled={isCreating || !cnpjData || !mentoradoId}
            className="bg-red-600 hover:bg-red-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Empresa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
