
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GerenciarTemplates() {
  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Gerenciar Templates" 
        description="Gerencie os templates de plano de contas disponíveis"
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Templates Disponíveis
                </CardTitle>
                <CardDescription>
                  Crie e gerencie templates para seus mentorados
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Gestão de Templates em Desenvolvimento</p>
              <p className="text-sm mt-2">
                A funcionalidade de criação e edição de templates estará disponível em breve
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
