
import { MetaIndicadorCompleta, MetaIndicadorEmpresaCompleta } from '@/types/metas.types';

export interface GroupedMeta {
  id: string; // ID do primeiro item do grupo
  ids: string[]; // IDs de todas as metas do grupo
  tipo_meta: 'mensal' | 'anual';
  tipo_valor: 'valor' | 'percentual';
  ano: number;
  valor_meta: number;
  descricao?: string;
  indicador: any;
  indicador_empresa?: any;
  meses: number[];
  count: number;
  periodo_formatado: string;
}

export interface GroupedMetaEmpresa {
  id: string;
  ids: string[];
  tipo_meta: 'mensal' | 'anual';
  tipo_valor: 'valor' | 'percentual';
  ano: number;
  valor_meta: number;
  descricao?: string;
  indicador_empresa: any;
  meses: number[];
  count: number;
  periodo_formatado: string;
}

export const groupIdenticalMetas = <T extends MetaIndicadorCompleta | MetaIndicadorEmpresaCompleta>(
  metas: T[]
): (T | GroupedMeta)[] => {
  if (metas.length === 0) return [];

  // Separar metas por chave de agrupamento
  const groups = new Map<string, T[]>();
  
  metas.forEach(meta => {
    // Chave única baseada nos campos que definem metas idênticas
    const indicadorId = 'indicador_id' in meta ? meta.indicador_id : meta.indicador_empresa_id;
    const key = `${indicadorId}-${meta.ano}-${meta.tipo_meta}-${meta.tipo_valor}-${meta.valor_meta}-${meta.descricao || ''}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(meta);
  });

  const result: (T | GroupedMeta)[] = [];

  groups.forEach(groupMetas => {
    if (groupMetas.length === 1) {
      // Meta única, adicionar normalmente
      result.push(groupMetas[0]);
    } else {
      // Múltiplas metas idênticas, agrupar
      const firstMeta = groupMetas[0];
      const meses = groupMetas
        .map(m => m.mes)
        .sort((a, b) => a - b);
      
      const periodoFormatado = formatarPeriodoAgrupado(meses, firstMeta.ano);
      
      const groupedMeta: GroupedMeta = {
        id: firstMeta.id,
        ids: groupMetas.map(m => m.id),
        tipo_meta: firstMeta.tipo_meta,
        tipo_valor: firstMeta.tipo_valor,
        ano: firstMeta.ano,
        valor_meta: firstMeta.valor_meta,
        descricao: firstMeta.descricao,
        indicador: 'indicador' in firstMeta ? firstMeta.indicador : undefined,
        indicador_empresa: 'indicador_empresa' in firstMeta ? firstMeta.indicador_empresa : undefined,
        meses,
        count: groupMetas.length,
        periodo_formatado: periodoFormatado
      };
      
      result.push(groupedMeta as any);
    }
  });

  return result.sort((a, b) => {
    // Ordenar por ano (desc) e depois por mês/período
    if (a.ano !== b.ano) {
      return b.ano - a.ano;
    }
    
    // Para metas agrupadas, usar o primeiro mês
    const aMes = 'meses' in a ? a.meses[0] : a.mes;
    const bMes = 'meses' in b ? b.meses[0] : b.mes;
    
    return bMes - aMes;
  });
};

export const groupIdenticalMetasEmpresa = (
  metas: MetaIndicadorEmpresaCompleta[]
): (MetaIndicadorEmpresaCompleta | GroupedMetaEmpresa)[] => {
  if (metas.length === 0) return [];

  // Separar metas por chave de agrupamento
  const groups = new Map<string, MetaIndicadorEmpresaCompleta[]>();
  
  metas.forEach(meta => {
    const key = `${meta.indicador_empresa_id}-${meta.ano}-${meta.tipo_meta}-${meta.tipo_valor}-${meta.valor_meta}-${meta.descricao || ''}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(meta);
  });

  const result: (MetaIndicadorEmpresaCompleta | GroupedMetaEmpresa)[] = [];

  groups.forEach(groupMetas => {
    if (groupMetas.length === 1) {
      result.push(groupMetas[0]);
    } else {
      const firstMeta = groupMetas[0];
      const meses = groupMetas
        .map(m => m.mes)
        .sort((a, b) => a - b);
      
      const periodoFormatado = formatarPeriodoAgrupado(meses, firstMeta.ano);
      
      const groupedMeta: GroupedMetaEmpresa = {
        id: firstMeta.id,
        ids: groupMetas.map(m => m.id),
        tipo_meta: firstMeta.tipo_meta,
        tipo_valor: firstMeta.tipo_valor,
        ano: firstMeta.ano,
        valor_meta: firstMeta.valor_meta,
        descricao: firstMeta.descricao,
        indicador_empresa: firstMeta.indicador_empresa,
        meses,
        count: groupMetas.length,
        periodo_formatado: periodoFormatado
      };
      
      result.push(groupedMeta);
    }
  });

  return result.sort((a, b) => {
    if (a.ano !== b.ano) {
      return b.ano - a.ano;
    }
    
    const aMes = 'meses' in a ? a.meses[0] : a.mes;
    const bMes = 'meses' in b ? b.meses[0] : b.mes;
    
    return bMes - aMes;
  });
};

export const formatarPeriodoAgrupado = (meses: number[], ano: number): string => {
  if (meses.length === 1) {
    const mesesNomes = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${mesesNomes[meses[0] - 1]}/${ano}`;
  }

  if (meses.length === 12 && meses.every((mes, index) => mes === index + 1)) {
    return `${ano} (Ano Completo)`;
  }

  // Detectar sequências consecutivas
  const sequences: number[][] = [];
  let currentSequence = [meses[0]];

  for (let i = 1; i < meses.length; i++) {
    if (meses[i] === meses[i - 1] + 1) {
      currentSequence.push(meses[i]);
    } else {
      sequences.push(currentSequence);
      currentSequence = [meses[i]];
    }
  }
  sequences.push(currentSequence);

  const mesesNomes = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const formatSequence = (seq: number[]) => {
    if (seq.length === 1) {
      return mesesNomes[seq[0] - 1];
    }
    return `${mesesNomes[seq[0] - 1]}-${mesesNomes[seq[seq.length - 1] - 1]}`;
  };

  const formattedSequences = sequences.map(formatSequence);
  return `${formattedSequences.join(', ')}/${ano}`;
};

export const isGroupedMeta = (meta: any): meta is GroupedMeta => {
  return 'meses' in meta && 'count' in meta && 'periodo_formatado' in meta;
};

export const isGroupedMetaEmpresa = (meta: any): meta is GroupedMetaEmpresa => {
  return 'meses' in meta && 'count' in meta && 'periodo_formatado' in meta && 'indicador_empresa' in meta;
};
