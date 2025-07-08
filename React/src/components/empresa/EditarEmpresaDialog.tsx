
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

interface EditarEmpresaDialogProps {
  empresaId: string;
  empresaData: {
    nome?: string;
    nome_fantasia?: string;
    cnpj?: string;
    setor?: string;
    porte?: string;
    telefone?: string;
    site?: string;
    regime_tributario?: string;
    regiao?: string;
    faturamento_anual_anterior?: number;
  };
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
    defaultValues: {
      nome: empresaData.nome || '',
      nome_fantasia: empresaData.nome_fantasia || '',
      setor: empresaData.setor || '',
      porte: empresaData.porte || '',
      telefone: empresaData.telefone || '',
      site: empresaData.site || '',
      regime_tributario: empresaData.regime_tributario || 'Lucro Presumido',
      regiao: empresaData.regiao || 'Sudeste',
      faturamento_anual_anterior: empresaData.faturamento_anual_anterior || 0,
    }
  });

  // Inicializar valor formatado do faturamento
  useEffect(() => {
    if (empresaData.faturamento_anual_anterior) {
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(empresaData.faturamento_anual_anterior);
      setFaturamentoFormatted(formatted);
    }
    
    // Guardar classificação anterior
    setPreviousClassification(empresaData.porte || '');
  }, [empresaData.faturamento_anual_anterior, empresaData.porte]);

  // Classificar automaticamente baseado no faturamento
  const classificarAutomaticamente = (faturamento: number) => {
    if (!faixas || faixas.length === 0) return;
    
    const faixaEncontrada = faixas.find(faixa => 
      faturamento >= faixa.valor_minimo && faturamento <= faixa.valor_maximo
    );
    
    if (faixaEncontrada) {
      setClassificacaoAutomatica(faixaEncontrada.nome);
      setValue('porte', faixaEncontrada.nome);
      
      // Mostrar notificação se a classificação mudou
      if (previousClassification && previousClassification !== faixaEncontrada.nome) {
        toast({
          title: "Classificação atualizada automaticamente",
          description: `A empresa foi reclassificada de "${previousClassification}" para "${faixaEncontrada.nome}" com base no faturamento informado.`,
        });
      }
    } else {
      // Se não encontrou faixa específica, usar a última (maior)
      const ultimaFaixa = faixas[faixas.length - 1];
      if (ultimaFaixa) {
        setClassificacaoAutomatica(ultimaFaixa.nome);
        setValue('porte', ultimaFaixa.nome);
        
        if (previousClassification && previousClassification !== ultimaFaixa.nome) {
          toast({
            title: "Classificação atualizada automaticamente",
            description: `A empresa foi reclassificada de "${previousClassification}" para "${ultimaFaixa.nome}" com base no faturamento informado.`,
          });
        }
      }
    }
  };

  // Handlers para campos select
  const handlePorteChange = (value: string) => {
    setValue('porte', value);
    setClassificacaoAutomatica(""); // Limpar classificação automática se alterado manualmente
  };

  const handleSetorChange = (value: string) => {
    setValue('setor', value);
  };

  const handleRegimeTributarioChange = (value: string) => {
    setValue('regime_tributario', value);
  };

  const handleRegiaoChange = (value: string) => {
    setValue('regiao', value);
  };

  // Handler para faturamento com máscara
  const handleFaturamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFaturamentoFormatted(formatted);
    
    const numericValue = parseCurrency(formatted);
    setValue('faturamento_anual_anterior', numericValue);
    
    // Classificar automaticamente
    classificarAutomaticamente(numericValue);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting data:", data);
      
      const { error } = await supabase
        .from('empresas')
        .update({
          nome: data.nome,
          nome_fantasia: data.nome_fantasia,
          setor: data.setor,
          porte: data.porte,
          telefone: data.telefone,
          site: data.site,
          regime_tributario: data.regime_tributario,
          regiao: data.regiao,
          faturamento_anual_anterior: Number(data.faturamento_anual_anterior) || 0
        })
        .eq('id', empresaId);
        
      if (error) throw error;

      // Atualizar classificação automática da empresa na tabela empresa_grupos
      const { error: grupoPorteError } = await supabase
        .from('empresa_grupos')
        .upsert({
          empresa_id: empresaId,
          grupo_tipo: 'porte',
          grupo_valor: data.porte
        }, {
          onConflict: 'empresa_id,grupo_tipo'
        });

      if (grupoPorteError) {
        console.error("Error updating porte classification:", grupoPorteError);
      }

      const { error: grupoSetorError } = await supabase
        .from('empresa_grupos')
        .upsert({
          empresa_id: empresaId,
          grupo_tipo: 'setor',
          grupo_valor: data.setor
        }, {
          onConflict: 'empresa_id,grupo_tipo'
        });

      if (grupoSetorError) {
        console.error("Error updating setor classification:", grupoSetorError);
      }

      // Trigger company classification after updating
      const { error: classificationError } = await supabase
        .rpc('classificar_empresa_por_receita', { p_empresa_id: empresaId });

      if (classificationError) {
        console.error("Error classifying company:", classificationError);
        // Don't throw - classification is not critical for the update
      }
      
      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso e a classificação foi recalculada automaticamente."
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar empresa:", error);
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message || "Não foi possível atualizar os dados da empresa.",
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="dados">Dados Oficiais</TabsTrigger>
              <TabsTrigger value="classificacao">Classificação</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Razão Social</Label>
                <Input id="nome" {...register('nome', { required: "Razão social é obrigatória" })} />
                {errors.nome && <p className="text-sm text-red-500">{errors.nome.message?.toString()}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input id="nome_fantasia" {...register('nome_fantasia', { required: "Nome fantasia é obrigatório" })} />
                {errors.nome_fantasia && <p className="text-sm text-red-500">{errors.nome_fantasia.message?.toString()}</p>}
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
                    <Select value={watch('porte')} onValueChange={handlePorteChange}>
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
                  <Select value={watch('setor')} onValueChange={handleSetorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Comércio">Comércio</SelectItem>
                        <SelectItem value="Indústria">Indústria</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Agronegócio">Agronegócio</SelectItem>
                        <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regime_tributario">Regime Tributário</Label>
                  <Select value={watch('regime_tributario')} onValueChange={handleRegimeTributarioChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o regime tributário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                        <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                        <SelectItem value="MEI">MEI</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regiao">Região</Label>
                  <Select value={watch('regiao')} onValueChange={handleRegiaoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Norte">Norte</SelectItem>
                        <SelectItem value="Nordeste">Nordeste</SelectItem>
                        <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                        <SelectItem value="Sudeste">Sudeste</SelectItem>
                        <SelectItem value="Sul">Sul</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faturamento_anual_anterior">Faturamento Anual Anterior</Label>
                <Input 
                  id="faturamento_anual_anterior" 
                  value={faturamentoFormatted}
                  onChange={handleFaturamentoChange}
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
