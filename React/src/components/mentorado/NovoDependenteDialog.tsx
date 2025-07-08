
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createDependenteUser } from "@/lib/edge-functions-client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NovoDependenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mentoradoId: string;
}

export function NovoDependenteDialog({ open, onOpenChange, onSuccess, mentoradoId }: NovoDependenteDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    tipoDependente: "operacional" as "mentoria" | "operacional",
  });
  
  const [erros, setErros] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTipoDependenteChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tipoDependente: value as "mentoria" | "operacional"
    }));
  };
  
  // Mutation para criar dependente via Edge Function
  const criarDependenteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log("Iniciando criação de dependente:", data);
      
      const result = await createDependenteUser({
        email: data.email,
        nome: data.nome,
        mentoradoId: mentoradoId,
        cargo: data.cargo,
        tipoDependente: data.tipoDependente,
        // O nível de permissão será definido pelo mentor posteriormente
        permissionLevel: "leitura" // valor padrão temporário 
      });
      
      console.log("Resultado da criação:", result);
      
      if (!result.success) {
        throw new Error(result.message || "Erro ao criar dependente");
      }
      
      return result.data;
    },
    onSuccess: () => {
      toast({
        title: "Solicitação enviada",
        description: "A solicitação de cadastro do dependente foi enviada para aprovação do mentor."
      });
      
      setFormData({
        nome: "",
        email: "",
        cargo: "",
        tipoDependente: "operacional",
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      console.error("Erro na mutação:", error);
      
      toast({
        title: "Erro ao criar dependente",
        description: error.message || "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  });
  
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    if (!formData.nome) novosErros.nome = "Nome é obrigatório";
    if (!formData.email) novosErros.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      criarDependenteMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário Dependente</DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário dependente para seu perfil. O cadastro será enviado para aprovação do mentor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo*</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={erros.nome ? "border-red-500" : ""}
              />
              {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={erros.email ? "border-red-500" : ""}
              />
              {erros.email && <p className="text-xs text-red-500">{erros.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Dependente*</Label>
              <RadioGroup 
                value={formData.tipoDependente} 
                onValueChange={handleTipoDependenteChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mentoria" id="mentoria" />
                  <Label htmlFor="mentoria" className="cursor-pointer">Participante da Mentoria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="operacional" id="operacional" />
                  <Label htmlFor="operacional" className="cursor-pointer">Apenas Operacional</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.tipoDependente === "mentoria" 
                  ? "Terá acesso às informações de mentoria após aprovação do mentor"
                  : "Terá acesso apenas às funcionalidades operacionais após aprovação do mentor"}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={criarDependenteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={criarDependenteMutation.isPending}
            >
              {criarDependenteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : "Solicitar Cadastro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
