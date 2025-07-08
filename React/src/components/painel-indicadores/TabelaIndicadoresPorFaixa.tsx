
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

interface TabelaIndicadoresPorFaixaProps {
  data: any;
}

export function TabelaIndicadoresPorFaixa({ data }: TabelaIndicadoresPorFaixaProps) {
  console.log('TabelaIndicadoresPorFaixa - Data:', data);

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando dados das faixas de faturamento...
      </div>
    );
  }

  const faixasFaturamento = data.faixasFaturamento || [];
  const indicadoresPlano = data.indicadoresPlano || [];

  if (indicadoresPlano.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum indicador encontrado no plano de contas.
      </div>
    );
  }

  const getFaixaBadgeVariant = (nome: string) => {
    const nomeNormalizado = nome.toLowerCase();
    if (nomeNormalizado.includes('mei') || nomeNormalizado.includes('newborn') || nomeNormalizado.includes('pequeno')) return 'outline';
    if (nomeNormalizado.includes('médio') || nomeNormalizado.includes('medio') || nomeNormalizado.includes('scaler')) return 'secondary';
    if (nomeNormalizado.includes('grande') || nomeNormalizado.includes('authority')) return 'destructive';
    return 'default';
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRangeForFaixa = (faixaData: any) => {
    // Usar dados do banco (valor_minimo/valor_maximo)
    if (faixaData.valor_minimo !== undefined && faixaData.valor_maximo !== undefined) {
      const min = formatCurrency(faixaData.valor_minimo);
      const max = faixaData.valor_maximo >= 999999999999 ? 'Sem limite' : formatCurrency(faixaData.valor_maximo);
      return `${min} - ${max}`;
    }
    
    // Fallback para dados antigos da interface (valorMinimo/valorMaximo)
    if (faixaData.valorMinimo !== undefined && faixaData.valorMaximo !== undefined) {
      const min = formatCurrency(faixaData.valorMinimo);
      const max = faixaData.valorMaximo >= 999999999999 ? 'Sem limite' : formatCurrency(faixaData.valorMaximo);
      return `${min} - ${max}`;
    }
    
    // Fallback para dados muito antigos baseados no nome
    const nome = faixaData.nome?.toLowerCase() || '';
    if (nome.includes('mei') || nome.includes('newborn') || nome.includes('pequeno')) return 'Até R$ 360K';
    if (nome.includes('médio') || nome.includes('medio') || nome.includes('scaler')) return 'R$ 360K - R$ 4.8M';
    if (nome.includes('grande') || nome.includes('authority')) return 'Acima de R$ 4.8M';
    return 'Não definido';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Faixa de Faturamento</TableHead>
              <TableHead className="text-center">Empresas</TableHead>
              {indicadoresPlano.slice(0, 4).map((indicador) => (
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
            {faixasFaturamento.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma faixa de faturamento configurada.
                </TableCell>
              </TableRow>
            ) : (
              faixasFaturamento.map((faixaData) => (
                <TableRow key={faixaData.id || faixaData.faixa || faixaData.nome}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <Badge variant={getFaixaBadgeVariant(faixaData.nome)}>
                          {faixaData.nome.split(' ')[0].toUpperCase()}
                        </Badge>
                        {faixaData.nome}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getRangeForFaixa(faixaData)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {faixaData.totalEmpresas || 0}
                    </Badge>
                  </TableCell>
                  {indicadoresPlano.slice(0, 4).map((indicador) => {
                    const indicadorCalculado = faixaData.indicadores?.find(
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <div>
              <strong>Sistema Otimizado:</strong> As faixas de faturamento são agora 
              gerenciadas diretamente no banco de dados para melhor performance e consistência.
            </div>
            <div>
              <strong>Configuração:</strong> As faixas são totalmente configuráveis no menu 
              "Configuração do Sistema" e aplicadas automaticamente em todos os cálculos.
            </div>
            {faixasFaturamento.length === 0 && (
              <div className="text-amber-600">
                <strong>Aviso:</strong> Nenhuma faixa de faturamento configurada. 
                Configure as faixas no menu "Configuração do Sistema".
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
