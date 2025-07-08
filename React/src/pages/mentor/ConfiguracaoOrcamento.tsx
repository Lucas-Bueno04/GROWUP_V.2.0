
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function ConfiguracaoOrcamento() {
  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Configuração de Orçamento" 
        description="Configure as opções de orçamento para seus mentorados"
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Gerencie as configurações do sistema de orçamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Configurações em Desenvolvimento</p>
              <p className="text-sm mt-2">
                As opções de configuração estarão disponíveis em breve
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
