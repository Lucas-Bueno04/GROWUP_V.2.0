
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { resetUserPassword } from "@/lib/edge-functions-client";

interface NovoMentoradoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Função para validar CPF
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Função para formatar CPF
const formatarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar telefone
const formatarTelefone = (telefone: string) => {
  telefone = telefone.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

export function NovoMentoradoDialog({ open, onOpenChange, onSuccess }: NovoMentoradoDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    empresa: "",
  });
  
  const [erros, setErros] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      const cpfLimpo = value.replace(/[^\d]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cpfLimpo.length <= 11 ? formatarCPF(value) : prev.cpf
      }));
    } else if (name === "telefone") {
      setFormData(prev => ({
        ...prev,
        [name]: formatarTelefone(value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Mutation para criar mentorado e usuário
  const criarMentoradoMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // 1. Criar o mentorado no banco
      const { data: mentorado, error: mentoradoError } = await supabase
        .from('mentorados')
        .insert({
          nome: data.nome,
          email: data.email,
          cpf: data.cpf.replace(/[^\d]/g, ''),
          telefone: data.telefone,
          data_nascimento: data.dataNascimento,
          empresa: data.empresa,
          status: 'ativo'
        })
        .select()
        .single();
      
      if (mentoradoError) throw new Error(`Erro ao criar mentorado: ${mentoradoError.message}`);
      
      // 2. Criar usuário no auth com o mesmo email
      // Usar um UUID gerado aleatoriamente como senha temporária segura
      const senha = crypto.randomUUID().substring(0, 12);
      
      // Criar o usuário com confirmação de email automática
      const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: senha,
        email_confirm: true,
        user_metadata: {
          nome: data.nome,
          role: 'aluno'
        }
      });
      
      if (userError) {
        // Se falhar a criação do usuário, mantém o mentorado mas avisa
        console.error("Erro ao criar usuário:", userError);
        return { 
          mentorado, 
          userCreated: false, 
          message: `Mentorado criado, mas não foi possível criar o usuário: ${userError.message}`
        };
      }
      
      // 3. Enviar email de redefinição de senha
      let resetSent = false;
      let resetError = null;
      
      try {
        // Esperar 1 segundo para garantir que o usuário foi criado completamente
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enviar o email de redefinição de senha usando a Edge Function
        const resetResult = await resetUserPassword(data.email);
        resetSent = resetResult.success;
      } catch (error: any) {
        console.error("Erro ao enviar email de redefinição de senha:", error);
        resetError = error.message;
      }
      
      return { 
        mentorado, 
        user, 
        userCreated: true, 
        resetSent,
        resetError,
        temporaryPassword: senha,
        message: "Mentorado e usuário criados com sucesso!" 
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Mentorado criado com sucesso!",
        description: data.message
      });
      
      if (data.userCreated) {
        if (data.resetSent) {
          toast({
            title: "Email de acesso enviado",
            description: `Um email foi enviado para ${formData.email} com instruções para definir a senha.`,
            duration: 8000
          });
        } else {
          toast({
            title: "Credenciais de acesso",
            description: `Email: ${formData.email}\nSenha temporária: ${data.temporaryPassword}\n${data.resetError ? `Erro ao enviar email: ${data.resetError}` : ''}`,
            duration: 10000
          });
        }
      }
      
      setFormData({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        empresa: ""
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar mentorado",
        description: error.message,
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
    
    if (!formData.cpf) novosErros.cpf = "CPF é obrigatório";
    else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }
    
    if (!formData.telefone) novosErros.telefone = "Telefone é obrigatório";
    if (!formData.dataNascimento) novosErros.dataNascimento = "Data de nascimento é obrigatória";
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      criarMentoradoMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo Mentorado</DialogTitle>
          <DialogDescription>
            Cadastre um novo mentorado no sistema. Isso criará automaticamente um acesso para ele.
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF*</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  maxLength={14}
                  className={erros.cpf ? "border-red-500" : ""}
                />
                {erros.cpf && <p className="text-xs text-red-500">{erros.cpf}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone*</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={erros.telefone ? "border-red-500" : ""}
                />
                {erros.telefone && <p className="text-xs text-red-500">{erros.telefone}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className={erros.dataNascimento ? "border-red-500" : ""}
                />
                {erros.dataNascimento && <p className="text-xs text-red-500">{erros.dataNascimento}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={criarMentoradoMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={criarMentoradoMutation.isPending}
            >
              {criarMentoradoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : "Cadastrar Mentorado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
