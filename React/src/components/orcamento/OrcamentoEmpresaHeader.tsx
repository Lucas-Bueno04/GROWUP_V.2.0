
import React, { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { CompanyMedal } from '@/components/empresa/CompanyMedal';
import { useCompanyBadge } from '@/hooks/useCompanyBadge';
import { DeleteOrcamentoConfirmationDialog } from './DeleteOrcamentoConfirmationDialog';
import { useDeleteOrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoEmpresaHeaderProps {
  orcamento: OrcamentoEmpresa;
  podeEditar: boolean;
  onOrcamentoDeleted?: () => void;
}

export function OrcamentoEmpresaHeader({ 
  orcamento, 
  podeEditar, 
  onOrcamentoDeleted 
}: OrcamentoEmpresaHeaderProps) {
  const { data: badgeData } = useCompanyBadge(orcamento.empresa_id);
  const { user } = useAuth();
  const deleteOrcamentoMutation = useDeleteOrcamentoEmpresa();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isMentor = user?.role === 'mentor';
  const canDelete = isMentor && (orcamento.criado_por === user?.id || orcamento.mentor_responsavel === user?.id);

  const handleDeleteOrcamento = async () => {
    try {
      await deleteOrcamentoMutation.mutateAsync({
        orcamentoEmpresaId: orcamento.id
      });
      
      // Notificar componente pai que o orçamento foi excluído
      onOrcamentoDeleted?.();
    } catch (error) {
      console.error('Erro na exclusão do orçamento:', error);
    }
  };

  return (
    <>
      <CardHeader className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {badgeData?.classification && (
                <CompanyMedal 
                  classification={badgeData.classification} 
                  currentRevenue={badgeData.currentRevenue}
                  size="sm" 
                  showProgress={false}
                />
              )}
              <div>
                <CardTitle className="flex items-center gap-3 text-gray-100">
                  {orcamento.nome}
                  <Badge 
                    variant={orcamento.status === 'ativo' ? 'default' : 'secondary'}
                    className={orcamento.status === 'ativo' 
                      ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                      : 'bg-gray-600/20 text-gray-400 border-gray-600/30'
                    }
                  >
                    {orcamento.status}
                  </Badge>
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                {orcamento.empresa?.nome}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ano {orcamento.ano}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {podeEditar ? (
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">
                <Edit className="h-3 w-3 mr-1" />
                Modo Edição
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-600/20 text-gray-400 border-gray-600/30">
                <Eye className="h-3 w-3 mr-1" />
                Somente Leitura
              </Badge>
            )}
            
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Orçamento
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <DeleteOrcamentoConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        orcamento={orcamento}
        onConfirm={handleDeleteOrcamento}
      />
    </>
  );
}
