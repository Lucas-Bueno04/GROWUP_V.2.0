
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, Building2, Users, BarChart3 } from 'lucide-react';

export default function MentorDashboard() {
  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Painel do Mentor" 
        description="Gerencie suas ferramentas e acompanhe seus mentorados"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Plan of Accounts Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Plano de Contas
            </CardTitle>
            <CardDescription>
              Gerencie templates e estruturas do plano de contas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/plano-contas">
                Gerenciar Templates
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Companies Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todas as empresas cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/empresas">
                Ver Empresas
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Admin Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administração
            </CardTitle>
            <CardDescription>
              Acesse ferramentas de administração do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin">
                Painel Admin
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo de Atividades
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso e atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Dashboard de métricas em desenvolvimento</p>
              <p className="text-sm mt-2">
                Em breve você poderá acompanhar estatísticas detalhadas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
