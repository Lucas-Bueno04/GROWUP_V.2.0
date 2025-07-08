
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Building, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MentoradoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/mentorados');
  };

  return (
    <div className="h-full">
      <Header
        title="Detalhes do Mentorado"
        actions={
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                  <p className="text-sm">{id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm">Ativo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email do mentorado será carregado aqui</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Telefone do mentorado será carregado aqui</span>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Informações da empresa do mentorado serão carregadas aqui.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional sections can be added here */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline">
                  Editar Mentorado
                </Button>
                <Button variant="outline">
                  Ver Empresas
                </Button>
                <Button variant="outline">
                  Ver Orçamentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
