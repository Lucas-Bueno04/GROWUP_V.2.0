
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, FileText, Building2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentActivityProps {
  orcamentos: any[];
  alertas: any[];
  empresas: any[];
}

export function RecentActivity({ orcamentos, alertas, empresas }: RecentActivityProps) {
  const atividades = [
    ...orcamentos.map(orcamento => ({
      id: `orcamento-${orcamento.id}`,
      tipo: 'orcamento',
      titulo: `Orçamento ${orcamento.nome}`,
      descricao: orcamento.descricao || 'Orçamento criado',
      data: orcamento.created_at,
      icon: FileText,
      color: 'text-blue-600'
    })),
    ...alertas.map(alerta => ({
      id: `alerta-${alerta.id}`,
      tipo: 'alerta',
      titulo: alerta.title,
      descricao: alerta.description,
      data: alerta.created_at,
      icon: AlertTriangle,
      color: 'text-orange-600'
    })),
    ...empresas.map(empresa => ({
      id: `empresa-${empresa.id}`,
      tipo: 'empresa',
      titulo: `Empresa ${empresa.nome}`,
      descricao: `Setor: ${empresa.setor}`,
      data: empresa.created_at,
      icon: Building2,
      color: 'text-green-600'
    }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5);

  if (atividades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma atividade recente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {atividades.map((atividade) => (
          <div key={atividade.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-muted ${atividade.color}`}>
              <atividade.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{atividade.titulo}</p>
                <Badge variant="outline" className="text-xs">
                  {atividade.tipo}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {atividade.descricao}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(atividade.data), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
