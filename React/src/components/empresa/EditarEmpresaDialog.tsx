import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Loader2, Save, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassificationBadges } from "@/hooks/useCompanyClassification";
import axios from "axios";
import { JwtService } from "@/components/auth/GetAuthParams";

interface Size {
  name: string;
  minValue: number;
  maxValue: number;
}

interface Enterprise {
  id: number;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  phone: string;
  email: string;
  size: Size;
  sector: string;
  region: string;
  invoicing: number;
  taxRegime: string;
}

interface EditarEmpresaDialogProps {
  empresaData: Enterprise;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const API_KEY = import.meta.env.VITE_SPRING_API;
const token = new JwtService().getToken();

const updateEnterprise = async (enterpriseData: Enterprise): Promise<void> => {
  await axios.put(`${API_KEY}/enterprise/update/${enterpriseData.id}`, enterpriseData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export function EditarEmpresaDialog({
  empresaData,
  onSuccess,
  trigger
}: EditarEmpresaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dados");
  const { toast } = useToast();
  const { data: faixas } = useClassificationBadges();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<Enterprise>();

  useEffect(() => {
    if (empresaData) {
      reset(empresaData);
    }
  }, [empresaData, reset]);

  const onSubmit = async (data: Enterprise) => {
    try {
      setIsSubmitting(true);
      await updateEnterprise(data);
      toast({ title: "Empresa atualizada com sucesso." });
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao atualizar empresa." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Pencil size={16} />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Atualize as informações da empresa. A classificação será atualizada automaticamente com base no faturamento.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="dados">Dados Oficiais</TabsTrigger>
              <TabsTrigger value="classificacao">Classificação</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              
            </TabsList>

            {/* DADOS OFICIAIS */}
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="corporateName">Razão Social</Label>
                <Input id="corporateName" {...register("corporateName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeName">Nome Fantasia</Label>
                <Input id="tradeName" {...register("tradeName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...register("phone")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} />
              </div>
            </TabsContent>

            {/* CLASSIFICAÇÃO */}
            <TabsContent value="classificacao" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Porte da Empresa</Label>
                  <Input
                    id="size"
                    value={empresaData.size?.name ?? ""}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Atividade Principal</Label>
                  <Input id="sector" {...register("sector")} />
                </div>

                <div className="space-y-2">
                  <Label>Regime Tributário</Label>
                  <Select
                    value={watch("taxRegime")}
                    onValueChange={(value) => setValue("taxRegime", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o regime tributário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEI">MEI</SelectItem>
                      <SelectItem value="SIMPLES NACIONAL" className="text-black dark:text-white" >SIMPLES NACIONAL</SelectItem>
                      <SelectItem value="LUCRO REAL" className="text-black dark:text-white">LUCRO REAL</SelectItem>
                      <SelectItem value="LUCRO PRESUMIDO" className="text-black dark:text-white" >LUCRO PRESUMIDO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Input id="region" {...register("region")} />
                </div>
              </div>
            </TabsContent>

            {/* FINANCEIRO */}
            <TabsContent value="financeiro" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoicing">Faturamento Anual Anterior</Label>
                <Input id="invoicing" type="number" {...register("invoicing")} />
                <p className="text-xs text-muted-foreground">
                  Este valor será usado para classificação automática da empresa por faixa de faturamento.
                </p>
              </div>
            </TabsContent>
            {/* ACESSOS */}
          


          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
