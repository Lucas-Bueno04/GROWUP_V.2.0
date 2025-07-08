
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface RegistrarHistoricoDialogProps {
  empresaId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function RegistrarHistoricoDialog({
  empresaId,
  onSuccess,
  trigger
}: RegistrarHistoricoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      descricao: '',
    }
  });

  const onSubmit = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    
    try {
      // Get current date properly formatted
      const currentDate = new Date();
      const isoDate = currentDate.toISOString();
      
      // Inserir registro no histórico da empresa
      const { error } = await supabase
        .from('empresa_historico')
        .insert({
          empresa_id: empresaId,
          descricao: data.descricao,
          data_registro: isoDate,
        });
        
      if (error) throw error;
      
      toast({
        title: "Registro adicionado",
        description: "O registro foi adicionado ao histórico da empresa."
      });
      
      reset();
      
      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
    } catch (error: any) {
      console.error("Erro ao registrar histórico:", error);
      toast({
        title: "Erro ao registrar histórico",
        description: error.message || "Não foi possível adicionar o registro ao histórico.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-1">
            <PlusCircle size={16} />
            Adicionar registro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar registro ao histórico</DialogTitle>
          <DialogDescription>
            Informe os detalhes do registro a ser adicionado ao histórico da empresa.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              {...register('descricao', { 
                required: "Descrição é obrigatória", 
                minLength: { value: 10, message: "A descrição deve ter pelo menos 10 caracteres" }
              })} 
              rows={5}
              placeholder="Descreva os detalhes do registro..."
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao.message?.toString()}</p>}
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
