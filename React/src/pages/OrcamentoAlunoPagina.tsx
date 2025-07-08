
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function OrcamentoAlunoPagina() {
  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Orçamento" 
        description="Gerencie seu planejamento financeiro"
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Planejamento Financeiro
            </CardTitle>
            <CardDescription>
              Funcionalidade de orçamento foi removida temporariamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Módulo de Orçamento Removido</p>
              <p className="text-sm mt-2">
                O módulo de orçamento foi removido conforme solicitado. 
                Apenas a funcionalidade de plano de contas permanece disponível para mentores.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
