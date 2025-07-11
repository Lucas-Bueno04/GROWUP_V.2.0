
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { PlanoContasDirectDB } from '@/components/plano-contas/PlanoContasDirectDB';

export default function PlanoContasUnifiedPage() {

  return (
    <ErrorBoundary>
      <>
        <Helmet>
          <title>Gestão do Plano de Contas DRE</title>
        </Helmet>

        <div className="container mx-auto px-6 py-6">
          <Header 
            title="Gestão do Plano de Contas DRE"
            description="Visualize e gerencie a estrutura DRE específica para escritórios contábeis."
            colorScheme="yellow"
          />
          
          <div className="mt-6 space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Nova Estrutura DRE para Escritórios Contábeis</AlertTitle>
              <AlertDescription>
                O plano de contas foi reestruturado com 11 grupos principais específicos para escritórios contábeis, 
                seguindo uma estrutura DRE otimizada que permite melhor controle e análise financeira.
              </AlertDescription>
            </Alert>

            <PlanoContasDirectDB />
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
}
