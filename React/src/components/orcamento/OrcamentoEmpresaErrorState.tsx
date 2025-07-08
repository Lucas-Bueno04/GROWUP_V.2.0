
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OrcamentoEmpresaErrorStateProps {
  error: any;
}

export function OrcamentoEmpresaErrorState({ error }: OrcamentoEmpresaErrorStateProps) {
  console.error('OrcamentoEmpresaErrorState - Erro ao carregar dados:', error);
  
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="py-8">
        <div className="text-center text-red-400">
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p>Ocorreu um erro ao carregar os dados do orçamento.</p>
        </div>
      </CardContent>
    </Card>
  );
}
