
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function EditorTemplate() {
  const { templateId } = useParams();

  if (!templateId) {
    return <Navigate to="/mentor/plano-contas" replace />;
  }

  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Editor de Template" 
        description="Edite e configure seu template de plano de contas"
      />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template: {templateId}
            </CardTitle>
            <CardDescription>
              Configure a estrutura do seu template de plano de contas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Editor em Desenvolvimento</p>
              <p className="text-sm mt-2">
                O editor de templates estará disponível em breve
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
