
import React from 'react';
import { OrcamentoCellEditor } from './OrcamentoCellEditor';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy } from 'lucide-react';

interface OrcamentoGridCellProps {
  valor: number;
  contaId: string;
  mes: number;
  tipo: 'orcado' | 'realizado';
  podeEditar: boolean;
  editingCell: string | null;
  tempValues: Record<string, number>;
  isUpdating: boolean;
  onCellEdit: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onSaveValue: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
  onTempValueChange: (key: string, value: number) => void;
  onCancelEdit?: () => void;
  onReplicateValue?: (contaId: string, mes: number, tipo: 'orcado' | 'realizado') => void;
}

export function OrcamentoGridCell({
  valor,
  contaId,
  mes,
  tipo,
  podeEditar,
  editingCell,
  tempValues,
  isUpdating,
  onCellEdit,
  onSaveValue,
  onTempValueChange,
  onCancelEdit,
  onReplicateValue
}: OrcamentoGridCellProps) {
  const cellKey = `${contaId}-${mes}-${tipo}`;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Show copy button when user can edit, when not editing, and when not the last month
  const showCopyButton = podeEditar && editingCell !== cellKey && mes < 12;

  return (
    <td className="text-center p-2 min-w-[120px] w-[120px]">
      {editingCell === cellKey ? (
        <OrcamentoCellEditor
          value={tempValues[cellKey] || 0}
          onChange={(value) => onTempValueChange(cellKey, value)}
          onSave={() => onSaveValue(contaId, mes, tipo)}
          onCancel={onCancelEdit}
          isLoading={isUpdating}
        />
      ) : (
        <div className="relative group">
          <span
            className={`cursor-pointer hover:bg-gray-600 px-2 py-1 rounded block text-sm transition-colors text-gray-200 ${
              podeEditar ? 'hover:text-white' : 'cursor-not-allowed opacity-60'
            }`}
            onClick={() => podeEditar && onCellEdit(contaId, mes, tipo)}
          >
            {formatCurrency(valor)}
          </span>
          
          {showCopyButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReplicateValue?.(contaId, mes, tipo);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar para meses seguintes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </td>
  );
}
