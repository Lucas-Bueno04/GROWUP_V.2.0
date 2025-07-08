
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Meta {
  id: string;
  nome?: string;
  valor_meta: number;
  valor_realizado: number;
  tipo_meta: string;
  mes: number;
  ano: number;
  indicador_proprio?: {
    nome: string;
    codigo: string;
    unidade?: string;
  };
}

interface GoalsProgressProps {
  metas: Meta[];
  isLoading?: boolean;
}

export function GoalsProgress({ metas, isLoading = false }: GoalsProgressProps) {
  const navigate = useNavigate();

  console.log('GoalsProgress - metas received:', metas);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso das Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando metas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metas || metas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso das Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma meta definida ainda.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Defina metas para seus indicadores e acompanhe o progresso.
            </p>
            <Button onClick={() => navigate('/metas')}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Meta
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const calcularProgresso = (meta: Meta): number => {
    if (!meta.valor_meta || meta.valor_meta === 0) return 0;
    return Math.min((meta.valor_realizado / meta.valor_meta) * 100, 100);
  };

  const obterStatusMeta = (progresso: number) => {
    if (progresso >= 100) return { icon: CheckCircle2, color: 'text-green-600', status: 'Concluída' };
    if (progresso >= 70) return { icon: Clock, color: 'text-blue-600', status: 'Em progresso' };
    if (progresso >= 30) return { icon: Clock, color: 'text-yellow-600', status: 'Iniciada' };
    return { icon: AlertCircle, color: 'text-red-600', status: 'Atrasada' };
  };

  const formatarValor = (valor: number, unidade?: string): string => {
    if (unidade === '%') {
      return `${valor.toFixed(1)}%`;
    }
    if (unidade === 'R$' || unidade === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    }
    return `${valor.toLocaleString('pt-BR')} ${unidade || 'un'}`;
  };

  const metasOrdenadas = metas
    .sort((a, b) => calcularProgresso(b) - calcularProgresso(a))
    .slice(0, 5); // Mostrar as 5 principais

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Progresso das Metas ({metas.length})
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/metas')}>
          Ver Todas
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {metasOrdenadas.map((meta) => {
          const progresso = calcularProgresso(meta);
          const status = obterStatusMeta(progresso);
          const StatusIcon = status.icon;
          
          return (
            <div key={meta.id} className="space-y-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {meta.indicador_proprio?.nome || meta.nome || 'Meta sem nome'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {meta.tipo_meta} • {meta.mes}/{meta.ano}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progresso: {progresso.toFixed(1)}%</span>
                  <span>
                    {formatarValor(meta.valor_realizado, meta.indicador_proprio?.unidade)} de{' '}
                    {formatarValor(meta.valor_meta, meta.indicador_proprio?.unidade)}
                  </span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>
            </div>
          );
        })}
        
        {metas.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/metas')}>
              Ver mais {metas.length - 5} meta(s)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
