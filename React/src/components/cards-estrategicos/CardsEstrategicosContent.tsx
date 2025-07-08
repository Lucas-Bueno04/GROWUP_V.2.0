
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IndicadorEstrategico } from '@/hooks/cards-estrategicos';
import { StrategicCard, StrategicChart, StrategicList } from '@/components/cards-estrategicos';

interface CardsEstrategicosContentProps {
  indicadoresFiltrados: IndicadorEstrategico[];
}

export function CardsEstrategicosContent({ indicadoresFiltrados }: CardsEstrategicosContentProps) {
  const renderIndicador = (indicador: IndicadorEstrategico) => {
    const codigo = indicador.codigo || 'N/A';
    console.log(`Rendering indicator ${codigo} with visualization type: ${indicador.tipoVisualizacao}`);
    
    switch (indicador.tipoVisualizacao) {
      case 'chart':
        return <StrategicChart key={indicador.id} indicadorEstrategico={indicador} />;
      case 'list':
        return <StrategicList key={indicador.id} indicadorEstrategico={indicador} />;
      default:
        return <StrategicCard key={indicador.id} indicadorEstrategico={indicador} />;
    }
  };

  // Separar indicadores por tipo
  const indicadoresPlanoContas = indicadoresFiltrados.filter(i => i.tipo === 'plano-contas');
  const indicadoresPropriosEmpresa = indicadoresFiltrados
    .filter(i => i.tipo === 'empresa')
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0)); // Ordenar por campo ordem

  if (indicadoresFiltrados.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-lg font-medium">Nenhum indicador corresponde aos filtros</p>
            <p className="text-muted-foreground">
              Ajuste os filtros para ver mais resultados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicadores do Plano de Contas */}
      {indicadoresPlanoContas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h3 className="text-lg font-semibold">Indicadores do Plano de Contas</h3>
            <span className="text-sm text-muted-foreground">({indicadoresPlanoContas.length})</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicadoresPlanoContas.map(renderIndicador)}
          </div>
        </div>
      )}

      {/* Indicadores Próprios da Empresa - Grade Única Ordenada */}
      {indicadoresPropriosEmpresa.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h3 className="text-lg font-semibold">Indicadores Próprios da Empresa</h3>
            <span className="text-sm text-muted-foreground">({indicadoresPropriosEmpresa.length})</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicadoresPropriosEmpresa.map(renderIndicador)}
          </div>
        </div>
      )}
    </div>
  );
}
