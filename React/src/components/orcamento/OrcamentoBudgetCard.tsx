
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, User } from 'lucide-react';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoBudgetCardProps {
  orcamento: OrcamentoEmpresa;
  onSelect: (id: string) => void;
}

export function OrcamentoBudgetCard({ orcamento, onSelect }: OrcamentoBudgetCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{orcamento.nome}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={orcamento.status === 'ativo' ? 'default' : 'secondary'}>
              {orcamento.status}
            </Badge>
            {orcamento.pode_editar !== undefined && (
              orcamento.pode_editar ? (
                <Badge variant="outline" className="text-green-600">Editar</Badge>
              ) : (
                <Badge variant="outline">Visualizar</Badge>
              )
            )}
          </div>
        </div>
        {orcamento.descricao && (
          <p className="text-sm text-muted-foreground">{orcamento.descricao}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{orcamento.empresa?.nome || 'Empresa não encontrada'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Ano {orcamento.ano}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Plano de Contas: DRE Padrão</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4"
          onClick={() => onSelect(orcamento.id)}
        >
          Abrir Orçamento
        </Button>
      </CardContent>
    </Card>
  );
}
