
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMentorados } from "@/hooks/use-mentorados";
import { Mentorado } from "@/types/mentorado";

interface EditarMentoradoDialogProps {
  mentorado: Mentorado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  empresa: string;
}

export function EditarMentoradoDialog({ 
  mentorado, 
  open, 
  onOpenChange, 
  onSuccess 
}: EditarMentoradoDialogProps) {
  const { toast } = useToast();
  const { atualizarMentorado } = useMentorados();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      nome: mentorado.nome,
      email: mentorado.email,
      telefone: mentorado.telefone,
      dataNascimento: mentorado.dataNascimento,
      empresa: mentorado.empresa || "",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const updatedMentorado: Mentorado = {
        ...mentorado,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        empresa: data.empresa,
      };

      atualizarMentorado(updatedMentorado);
      
      toast({
        title: "Mentorado atualizado",
        description: "As informações do mentorado foram atualizadas com sucesso.",
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao atualizar mentorado",
        description: "Não foi possível atualizar as informações do mentorado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Mentorado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome completo do mentorado"
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email inválido"
                  }
                })}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={mentorado.cpf}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">CPF não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register("telefone")}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                {...register("dataNascimento")}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                {...register("empresa")}
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
