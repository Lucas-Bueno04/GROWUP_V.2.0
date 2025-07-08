
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, CalendarDays } from "lucide-react";
import { isGroupedMeta, isGroupedMetaEmpresa } from './metasGroupingUtils';

export const getTrendBadge = (melhorQuando: string | undefined) => {
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

export const formatarPeriodo = (meta: any) => {
  if (isGroupedMeta(meta) || isGroupedMetaEmpresa(meta)) {
    return meta.periodo_formatado;
  }
  
  if (meta.tipo_meta === 'anual') {
    return `${meta.ano}`;
  }
  
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return `${meses[meta.mes - 1] || meta.mes}/${meta.ano}`;
};

export const formatarValor = (valor: number, unidade?: string): string => {
  if (unidade === '%') {
    return `${valor.toFixed(2)}%`;
  }
  if (unidade === 'R$') {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  return `${valor.toLocaleString('pt-BR')} ${unidade || 'un'}`;
};

export const getMetaTitle = (meta: any) => {
  const indicador = meta.indicador;
  const periodo = formatarPeriodo(meta);
  const count = isGroupedMeta(meta) ? ` (${meta.count} meses)` : '';
  return `${indicador.nome} - ${periodo}${count}`;
};

export const getMetaEmpresaTitle = (meta: any) => {
  const indicador = meta.indicador_empresa || meta.indicador;
  const periodo = formatarPeriodo(meta);
  const count = isGroupedMetaEmpresa(meta) ? ` (${meta.count} meses)` : '';
  return `${indicador.nome} - ${periodo}${count}`;
};
