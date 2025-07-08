
import React from 'react';
import { Header } from '@/components/layout/Header';

interface CardsEstrategicosHeaderProps {
  totalIndicadores: number;
  ano: number;
  stats?: {
    total: number;
    acima: number;
    dentro: number;
    abaixo: number;
  } | null;
}

export function CardsEstrategicosHeader({ 
  totalIndicadores, 
  ano, 
  stats 
}: CardsEstrategicosHeaderProps) {
  // Only show stats badges if we have meaningful data
  const headerBadges = stats && stats.total > 0 ? [
    { 
      label: `${stats.total} indicadores`, 
      variant: "outline" as const 
    },
    { 
      label: `Acima da meta: ${stats.acima}`, 
      variant: "default" as const 
    },
    { 
      label: `Na meta: ${stats.dentro}`, 
      variant: "secondary" as const 
    },
    { 
      label: `Abaixo da meta: ${stats.abaixo}`, 
      variant: "destructive" as const 
    }
  ] : [];

  return (
    <Header 
      title="Cards Estratégicos" 
      description={`Análise estratégica de indicadores para o ano de ${ano}`}
      colorScheme="blue"
      badges={headerBadges}
    />
  );
}
