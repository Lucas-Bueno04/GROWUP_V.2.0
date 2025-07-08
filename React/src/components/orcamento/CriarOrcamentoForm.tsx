
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useCreateOrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';
import { useEmpresas } from '@/hooks/use-empresas';
import { toast } from 'sonner';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  ano: z.number().min(2020).max(2050),
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  permite_edicao_aluno: z.boolean().default(true),
  data_limite_edicao: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CriarOrcamentoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CriarOrcamentoForm({ onSuccess, onCancel }: CriarOrcamentoFormProps) {
  const { todasEmpresas } = useEmpresas();
  const empresas = todasEmpresas.data || [];
  const loadingEmpresas = todasEmpresas.isLoading;
  
  const createOrcamento = useCreateOrcamentoEmpresa();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ano: new Date().getFullYear(),
      empresa_id: '',
      permite_edicao_aluno: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        nome: data.nome,
        descricao: data.descricao,
        ano: data.ano,
        empresa_id: data.empresa_id,
        permite_edicao_aluno: data.permite_edicao_aluno,
        data_limite_edicao: data.data_limite_edicao?.toISOString().split('T')[0],
      };
      
      await createOrcamento.mutateAsync(submitData);
      
      toast.success('Orçamento criado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      toast.error('Erro ao criar orçamento');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Orçamento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Orçamento 2024 - Empresa ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição do orçamento..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="2020"
                    max="2050"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="empresa_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingEmpresas ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : (
                      empresas.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="permite_edicao_aluno"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Permitir Edição pelo Aluno
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Permite que o aluno edite os valores do orçamento
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch('permite_edicao_aluno') && (
          <FormField
            control={form.control}
            name="data_limite_edicao"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Limite para Edição (Opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecionar data limite</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createOrcamento.isPending}>
            {createOrcamento.isPending ? 'Criando...' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
