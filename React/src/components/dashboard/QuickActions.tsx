
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Building2, FileText, BarChart3, Calculator } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const acoes = [
    {
      titulo: "Novo Orçamento",
      descricao: "Criar orçamento",
      icon: Plus,
      action: () => navigate('/orcamentos'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      titulo: "Metas",
      descricao: "Definir metas",
      icon: Target,
      action: () => navigate('/metas'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      titulo: "Empresas",
      descricao: "Gerenciar",
      icon: Building2,
      action: () => navigate('/empresas'),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      titulo: "Análise",
      descricao: "Ver relatórios",
      icon: BarChart3,
      action: () => navigate('/gestao/analise-orcamentaria'),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {acoes.map((acao, index) => (
            <Button
              key={index}
              onClick={acao.action}
              className={`${acao.color} text-white w-full h-auto p-3 flex flex-col items-center gap-2 text-center`}
              variant="default"
            >
              <acao.icon className="h-5 w-5" />
              <div className="space-y-1">
                <div className="font-medium text-sm">{acao.titulo}</div>
                <div className="text-xs opacity-90">{acao.descricao}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
