
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Dependente {
  id: string;
  nome: string;
  email: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  tipo_dependente?: "mentoria" | "operacional";
}

interface EditarDependentePerfilDialogProps {
  dependente: Dependente;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormData {
  nome: string;
  email: string;
  cargo: string;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  tipo_dependente: "mentoria" | "operacional";
}

export function EditarDependentePerfilDialog({ 
  dependente, 
  open, 
  onOpenChange, 
  onSuccess 
}: EditarDependentePerfilDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      nome: dependente.nome,
      email: dependente.email,
      cargo: dependente.cargo || "",
      permission_level: dependente.permission_level,
      tipo_dependente: dependente.tipo_dependente || "operacional",
    }
  });

  const permissionLevel = watch("permission_level");
  const tipoDependente = watch("tipo_dependente");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // TODO: Implementar chamada para API de atualização de dependente
      console.log("Updating dependente:", { id: dependente.id, ...data });
      
      toast({
        title: "Dependente atualizado",
        description: "As informações do dependente foram atualizadas com sucesso.",
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao atualizar dependente",
        description: "Não foi possível atualizar as informações do dependente.",
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

  const getPermissionLevelLabel = (level: string) => {
    switch (level) {
      case "leitura":
        return "Leitura";
      case "escrita_basica":
        return "Escrita Básica";
      case "escrita_completa":
        return "Escrita Completa";
      case "admin":
        return "Admin";
      default:
        return "Leitura";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Dependente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome completo do dependente"
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
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                {...register("cargo")}
                placeholder="Cargo ou função"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_dependente">Tipo de Dependente *</Label>
              <Select
                value={tipoDependente}
                onValueChange={(value) => setValue("tipo_dependente", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentoria">Participante da Mentoria</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="permission_level">Nível de Permissão *</Label>
              <Select
                value={permissionLevel}
                onValueChange={(value) => setValue("permission_level", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leitura">Leitura</SelectItem>
                  <SelectItem value="escrita_basica">Escrita Básica</SelectItem>
                  <SelectItem value="escrita_completa">Escrita Completa</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Nível atual: {getPermissionLevelLabel(permissionLevel)}
              </p>
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
