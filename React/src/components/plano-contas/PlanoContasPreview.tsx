
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Grupo {
  id: string;
  codigo: string;
  nome: string;
  ordem: number;
  tipo_calculo: 'soma' | 'calculado' | 'manual';
  formula?: string | null;
}

interface Conta {
  id: string;
  grupo_id: string;
  codigo: string;
  nome: string;
  sinal: '+' | '-';
}

export function PlanoContasPreview() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar dados do plano de contas
  useEffect(() => {
    async function carregarPlanoContas() {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar grupos
        const { data: gruposData, error: gruposError } = await supabase
          .from('orcamento_grupos')
          .select('*')
          .order('ordem');
        
        if (gruposError) {
          throw new Error(`Erro ao carregar grupos: ${gruposError.message}`);
        }
        
        // Carregar contas
        const { data: contasData, error: contasError } = await supabase
          .from('orcamento_contas')
          .select('*')
          .order('codigo');
        
        if (contasError) {
          throw new Error(`Erro ao carregar contas: ${contasError.message}`);
        }
        
        setGrupos(gruposData || []);
        setContas(contasData || []);
      } catch (error: any) {
        console.error("Erro ao carregar plano de contas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    carregarPlanoContas();
  }, []);

  // Se estiver carregando
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando visualização DRE...</p>
        </div>
      </div>
    );
  }

  // Se houver erro
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <h3 className="font-medium text-lg">Erro ao carregar visualização</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se não houver dados
  if (!grupos.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Nenhum plano de contas encontrado</h3>
            <p className="text-muted-foreground">
              O plano de contas padrão ainda não foi configurado.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Função para obter as contas de um grupo
  const getContasDoGrupo = (grupoId: string) => {
    return contas.filter(conta => conta.grupo_id === grupoId).sort((a, b) => {
      // Ordenar por código (considerando possíveis números nos códigos)
      return a.codigo.localeCompare(b.codigo, undefined, { numeric: true });
    });
  };

  // Renderização da visualização DRE
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Demonstrativo de Resultados (DRE)</h3>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-32">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos.map((grupo) => (
                <React.Fragment key={grupo.id}>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">{grupo.codigo}</TableCell>
                    <TableCell className="font-medium">{grupo.nome}</TableCell>
                    <TableCell>
                      {grupo.tipo_calculo === 'calculado' ? 
                        `Calculado (${grupo.formula})` : 
                        grupo.tipo_calculo.charAt(0).toUpperCase() + grupo.tipo_calculo.slice(1)
                      }
                    </TableCell>
                  </TableRow>
                  
                  {/* Contas do grupo */}
                  {getContasDoGrupo(grupo.id).map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="pl-8">{conta.codigo}</TableCell>
                      <TableCell>
                        {conta.nome} 
                        <span className="text-muted-foreground ml-2">
                          ({conta.sinal})
                        </span>
                      </TableCell>
                      <TableCell>Conta</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
