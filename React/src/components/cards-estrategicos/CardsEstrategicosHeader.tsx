
import React from 'react';
import { Header } from '@/components/layout/Header';

export function CardsEstrategicosHeader({ 
  ano, 
}) {


  return (
    <Header 
      title="Cards Estratégicos" 
      description={`Análise estratégica de indicadores para o ano de ${ano}`}
      colorScheme="blue"
    />
  );
}
