
import React from 'react';
import { IndicadorEmpresa, MetaIndicadorEmpresaCompleta } from '@/types/metas.types';
import { IndicadoresPropriosEmptyState } from './components/IndicadoresPropriosEmptyState';
import { IndicadoresPropriosGrid } from './components/IndicadoresPropriosGrid';
import { MetasIndicadoresPropriosTable } from './components/MetasIndicadoresPropriosTable';

interface IndicadoresPropriosTableProps {
  indicadores: IndicadorEmpresa[];
  metasIndicadoresProprios: MetaIndicadorEmpresaCompleta[];
  empresaId?: string | null;
}

export function IndicadoresPropriosTable({ 
  indicadores, 
  metasIndicadoresProprios,
  empresaId 
}: IndicadoresPropriosTableProps) {
  console.log('=== IndicadoresPropriosTable ===');
  console.log('Received indicadores:', indicadores.length);
  console.log('Received metas:', metasIndicadoresProprios.length);
  console.log('Empresa ID:', empresaId);

  if (indicadores.length === 0) {
    return <IndicadoresPropriosEmptyState />;
  }

  return (
    <div className="space-y-6">
      <IndicadoresPropriosGrid 
        indicadores={indicadores}
        metasIndicadoresProprios={metasIndicadoresProprios}
      />
      
      <MetasIndicadoresPropriosTable 
        metasIndicadoresProprios={metasIndicadoresProprios}
      />
    </div>
  );
}
