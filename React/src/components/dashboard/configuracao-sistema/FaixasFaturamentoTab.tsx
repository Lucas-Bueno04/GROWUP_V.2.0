import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign, Plus, Trash2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { create } from "domain";
import { toast } from "sonner";
import { useToast } from '@/components/ui/use-toast';

const API_KEY = import.meta.env.VITE_SPRING_API;
const token = new JwtService().getToken();

interface SizeDTO {
  name: string,
  minValue: number,
  maxValue: number,
}

interface Size extends SizeDTO {
  id: number
}

const getAllSizes = async (): Promise<Size[]> => {
  const response = await axios.get(`${API_KEY}/size`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
}

const createSize = async(data:SizeDTO):Promise<void>=>{
  await axios.post(`${API_KEY}/size/create`,data,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

const updateSize = async (id: number, data: SizeDTO): Promise<void> => {
  await axios.put(`${API_KEY}/size/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

const deleteSize = async (id: number): Promise<void> => {
  await axios.delete(`${API_KEY}/size/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export function FaixasFaturamentoTab({ isLoadingFaixas }) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSizes();
  }, []);

  const loadSizes = async () => {
    const data = await getAllSizes();
    setSizes(data);
  }

  const handleDelete = async (id: number) => {
    await deleteSize(id);
    loadSizes();
  };

  const handleUpdate = async (size: Size) => {
    const { id, ...data } = size;
    await updateSize(id, data);
    loadSizes();
  };

  const handleLocalChange = (id: number, field: keyof SizeDTO, value: string | number) => {
    setSizes((prevSizes) =>
      prevSizes.map((size) =>
        size.id === id ? { ...size, [field]: field === 'name' ? value : Number(value) } : size
      )
    );
  };

  const onAdicionarFaixa = async() => {
    const newSize: SizeDTO = {
    name: "",
    minValue: 0,
    maxValue: 0,
    };
    
    await createSize(newSize);
    await loadSizes();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Faixas de Faturamento
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure as faixas de faturamento para agrupar empresas<br />similares e gerar comparativos mais precisos</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure as faixas para agrupamento de empresas por faturamento
              </p>
            </div>
            <Button onClick={onAdicionarFaixa} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Faixa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sizes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma faixa de faturamento configurada.</p>
                <p className="text-sm">Clique em "Nova Faixa" para começar.</p>
              </div>
            ) : (
              sizes.map((size) => (
                <div key={size.id} className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg">
                  <div className="col-span-2">
                    <Label htmlFor={`nome-${size.id}`}>Nome</Label>
                    <Input
                      id={`nome-${size.id}`}
                      value={size.name}
                      onChange={(e) => handleLocalChange(size.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`min-${size.id}`}>Valor Mínimo</Label>
                    <Input
                      id={`min-${size.id}`}
                      type="number"
                      value={size.minValue}
                      onChange={(e) => handleLocalChange(size.id, 'minValue', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`max-${size.id}`}>Valor Máximo</Label>
                    <Input
                      id={`max-${size.id}`}
                      type="number"
                      value={size.maxValue}
                      onChange={(e) => handleLocalChange(size.id, 'maxValue', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3 flex items-end">
                    <Button variant="outline" onClick={() => {handleUpdate(size); toast({title:"Faixa de faturamento salva.",description:"faixa de faturamento salva com sucesso."})}}>
                      Salvar
                    </Button>
                  </div>
                  <div className="col-span-3 flex justify-end items-end">
                    <div className="text-sm text-muted-foreground text-right mr-2">
                      <p>{formatCurrency(size.minValue)}</p>
                      <p>até {formatCurrency(size.maxValue)}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {handleDelete(size.id); toast({title:"Faixa de faturamento deletada.", description:"Faixa de faturamento deletada com sucesso"})}}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remover esta faixa de faturamento</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
