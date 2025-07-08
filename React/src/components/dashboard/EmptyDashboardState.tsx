
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Target, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface EmptyDashboardStateProps {
  title?: string;
  description?: string;
}

export function EmptyDashboardState({ 
  title = "Bem-vindo ao seu Dashboard!", 
  description = "Configure seus dados para começar a acompanhar a performance da sua empresa" 
}: EmptyDashboardStateProps) {
  const navigate = useNavigate();

  const passos = [
    {
      numero: 1,
      titulo: "Cadastre sua empresa",
      descricao: "Primeiro, adicione as informações da sua empresa",
      icon: Building2,
      action: () => navigate('/empresas'),
      buttonText: "Gerenciar Empresas"
    },
    {
      numero: 2,
      titulo: "Configure seu orçamento",
      descricao: "Defina seu plano de contas e valores orçamentários",
      icon: FileText,
      action: () => navigate('/orcamento'),
      buttonText: "Criar Orçamento"
    },
    {
      numero: 3,
      titulo: "Defina suas metas",
      descricao: "Estabeleça indicadores e metas para acompanhar",
      icon: Target,
      action: () => navigate('/metas'),
      buttonText: "Definir Metas"
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="text-center mb-8">
        <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {passos.map((passo) => (
          <Card key={passo.numero} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <passo.icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">
                {passo.numero}. {passo.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {passo.descricao}
              </p>
              <Button onClick={passo.action} className="w-full">
                {passo.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">💡</span>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Dica para começar
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Após configurar estes itens básicos, seu dashboard será preenchido automaticamente 
                com análises financeiras, gráficos de tendências e insights inteligentes sobre a 
                performance da sua empresa.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
