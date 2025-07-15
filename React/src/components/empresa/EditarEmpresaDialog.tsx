
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
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassificationBadges } from "@/hooks/useCompanyClassification";

interface Size{
  name,
  minValue, 
  maxValue
}

interface Enterprise{
  id:number,
  cnpj:string,
  corporateName:string,
	tradeName:string,
	phone:string,
	email:string,
	size:Size,
	sector:string,
	region:string,
	invoicing:number,
  taxRegime:string
}

interface EditarEmpresaDialogProps {
  empresaId: number;
  empresaData: Enterprise;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

// Função para formatar valor monetário
const formatCurrency = (value: string) => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Converte para número e formata
  const numberValue = parseFloat(cleanValue) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numberValue);
};

// Função para converter valor formatado para número
const parseCurrency = (formattedValue: string): number => {
  const cleanValue = formattedValue.replace(/[^\d]/g, '');
  return parseFloat(cleanValue) / 100 || 0;
};

export function EditarEmpresaDialog({
  empresaId,
  empresaData,
  onSuccess,
  trigger
}: EditarEmpresaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dados");
  const [faturamentoFormatted, setFaturamentoFormatted] = useState("");
  const [classificacaoAutomatica, setClassificacaoAutomatica] = useState("");
  const [previousClassification, setPreviousClassification] = useState("");
  const { toast } = useToast();
  const { data: faixas, isLoading: isLoadingFaixas } = useClassificationBadges();

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
  });



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
        
        <form className="space-y-4 mt-4">
          <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="dados">Dados Oficiais</TabsTrigger>
              <TabsTrigger value="classificacao">Classificação</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Razão Social</Label>
                <Input id="nome" value={empresaData.corporateName}/>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input id="nome_fantasia" {...register('nome_fantasia', { required: "Nome fantasia é obrigatório" })} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" {...register('telefone')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site">Website</Label>
                <Input id="site" {...register('site')} placeholder="https://" />
              </div>
            </TabsContent>
            
            <TabsContent value="classificacao" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="porte">Porte da Empresa</Label>
                  {isLoadingFaixas ? (
                    <div className="flex items-center justify-center h-10 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Select value={watch('porte')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {faixas?.map((faixa) => (
                            <SelectItem key={faixa.id} value={faixa.nome}>
                              {faixa.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {classificacaoAutomatica && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 Classificação automática baseada no faturamento: <strong>{classificacaoAutomatica}</strong>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor</Label>
                  <Input id="sector" value={empresaData.sector}></Input>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regime_tributario">Regime Tributário</Label>
                  <Select value={empresaData.taxRegime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o regime tributário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Simples Nacional">SIMPLES NACIONAL</SelectItem>
                        <SelectItem value="Lucro Presumido">LUCRO PRESUMIDO</SelectItem>
                        <SelectItem value="Lucro Real">LUCRO REAL</SelectItem>
                        <SelectItem value="MEI">MEI</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regiao">Região</Label>
                  
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faturamento_anual_anterior">Faturamento Anual Anterior</Label>
                <Input 
                  id="faturamento_anual_anterior" 
                  value={faturamentoFormatted}
                  placeholder="R$ 0,00"
                />
                <p className="text-xs text-muted-foreground">
                  Este valor será usado para classificação automática da empresa por faixa de faturamento.
                </p>
                {faixas && faixas.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-2">Faixas de Classificação:</p>
                    <div className="space-y-1">
                      {faixas.map((faixa) => (
                        <div key={faixa.id} className="text-xs text-gray-600">
                          <span className="font-medium">{faixa.nome}:</span> {
                            new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(faixa.valor_minimo)
                          } - {
                            faixa.valor_maximo >= 999999999999 
                              ? 'Acima de ' + new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(faixa.valor_minimo)
                              : new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(faixa.valor_maximo)
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
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
