
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Loader2 } from "lucide-react";
import { EmpresaSolicitacao } from "@/types/empresa-mentorado.types";
import { useCNPJApi } from "@/hooks/use-cnpj-api";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface NovaEmpresaDialogProps {
  mentoradoId: string;
  onSolicitarEmpresa: (solicitacao: EmpresaSolicitacao) => void;
  isSolicitando: boolean;
}

export function NovaEmpresaDialog({ mentoradoId, onSolicitarEmpresa, isSolicitando }: NovaEmpresaDialogProps) {
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpjValidado, setCnpjValidado] = useState(false);
  const { consultarCNPJ, isLoading: isConsultando, cnpjData } = useCNPJApi();
  
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
      // Formatar como XX.XXX.XXX/XXXX-XX
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      setCnpj(value);
      setCnpjValidado(false);
      setNomeFantasia('');
    }
  };
  
  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };
  
  const resetForm = () => {
    setCnpj('');
    setNomeFantasia('');
    setCnpjValidado(false);
  };
  
  const handleVerificarCNPJ = async () => {
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
      setCnpjValidado(true);
      
      // Verificar e preencher o nome fantasia se disponível
      if (data?.nome_fantasia) {
        setNomeFantasia(data.nome_fantasia);
      } else if (data?.fantasia) {
        setNomeFantasia(data.fantasia);
      }
      
      toast({
        title: "CNPJ verificado",
        description: "O CNPJ foi verificado e está pronto para ser solicitado."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao verificar CNPJ",
        description: error.message || "Ocorreu um erro ao verificar o CNPJ",
        variant: "destructive"
      });
    }
  };
  
  const handleSolicitar = () => {
    if (!cnpjValidado) {
      toast({
        title: "Verifique o CNPJ primeiro",
        description: "É necessário verificar o CNPJ antes de prosseguir",
        variant: "destructive"
      });
      return;
    }

    if (!nomeFantasia.trim()) {
      toast({
        title: "Nome Fantasia obrigatório",
        description: "Por favor, informe o nome fantasia da empresa",
        variant: "destructive"
      });
      return;
    }
    
    try {
      onSolicitarEmpresa({
        cnpj: cnpj.replace(/\D/g, ''),
        nome_fantasia: nomeFantasia.trim(),
        mentoradoId
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao solicitar empresa",
        description: error.message || "Ocorreu um erro ao solicitar a empresa",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Nova Empresa</DialogTitle>
          <DialogDescription>
            Informe o CNPJ da empresa que deseja solicitar acesso.
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
                disabled={cnpjValidado}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleVerificarCNPJ}
                disabled={isConsultando || cnpj.replace(/\D/g, '').length !== 14 || cnpjValidado}
                className={cn("w-[100px]")}
              >
                {isConsultando ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Verificar
              </Button>
            </div>
            {cnpjValidado && (
              <p className="text-xs text-green-600">CNPJ verificado com sucesso!</p>
            )}
          </div>
          
          {cnpjValidado && (
            <div className="grid gap-2">
              <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
              <Input
                id="nome_fantasia"
                placeholder="Nome Fantasia da Empresa"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                className="flex-1"
              />
              <p className="text-xs text-muted-foreground">
                Nome pelo qual a empresa é conhecida no mercado
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSolicitar} 
            disabled={isSolicitando || !cnpjValidado || !nomeFantasia.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSolicitando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Solicitando...
              </>
            ) : (
              'Solicitar Acesso'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
