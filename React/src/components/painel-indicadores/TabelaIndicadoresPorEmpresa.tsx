
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TabelaIndicadoresPorEmpresaProps {
  data: any;
}

export function TabelaIndicadoresPorEmpresa({ data }: TabelaIndicadoresPorEmpresaProps) {
  console.log('📊 TabelaIndicadoresPorEmpresa - Rendering with data:', data);

  if (!data) {
    console.log('⚠️ No data provided to table');
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando dados das empresas...
      </div>
    );
  }

  const empresas = data.empresas || [];
  const indicadoresPlano = data.indicadoresPlano || [];

  console.log('📊 Table data summary:', {
    empresas: empresas.length,
    indicadoresPlano: indicadoresPlano.length
  });

  if (empresas.length === 0) {
    console.log('⚠️ No companies found');
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="space-y-2">
          <p>Nenhuma empresa encontrada com dados de indicadores.</p>
          <p className="text-sm">Verifique se existem empresas ativas e com orçamentos cadastrados.</p>
        </div>
      </div>
    );
  }

  if (indicadoresPlano.length === 0) {
    console.log('⚠️ No plan indicators found');
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="space-y-2">
          <p>Nenhum indicador encontrado no plano de contas.</p>
          <p className="text-sm">Configure indicadores no plano de contas para visualizar os dados.</p>
        </div>
      </div>
    );
  }

  const getPorteBadgeVariant = (porte: string) => {
    switch (porte?.toLowerCase()) {
      case 'grande': return 'default';
      case 'medio': return 'secondary';
      case 'pequeno': return 'outline';
      default: return 'outline';
    }
  };

  const formatValue = (value: number | null | undefined, unidade: string) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '--';
    }
    
    if (unidade === '%') {
      return `${value.toFixed(1)}%`;
    }
    return `${value.toFixed(1)}${unidade}`;
  };

  console.log('✅ Rendering table with', empresas.length, 'companies and', indicadoresPlano.length, 'indicators');

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="text-center">Porte</TableHead>
              {indicadoresPlano.slice(0, 5).map((indicador) => (
                <TableHead key={indicador.codigo} className="text-center">
                  <div className="space-y-1">
                    <div className="font-medium">{indicador.codigo}</div>
                    <div className="text-xs text-muted-foreground">
                      {indicador.nome}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresaData) => {
              console.log('📊 Rendering row for company:', empresaData.empresa?.nome);
              
              return (
                <TableRow key={empresaData.empresa.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{empresaData.empresa.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {empresaData.empresa.setor}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getPorteBadgeVariant(empresaData.empresa.porte)}>
                      {empresaData.empresa.porte || 'Não definido'}
                    </Badge>
                  </TableCell>
                  {indicadoresPlano.slice(0, 5).map((indicador) => {
                    const indicadorCalculado = empresaData.indicadores?.find(
                      ind => ind.codigo === indicador.codigo
                    );
                    
                    return (
                      <TableCell key={indicador.codigo} className="text-center">
                        <div className="font-medium">
                          {formatValue(
                            indicadorCalculado?.valor,
                            indicador.unidade || '%'
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <div>
              <strong>Estatísticas:</strong> Exibindo {empresas.length} empresas com {indicadoresPlano.length} indicadores para o ano {data.ano || new Date().getFullYear()}.
            </div>
            <div>
              <strong>Informações:</strong> Os valores são calculados com base nas fórmulas dos indicadores e nos dados orçamentários realizados.
            </div>
            {empresas.length === 0 && (
              <div className="text-amber-600">
                <strong>Aviso:</strong> Não foram encontradas empresas com dados para exibição.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
