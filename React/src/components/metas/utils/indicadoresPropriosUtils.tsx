
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, CalendarDays, Hash, Percent } from "lucide-react";
import { MetaIndicadorEmpresaCompleta } from '@/types/metas.types';

export const getTrendBadge = (melhorQuando: string) => {
  if (melhorQuando === 'menor') {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <TrendingDown className="h-3 w-3" />
        Menor é Melhor
      </Badge>
    );
  }
  return (
    <Badge variant="default" className="flex items-center gap-1">
      <TrendingUp className="h-3 w-3" />
      Maior é Melhor
    </Badge>
  );
};

export const getTipoBadge = (tipoMeta: string) => {
  if (tipoMeta === 'anual') {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <CalendarDays className="h-3 w-3" />
        Anual
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      Mensal
    </Badge>
  );
};

export const getTipoValorBadge = (tipoValor: string) => {
  if (tipoValor === 'percentual') {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Percent className="h-3 w-3" />
        Percentual
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Hash className="h-3 w-3" />
      Valor
    </Badge>
  );
};

export const calcularProgresso = (valorMeta: number, valorRealizado: number, melhorQuando: string): number => {
  if (valorMeta === 0) return 0;
  
  if (melhorQuando === 'menor') {
    // Para indicadores onde menor é melhor, progresso é inverso
    const progresso = Math.max(0, 100 - ((valorRealizado / valorMeta) * 100));
    return Math.min(100, progresso);
  } else {
    // Para indicadores onde maior é melhor
    return Math.min(100, (valorRealizado / valorMeta) * 100);
  }
};

export const formatarValor = (valor: number, tipoValor: string, unidade: string): string => {
  if (tipoValor === 'percentual') {
    return `${valor.toFixed(2)}%`;
  }
  
  if (unidade === '%') {
    return `${valor.toFixed(2)}%`;
  }
  if (unidade === 'R$') {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  return `${valor.toLocaleString('pt-BR')} ${unidade}`;
};

export const formatarPeriodo = (meta: MetaIndicadorEmpresaCompleta) => {
  if (meta.tipo_meta === 'anual') {
    return `${meta.ano}`;
  }
  
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return `${meses[meta.mes - 1] || meta.mes}/${meta.ano}`;
};

export const getMetasDoIndicador = (indicadorId: string, metasIndicadoresProprios: MetaIndicadorEmpresaCompleta[]) => {
  return metasIndicadoresProprios.filter(meta => meta.indicador_empresa_id === indicadorId);
};
