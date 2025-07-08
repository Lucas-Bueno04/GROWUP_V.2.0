
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function OrcamentoEmpresaLoadingState() {
  console.log('OrcamentoEmpresaLoadingState - Renderizando loading');
  
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-gray-400" />
        <span className="text-gray-300">Carregando orçamento...</span>
      </CardContent>
    </Card>
  );
}
